import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStorage, useUser } from "./FirebaseProvider";
import {
  ref,
  listAll,
  getDownloadURL,
  StorageReference,
  FirebaseStorage,
} from "@firebase/storage";
import { rootFolder } from "../../FamilyGallery";
import {
  downloadAsync,
  documentDirectory,
  deleteAsync,
  readDirectoryAsync,
  makeDirectoryAsync,
  getInfoAsync,
} from "expo-file-system";

export type GalleryProviderProps = {
  children: ReactNode;
};
export type DBAlbums = {
  [key: string]: StorageReference[];
};
export type Albums = {
  [key: string]: MyFile[];
};
export type MyFolder = {
  [key: string]: (MyFile | MyFolder)[];
};
export type MyFile = { fileName: string; uri: string };

const init = {} as Albums;

export const GalleryContext = createContext(init);
export const SetGalleryContext = createContext(
  undefined as undefined | (() => void)
);

export function useGallery() {
  return useContext(GalleryContext);
}
export function useSetGallery() {
  return useContext(SetGalleryContext);
}

export const folderPath = (albumnName?: string) =>
  albumnName
    ? [(documentDirectory || "") + rootFolder, albumnName].join("/")
    : (documentDirectory || "") + rootFolder;

const checkFolder = async (path: string) => {
  return getInfoAsync(path).then((info) => {
    if (!info.exists) return makeDirectoryAsync(path);
  });
};

const getdbAlbumns = (_ref: StorageReference): Promise<DBAlbums> => {
  return listAll(_ref)
    .then((rootRet) => rootRet.prefixes)
    .then((dbfolders) =>
      Promise.all(
        dbfolders.map((folder) => {
          const dbalbumnRef = ref(_ref.storage, folder.fullPath);
          return listAll(dbalbumnRef).then((dbalbumnRet) => {
            return { [folder.name]: dbalbumnRet.items };
          });
        })
      ).then((results) => Object.assign({}, ...results) as DBAlbums)
    );
};

const getAlbums = async (root: string) => {
  root = root.endsWith("/") ? root : root + "/";

  const albums = {} as Albums;
  const albumNames = await readDirectoryAsync(root);
  const folderPromises = [] as Promise<void>[];

  const get = async (location: string) => {
    location = location.endsWith("/") ? location : location + "/";
    return await readDirectoryAsync(location).then((folder) =>
      folder.map((fileName) => {
        return {
          fileName,
          uri: location + fileName,
        } as MyFile;
      })
    );
  };

  albumNames.map((name) => {
    folderPromises.push(
      get(root + name).then((files) => {
        albums[name] = files;
      })
    );
  });

  return Promise.all(folderPromises).then(() => albums);
};

const compareDeletes = (dbalbums: DBAlbums, albums: Albums) => {
  const ret = {} as Albums;
  for (const key in albums) {
    if (!dbalbums[key]) {
      ret[key] = albums[key];
      continue;
    }
    const haystack = dbalbums[key].map((file) => file.name); //key: dtkelly
    ret[key] = albums[key].filter((file) => !haystack.includes(file.fileName));
  }
  return ret;
};

const compareDownloads = (dbalbums: DBAlbums, albums: Albums) => {
  const ret = {} as DBAlbums;
  for (const key in dbalbums) {
    if (!albums[key]) {
      ret[key] = dbalbums[key];
      continue;
    }
    const haystack = albums[key].map((file) => file.fileName);
    ret[key] = dbalbums[key].filter((file) => !haystack.includes(file.name));
  }
  return ret;
};

const handleDeletes = (albums: Albums) => {
  //console.log("deleting:", Object.entries(albums).map(([key, value]) => { return { [key]: value.map(file => file.fileName) } }))

  const promises = [] as Promise<{ isDeleted: boolean; fileName: string }>[];
  for (const key in albums) {
    const album = albums[key];
    album.map((file) => {
      promises.push(
        deleteAsync(file.uri)
          .then(() => {
            return { isDeleted: true, fileName: file.fileName };
          })
          .catch((error) => {
            console.log(error);
            return { isDeleted: false, fileName: file.fileName };
          })
      );
    });
  }
  return Promise.all(promises);
};

const handleDownloads = (storage: FirebaseStorage, dbalbums: DBAlbums) => {
  // console.log("downloading:", Object.entries(dbalbums).map(([key, value]) => { return { [key]: value.map(file => file.name) } }))

  const promises = [] as Promise<{
    isDownloaded: boolean;
    localUri?: string;
  }>[];
  for (const key in dbalbums) {
    const dbalbum = dbalbums[key];
    dbalbum.map((file) => {
      const fileRef = ref(storage, file.fullPath);
      const _folderPath = folderPath(key);
      promises.push(
        getInfoAsync(_folderPath)
          .then(({ exists, isDirectory }) => {
            if (exists && isDirectory) return;
            else
              return makeDirectoryAsync(_folderPath, { intermediates: true });
          })
          .then(() => getDownloadURL(fileRef))
          .then((downloadUrl) =>
            downloadAsync(downloadUrl, [_folderPath, file.name].join("/"))
          )
          .then((result) => {
            return {
              isDownloaded: !!(result.status === 200),
              localUri: result.uri,
            };
          })
          .catch((error) => {
            console.error(error);
            return { isDownloaded: false, localUri: undefined };
          })
      );
    });
  }
  return Promise.all(promises);
};

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  const [state, setstate] = useState(init);
  const [loading, setloading] = useState(true);
  const storage = useStorage();
  const user = useUser();
  const rootRef = ref(storage!, rootFolder);

  useEffect(() => {
    handleSyncGallery().then(() => handleSetState());
  }, []);

  const handleSetState = () => {
    getAlbums(folderPath()).then((albums) => setstate(albums));
  };

  const handleSyncGallery = async () => {
    try {
      await checkFolder(folderPath());
      const dbalbums = await getdbAlbumns(rootRef);
      //console.log("dbalbums:", Object.entries(dbalbums).map(([key, value]) => { return { [key]: value.map(file => file.name) } }))
      const albums = await getAlbums(folderPath());
      //console.log("albums:", Object.entries(albums).map(([key, value]) => { return { [key]: value.map(file => file.fileName) } }))
      const deletes = compareDeletes(dbalbums, albums);
      const downloads = compareDownloads(dbalbums, albums);
      deletes && (await handleDeletes(deletes));
      downloads && (await handleDownloads(storage!, downloads));
    } catch (error) {
      console.error(error);
    }
    setloading(false);
  };

  return (
    <GalleryContext.Provider value={state}>
      <SetGalleryContext.Provider value={handleSyncGallery}>
        {children}
      </SetGalleryContext.Provider>
    </GalleryContext.Provider>
  );
};
