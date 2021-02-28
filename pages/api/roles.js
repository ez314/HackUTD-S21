import { db } from "../../lib/firebase";

async function check(courses) {
  let result = [];
  for (let course of courses) {
    await result.push(
      await db
        .collection("faq")
        .doc(course)
        .get()
        .then((res) => {return {...res.data(), id: course}})
    );
  }
  return result;
}

export default async function handler(req, res) {
  const id = req.query.id;
  await db
    .collection("user")
    .doc(id)
    .get()
    .then(async (querysnapshot) => {
      const courses = querysnapshot.data()["courses"];
      res.json(await check(courses));
    })
    .catch((error) => {
      res.json({});
    });
}
