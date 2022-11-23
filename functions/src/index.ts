import * as functions from "firebase-functions";
import * as path from "path"
import * as admin from "firebase-admin"

// const db = admin.firestore()
// const FieldValue = admin.firestore.FieldValue;
admin.initializeApp();

type setAdminData = {
  email?: string
  set?: boolean
}

exports.setAdmin = functions.https.onCall((data: setAdminData, context) => {

  if (!context.auth) throw new functions.https.HttpsError("permission-denied", "Must be called while authenticated");

  const senderAdmin = context.auth.token.admin
  if (!senderAdmin) throw new functions.https.HttpsError("permission-denied", "Caller must be admin");

  if (!data.email || typeof data.email !== "string") throw new functions.https.HttpsError("invalid-argument", "email is invalid");

  const _set = (data.set === undefined) ? true : data.set


  return admin.auth().getUserByEmail(data.email)
    .then((targetUser: any) => {
      if (!targetUser) throw new functions.https.HttpsError("not-found", "User not found");

      const currentCustomClaims = targetUser.customClaims;
      currentCustomClaims.admin = _set

      return admin.auth().setCustomUserClaims(targetUser.uid, currentCustomClaims)
    })
    .then(() => {
      return "Success";
    })
    .catch((error: any) => {
      throw new functions.https.HttpsError("not-found", "User email not found");
    })
})

type setdbNameData = {
  email?: string
  dbName?: string
}

exports.setDatabase = functions.https.onCall((data: setdbNameData, context) => {

  if (!context.auth) throw new functions.https.HttpsError("permission-denied", "Must be called while authenticated");

  const senderAdmin = context.auth.token.admin
  if (!senderAdmin) throw new functions.https.HttpsError("permission-denied", "Caller must be admin");

  if (!data.email || typeof data.email !== "string") throw new functions.https.HttpsError("invalid-argument", "email is invalid");
  if (typeof data.dbName !== "string") throw new functions.https.HttpsError("invalid-argument", "dbName is invalid");


  return admin.auth().getUserByEmail(data.email)
    .then((targetUser) => {
      if (!targetUser) throw new functions.https.HttpsError("not-found", "User not found");

      const currentCustomClaims = targetUser.customClaims || {}
      currentCustomClaims.dbName = data.dbName

      return admin.auth().setCustomUserClaims(targetUser.uid, currentCustomClaims)
    })
    .then(() => {
      return "Success";
    })
    .catch((error) => {
      functions.logger.log(error)
      throw new functions.https.HttpsError("internal", "internal error");
    })
})

exports.checkImageAmount = functions.storage.object().onFinalize((newItem) => {
  if (!newItem.name) return functions.logger.log("No 'name' on new file: ", newItem.id)
  const fileBucket = newItem.bucket; // The Storage bucket that contains the file.
  const filePath = newItem.name; // File path in the bucket.
  const contentType = newItem.contentType; // File content type.
  const folderPath = path.dirname(filePath)
  const folders = folderPath.split("/")
  const rootFolder = folders[0]

  if (rootFolder !== "kelly") return functions.logger.log("New file not in kelly")

  const bucket = admin.storage().bucket(fileBucket)
  const file = bucket.file(filePath)
  const query = { prefix: folderPath }

  if (contentType && !contentType.startsWith('image/')) {
    return file.delete().then(() => functions.logger.log('This is not an image. deleting'))
  }

  bucket.getFiles(query).then((responce) => {
    const filesInFolder = responce[0]
    if (!filesInFolder.length) return functions.logger.log("No files in folder")
    if (filesInFolder.length <= 25) return functions.logger.log("Less then 25 images in folder")
    for (let index = 25; index < filesInFolder.length; index++) {
      const file = filesInFolder[index]
      file.delete().then(() => functions.logger.log("Deleted: ", file.name))
    }
  })
})
//