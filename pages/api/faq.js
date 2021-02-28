import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  const id = req.query.id;
  await db
    .collection("faq")
    .doc(id)
    .collection("faqs")
    .get()
    .then((querysnapshot) => {
      let result = [];
      querysnapshot.docs.forEach((query) => {
          result.push(query.data());
      })
      res.json(result);
    })
    .catch((error) => {
      res.json({});
    });
}
