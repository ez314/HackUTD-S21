import Router from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Navbar from './navbar';
import cookieCutter from 'cookie-cutter';

export default function Console() {

    const [user, setUser] = useState({});

    useEffect(async () => {
        const data = await fetch(`https://discord.com/api/users/@me`, {
            headers: { Authorization: `Bearer ${cookieCutter.get("token")}` },
        });
        const json = await data.json();
        if (!json.username) 
            Router.push("/");
        setUser(json);
    }, []);

  return (
    <div className="">
      <Navbar logout={() => {setUser({})}} />
      <Dashboard user={user} />
    </div>
  );
}
