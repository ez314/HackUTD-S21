import cookieCutter from "cookie-cutter";
import Router from 'next/router';

export default function Navbar({ logout }) {
  return (
    <div className="bg-blue-200 p-2 flex mb-4">
      <h1 className="text-2xl flex-1 place-self-center">Dashboard</h1>
      <button
        onClick={() => {
          cookieCutter.set("token", "");
          Router.push("/");
          logout();
        }}
        className="p-2 rounded-xl bg-blue-400"
      >
        Log Out
      </button>
    </div>
  );
}
