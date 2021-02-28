import { data } from "autoprefixer";
import Link from "next/link";
import { useEffect, useState } from "react";
import URL from "../lib/url";
import { AGENDA, WEEKDAYS } from "../lib/agenda";

export default function Dashboard({ user }) {
  const [courses, setCourses] = useState(null);
  let dayOfWeek = new Date().getDay();

  if (user === undefined || user.id === undefined) {
    return <p>Not logged in!</p>;
  }

  if (user.id !== undefined && courses === null) {
    fetch(`${URL}/api/roles?id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.map === "function") setCourses(data);
      });
  }

  return (
    <div className="text-center m-4">
      <div className="flex">
        <div>
          <img
            className="mx-auto align-self-center rounded-full"
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`}
          />
          <h1 className="text-3xl mt-4">
            Hello, {user.username}#{user.discriminator}!
          </h1>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
            {courses !== null ? (
              courses.map((course) => (
                <Link href={`/courses/${course.id}/${course.name}`}>
                  <div
                    id={course.id}
                    className="bg-blue-200 p-4 text-center rounded-lg shadow-3 text-xl hover:bg-blue-400 cursor-pointer"
                  >
                    {course.name}
                  </div>
                </Link>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-blue-200 mt-8">
        <h1 className="text-2xl text-center font-bold mb-4">Weekly Agenda</h1>
        <div className="grid grid-cols-7 gap-4">
          {AGENDA.map((day, id) => (
            <div className={"rounded-lg shadow-md p-4 bg-blue-100"}>
              <h1 className="text-lg text-center font-semibold">{WEEKDAYS[id]}</h1>
              {day.map((item) => (
                <div className="bg-pink-100 hover:bg-pink-200 cursor-pointer p-2 my-4 rounded-md shadow-sm">
                  <p className="text-md font-bold">{item.course}</p>
                  <span className="font-light text-md">{item.item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
