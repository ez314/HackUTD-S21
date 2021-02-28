import { data } from "autoprefixer";
import Link from "next/link";
import { useEffect, useState } from "react";
import URL from "../lib/url";
import { AGENDA, WEEKDAYS } from "../lib/agenda";
import Modal from "./modal";

export default function Dashboard({ user }) {
  const [courses, setCourses] = useState(null);
  const [selected, setSelected] = useState(null);
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
    <>
      <Modal
        close={() => {
          setSelected(null);
        }}
        info={selected}
        className={selected === null ? "hidden" : ""}
      />
      <div className="text-gray-200 text-center m-4 px-16 py-8">
        <div className="flex space-x-8 justify-between">
          <div className="flex-col">
            <img
              className="mx-auto w-48 rounded-full"
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`}
            />
            <h1 className="mx-auto text-3xl mt-4">
              Welcome, {user.username}#{user.discriminator}!
            </h1>
          </div>
          <div className="flex-1 p-4 rounded-3xl bg-gray-700 mt-4">
            <h1 className="text-2xl text-center font-bold mb-4">Course FAQs</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
              {courses !== null ? (
                courses.map((course) => (
                  // <Link href={`/courses/${course.id}/${course.name}`}>
                  //   <div
                  //     id={course.id}
                  //     className="bg-gray-600 p-4 text-center rounded-lg shadow-3 text-xl hover:bg-gray-500 cursor-pointer"
                  //   >
                  //     {course.name}
                  //   </div>
                  // </Link>
                  <div
                    onClick={(e) => {
                      setSelected(course);
                    }}
                  >
                    {course.name}
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-gray-700 mt-8 p-6">
          <h1 className="text-2xl text-center font-bold mb-4">Weekly Agenda</h1>
          <div className="grid grid-cols-7 gap-4">
            {AGENDA.map((day, id) => (
              <div className={"rounded-xl shadow-md p-4 bg-gray-800"}>
                <h1 className="text-lg text-center">{WEEKDAYS[id]}</h1>
                {day.map((item) => (
                  <div className="bg-gray-600 hover:bg-gray-500 cursor-pointer p-2 my-4 rounded-md shadow-sm">
                    <p className="text-md font-bold">{item.course}</p>
                    <span className="font-light text-md">{item.item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
