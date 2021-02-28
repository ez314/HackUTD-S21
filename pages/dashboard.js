import { data } from "autoprefixer";
import { useEffect, useState } from "react";

export default function Dashboard({ user }) {

  const [courses, setCourses] = useState(null);

  if (user.id === undefined) {
    return <p>Not logged in!</p>;
  }

  if (user.id !== undefined && courses === null) {
    console.log(user);
    fetch(`http://localhost:3000/api/roles?id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data)
          setCourses(data)
      })
  }

  return (
    <div className="mx-auto text-center mt-4">
      <img
        className="mx-auto align-self-center rounded-full"
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`}
      />
      <h1 className="text-3xl mt-4">
        Hello, {user.username}#{user.discriminator}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
        {courses && courses.map(course => (
          <div id={course.faqID} className="bg-blue-200 p-4 text-center rounded-lg shadow-3 text-xl">
            {course.name}
          </div>
        ))}
      </div>
    </div>
  );

}
