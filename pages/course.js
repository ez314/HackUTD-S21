import { useEffect, useState } from "react";
import FAQ from "./faq";
import URL from "../lib/url";
import Navbar from "./navbar";

export default function Course({ id, name }) {
  const [data, setData] = useState(null);

  if (data === null) {
    fetch(`${URL}/api/faq?id=${id}`)
      .then((a) => a.json())
      .then((res) => {
        setData(res);
      });
  }

  return (
    <div className="bg-gray-800 px-16 pb-16">
      <h1
        className="flex-1 font-bold text-3xl text-center text-blue-50 place-self-center tracking-normal">FAQs
        for {name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {data !== [] &&
        data !== null &&
        data.map((faq, index) => <FAQ faq={faq} key={index}/>)}
      </div>
    </div>
  );
}
