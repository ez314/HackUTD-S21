import ReactMarkdown from "react-markdown";

export default function FAQ({faq}) {
    console.log(faq);
  return (
    <div className="p-4 bg-blue-200 markdown">
      <div className="text-2xl"><ReactMarkdown>{faq.question}</ReactMarkdown></div>
      <p className="text-gray-600">Author: {faq.author ? faq.author.name : ""}</p>
      <ReactMarkdown>{faq.answer}</ReactMarkdown>
      {/* <p>{faq.timestamp._seconds}</p> */}
    </div>
  );
}
