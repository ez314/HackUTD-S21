import { useEffect, useState } from "react";
import cookieCutter from "cookie-cutter";
import Router from "next/router";
import LandingPage from "./landing";

export default function Welcome(props) {
  useEffect(async () => {
    if (cookieCutter.get("token") !== "") {
      Router.push("/console");
    }
  }, []);

  return <LandingPage />;
}
