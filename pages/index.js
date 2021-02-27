import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import cookieCutter, { set } from "cookie-cutter";
import Router from 'next/router';

export default function Welcome(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const { pathname } = Router;
    const token = cookieCutter.get("token")
    if (!token || token === '') {
      Router.push("/api/login");
    }
    call();
    console.log(cookieCutter.get("token"));
  }, []);

  const call = async () => {
    const data = await fetch(`https://discord.com/api/users/@me`, {headers: { Authorization: `Bearer ${cookieCutter.get("token")}` } }); // Fetching user data
        const json = await data.json();
        if(!json.username) // This can happen if the Bearer token has expired or user has not given permission "indentity"
            return Router.push('/api/login') // Redirect to login page
            setUser(json);
       console.log(json);
  }

  return (
    <div className="w-full mx-0">
      <div className="bg-blue-200 p-2 flex mb-4">
        <h1 className="text-2xl flex-1 place-self-center">Dashboard</h1>
        <button onClick={() => {
          cookieCutter.set('token', '');
          Router.push("/api/login");
        }} className="p-2 rounded-xl bg-blue-400">Log Out</button>
       </div>
       <div className="mx-auto text-center mt-4">
        <img className="mx-auto align-self-center rounded-full" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`} />
        <h1 className="text-3xl mt-4">Hello, {user.username}#{user.discriminator}!</h1>
       </div>
   </div>
  );
}
