import { useEffect, useState } from "react";
import Navbar from "./navbar.js";
import Dashboard from "./dashboard.js";
import cookieCutter from "cookie-cutter";
import Router, { useRouter } from "next/router";
import LandingPage from './landing';

export default function Welcome(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const { pathname } = Router;
    const token = cookieCutter.get("token");
    call();
    console.log(cookieCutter.get("token"));
  }, []);

  const call = async () => {
    const data = await fetch(`https://discord.com/api/users/@me`, {
      headers: { Authorization: `Bearer ${cookieCutter.get("token")}` },
    });
    const json = await data.json();
    if (!json.username) {
      return;
    }
    setUser(json);
    console.log(json);
  };

  const logout = () => {
    setUser({});
  }

  return (
    <>
      {user.id !== undefined ? (
        <div className="w-full mx-0">
          <Navbar logout={logout} />
          <Dashboard user={user} />
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
