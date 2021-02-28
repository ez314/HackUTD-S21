import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FAQ from "../../faq";
import URL from "../../../lib/url";
import cookieCutter from "cookie-cutter";

export default function Course() {
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
    <>
      <div className="m-4">
        <div className="flex">
          <button
            className="p-2 rounded-xl mr-8 bg-blue-200 hover:bg-blue-400 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Back
          </button>
          <h1 className="flex-1 font-bold text-3xl text-center place-self-center tracking-normal">FAQs for {name}</h1>
          <button
            className="p-2 rounded-xl bg-blue-200 hover:bg-blue-400 cursor-pointer"
            onClick={() => {
              cookieCutter.set("token", "");
              router.push("/");
            }}
          >Log Out</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {data !== [] &&
            data !== null &&
            data.map((faq, index) => <FAQ faq={faq} key={index} />)}
        </div>
      </div>
    </>
  );
}
