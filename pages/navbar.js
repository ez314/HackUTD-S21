import cookieCutter from "cookie-cutter";
import Router from 'next/router';

export default function Navbar({ logout }) {
  return (
    <div className="bg-gray-700 flex justify-between align-middle mb-4 px-8 py-4">
      <img src="/solace_mark.png" class="h-14"/>
      <div className="text-blue-50 font-bold tracking-wide inline-block align-middle text-5xl">Solace Dashboard</div>
      <button
        onClick={() => {
          cookieCutter.set("token", "");
          Router.push("/");
          logout();
        }}
        className="p-2 rounded-xl bg-blue-800 hover:bg-blue-600 text-center text-lg text-blue-50 px-6"
      >
        Log Out
      </button>
    </div>
  );
}
