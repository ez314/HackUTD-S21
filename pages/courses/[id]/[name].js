import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FAQ from "../../faq";
import URL from "../../../lib/url";
import cookieCutter from "cookie-cutter";
import Navbar from "../../navbar";

export default function Coursef() {
  const router = useRouter();
  let { id, name } = router.query;

  const [data, setData] = useState(null);

  if (data === null) {
    fetch(`${URL}/api/faq?id=${id}`)
      .then((a) => a.json())
      .then((res) => {
        setData(res);
      });
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar logout={() => {}}/>
      <div className="px-16 py-8">
        <div className="flex">
          <button
            className="p-2 rounded-xl mr-8 bg-blue-200 hover:bg-blue-400 cursor-pointer"
            onClick={() => {
              router.push("/console");
            }}
          >
            Back
          </button>
          <h1 className="flex-1 font-bold text-3xl text-center text-blue-50 place-self-center tracking-normal">FAQs for {name}</h1>\
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {data !== [] &&
          data !== null &&
          data.map((faq, index) => <FAQ faq={faq} key={index}/>)}
        </div>
      </div>
    </div>
  );
}
