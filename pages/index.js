import { useEffect, useState } from "react";
import Navbar from './navbar.js';
import Dashboard from './dashboard.js'
import cookieCutter from "cookie-cutter";
import Router from 'next/router';

export default function Welcome(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const { pathname } = Router;
    const token = cookieCutter.get("token");
    if (!token || token === "") {
      Router.push("/api/login");
    }
    call();
    console.log(cookieCutter.get("token"));
  }, []);

  const call = async () => {
    const data = await fetch(`https://discord.com/api/users/@me`, {
      headers: { Authorization: `Bearer ${cookieCutter.get("token")}` },
    });
    const json = await data.json();
    if (!json.username) return Router.push("/api/login");
    setUser(json);
    console.log(json);
  };

  return (
    <div className="w-full mx-0">
      <Navbar />
      <Dashboard user={user} />
    </div>
  );
}
