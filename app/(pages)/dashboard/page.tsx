"use client";

import ProductCard from "@/app/components/card";
import Header from "@/app/components/header";
import { Spinner } from "@/app/components/spinner";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

interface Space {
  userId: string;
  id: string;
  name: string;
  thumbnail: string;
}

export default function Page() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space/all"
      );

      setData(response.data?.spaces || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff0053,
          backgroundColor: 0x0,
          points: 20.00,
          maxDistance: 15.00,
          spacing: 17.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="h-screen w-screen overflow-hidden">
      <div className="relative z-10 flex flex-col">
        {/* Header */}
        <Header />

        {/* Product Section */}
        <div className="w-full my-10 mx-auto px-5 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 font-semibold">
              {error}
            </div>
          ) : data.length > 0 ? (
            data.map((product) => (
              <ProductCard
                key={product.id}
                image={product.thumbnail}
                name={product.name}
                spaceId={product.id}
                onDelete={fetchData}
                userId={product.userId}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 font-medium">
              No spaces available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}