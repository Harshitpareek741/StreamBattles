"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import Header from "./components/header";
import random from "random-name";
import Filter from "bad-words";

export default function Home() {
  // eslint-disable-next-line no-console
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  const username = useRef<HTMLInputElement | null>(null);
  const colour = useRef<HTMLInputElement | null>(null);
  const filter = new Filter();
  const router = useRouter();

  useEffect(() => {
    // Check if nickname exists in localStorage
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      router.push("/dashboard"); // Redirect to dashboard
    }

    // Set a random color as the default
    colour.current!.value = `#${Math.floor(
      Math.random() * (0xffffff + 1)
    ).toString(16)}`;
  }, [router]);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xff0053,
          backgroundColor: 0x0,
          points: 20.0,
          maxDistance: 15.0,
          spacing: 17.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.current?.value
      ? username.current?.value
      : random.first();

    if (filter.isProfane(name)) {
      alert("Username may not be a profane word!");
      return;
    }

    // Save nickname and color to localStorage
    localStorage.setItem("nickname", name);
    localStorage.setItem("color", colour.current!.value);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div
      ref={vantaRef}
      className="h-screen w-screen justify-center overflow-hidden"
    >
      <div>
        <Header />
      </div>
      <div className="min-h-screen flex flex-col my-7 items-center justify-cente  text-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Image
            className="mx-auto h-20 w-20"
            src="/img/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
            Welcome to urSpace
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your account info below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-zinc-900 py-8 px-6 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nickname
                </label>
                <input
                  id="nickname"
                  type="text"
                  placeholder="Enter Your Nickname"
                  ref={username}
                  className="block w-full rounded-md border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-500 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-300"
                >
                  Colour
                </label>
                <input
                  id="color"
                  type="color"
                  ref={colour}
                  className="block w-full h-10 rounded-md bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Load Game
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
