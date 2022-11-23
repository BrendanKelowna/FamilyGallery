import { StyleSheet } from "react-native";
import { readDirectoryAsync, getInfoAsync } from "expo-file-system";

//TODO
/*
1. add selected to upload that images that have already been uploaded
2. transision for phots
3. google messages to invoce sync
3. drop photo support
*/

export const mainColor = "#681cd9";
export const mainColorL1 = mainColor + "50";
export const minWidth = 300;
export const rootFolder = "FamilyGallery";

export const isPhoto = (name: string) =>
  name.endsWith("jpg") || name.endsWith("png") || name.endsWith("jpeg");

export const styles = StyleSheet.create({
  list: {
    //height: 50,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
  },
  subtext1: {
    fontSize: 20,
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 40,
  },
  page: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {},
  pair: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  inputs: {
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    minWidth,
    height: 45,
    paddingHorizontal: 8,
  },
  button: {},
  link: {
    color: mainColor,
  },
  buttonStyle: {
    borderRadius: 8,
    height: 45,
    backgroundColor: mainColor,
  },
  border: {
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
  },
  title: {
    color: mainColor,
    fontWeight: "bold",
    fontSize: 35,
  },
  mb: {
    marginBottom: 8,
  },
  width: {
    minWidth,
  },
  clip: {
    backgroundColor: mainColor,
    padding: 10,
    paddingRight: 15,
  },
});

export type File = { fileName: string; uri: string };
export type Folder = { [key: string]: File[] };
export const getAllFiles = async (root: string, location?: string) => {
  //root= c://root/ location = folder
  root = root.endsWith("/") ? root : root + "/";
  const rootRef = root + location + "/";
  const promises = [] as Promise<void>[];
  const files = [] as (File | Folder)[];
  readDirectoryAsync(rootRef).then((items) => {
    items.map((item) => {
      let itemRef = rootRef + item;
      promises.push(
        getInfoAsync(itemRef).then((fileinfo) => {
          itemRef = itemRef + "/";
          const uri = location + item;
          if (fileinfo.isDirectory) {
            getAllFiles(root, uri).then((folder) => {
              files.push(folder as Folder);
            });
          } //folder
          else files.push({ fileName: item, uri } as File); //file
        })
      );
    });
  });
  return Promise.all(promises).then(() => {
    return location ? ({ [location]: files } as Folder) : (files as File[]);
  });
};
