import Router from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
import cookieCutter from "cookie-cutter";
import Head from "next/head";

export default function Console() {
  const [user, setUser] = useState({});

  useEffect(async () => {
    const data = await fetch(`https://discord.com/api/users/@me`, {
      headers: { Authorization: `Bearer ${cookieCutter.get("token")}` },
    });
    const json = await data.json();
    if (!json.username) Router.push("/");
    setUser(json);
  }, []);

  return (
    <>
      <Head>
        <title>Solace</title>
      </Head>
      <div className="min-h-screen bg-gray-900">
        <Navbar
          logout={() => {
            setUser({});
          }}
        />
        <Dashboard user={user} />
      </div>
    </>
  );
}
