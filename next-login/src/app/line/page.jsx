"use client";

import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import NextLogo from "../../../public/next.svg";
import Image from "next/image";
import { signOut } from "next-auth/react";

function LoginLinePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]); 


  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2005153917-wzBM0A0R" }); 
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          handleLogin();
        }
      } catch (error) {
        console.error("LIFF initialization failed", error);
      }
    };

    initLiff();
  }, []);

  const handleLogin = async () => {
    try {
      const profile = await liff.getProfile();
      console.log("profile lineee: ", profile);

      const res = await fetch("/api/linelogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      setName(data);
    } catch (err) {
      console.error("Error during handleLogin:", err);
    }
  };

  return (
    <>
      <Container>
        <nav className="flex justify-between items-center shadow-md p-5">
          <div>
            <Image src={NextLogo} width={100} height={100} alt="nextjs logo" />
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link
                href=""
                className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <div
          className="flex-grow al-center p-10"
          style={{ textAlign: "center" }}
        >
          <h1 className="text-5xl">Login by line</h1>
          {name && (
            <div style={{ display: "inline-block", marginTop: "2rem" }}>
              <a
                href={name.payload.user.picture}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={name.payload.user.picture}
                  alt="User's Profile Picture"
                  style={{
                    width: "200px",
                    height: "200px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </a>
              <div className="text-2xl " style={{ marginTop: "2rem" }}>
                {name.payload.user.displayName}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </Container>
    </>
  );
}

export default LoginLinePage;
