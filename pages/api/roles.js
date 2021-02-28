import { db } from "../../lib/firebase";

async function check(courses) {
  let result = [];
  console.log(courses);
  for (let course of courses) {
    console.log(course);
    await result.push(
      await db
        .collection("faq")
        .doc(course)
        .get()
        .then((res) => res.data())
    );
  }
  console.log(result);
  return result;
}

export default async function handler(req, res) {
  const id = req.query.id;
  await db
    .collection("user")
    .where("id", "==", id)
    .get()
    .then(async (querysnapshot) => {
      const courses = querysnapshot.docs[0].data()["courses"];
      res.json(await check(courses));
    })
    .catch((error) => {
      res.json({});
    });
}
