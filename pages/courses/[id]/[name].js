import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import FAQ from '../../faq';
import URL from '../../../lib/url';

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
      <Navbar
        logout={() => {
          router.push("/");
        }}
      />
      <div className="flex">
        <button className="p-4 bg-blue-200 hover:bg-blue-400 cursor-pointer"
          onClick={() => {router.push("/")}}>Back</button>
        <h1 className="text-2xl text-center">{name}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
        {data !== [] &&
          data !== null &&
          data.map((faq, index) => (
            <FAQ faq={faq} key={index} />
          ))}
      </div>
    </>
  );
}
