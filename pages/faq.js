import ReactMarkdown from "react-markdown";

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}


export default function FAQ({ faq }) {
  if (
    faq === undefined ||
    faq.author === undefined ||
    faq.author.name === undefined
  ) {
    return <p>Not logged in</p>;
  }
  return (
    <div className="p-4 bg-blue-200 markdown rounded-xl shadow-md">
      <div className="text-2xl font-semibold">
        <ReactMarkdown>{faq.question}</ReactMarkdown>
      </div>
      <p className="text-gray-600 font-light flex place-self-center">
        Asked by <img src={faq.author.icon_url} className="rounded-full mx-1" width="24px"/>
        {faq.author ? faq.author.name : ""} {timeSince(new Date(faq.timestamp._seconds * 1000))} ago
      </p>
      <ReactMarkdown>{faq.answer}</ReactMarkdown>
    </div>
  );
}
