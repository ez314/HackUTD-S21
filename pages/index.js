import { useEffect, useState } from "react";
import cookieCutter from "cookie-cutter";
import Router from "next/router";
import LandingPage from "./landing";
import Head from 'next/head'

export default function Welcome(props) {
  useEffect(async () => {
    if (!!(cookieCutter.get("token"))) {
      console.log(cookieCutter.get("token"));
      Router.push("/console");
    }
  }, []);

  return (
    <>
    <Head>
      <title>Solace</title>
    </Head>
    <LandingPage />
    </>
  );
}
