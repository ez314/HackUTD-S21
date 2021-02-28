import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("../firebase_admin.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
  
export const db = admin.firestore();
 