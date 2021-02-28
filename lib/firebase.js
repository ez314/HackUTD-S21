import admin from "firebase-admin";
require('dotenv').config();

if (!admin.apps.length) {
  const serviceAccount = {
    "project_id": "hackutd-s21",
    "private_key": process.env.firestore_private_key.replace(/\\n/g, '\n'),
    "client_email": process.env.firestore_clientEmail
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
  
export const db = admin.firestore();
 