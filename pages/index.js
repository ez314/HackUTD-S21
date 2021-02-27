import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="container">
      <a href="/api/discord/login">Login through discord</a>
    </div>
  );
}
