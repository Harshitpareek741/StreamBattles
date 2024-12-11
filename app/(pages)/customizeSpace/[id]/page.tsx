"use client";

import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface ImageData {
  id: string;
}

interface MapItem extends ImageData {
  element: { id: string };
  x: number;
  y: number;
  spaceId: string;
}

const imageStore: ImageData[] = [
  { id: "image1123" },
  { id: "Image2" },
  { id: "Image3" },
  { id: "Image4" },
];

const imageMap: Record<string, string> = {
  image1123: "https://rukminim2.flixcart.com/image/850/1000/l1mh7rk0/poster/0/d/h/medium-shinchan-cartoon-wall-poster-decorative-poster-for-original-imagd5f6m5zwvhhy.jpeg?q=20&crop=false",
  Image2: "https://www.partysuppliesindia.com/cdn/shop/products/A2_33_c020ee18-0c82-4dc1-b16d-c90a64707b20.jpg?v=1635508143&width=1500",
  Image3: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFyYWNrJTIwb2JhbWF8ZW58MHx8MHx8fDA%3D",
  Image4: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20230905052053.jpg",
};

export default function ArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [fetchedMapData, setFetchedMapData] = useState<MapItem[]>([]);
  const [mapData, setMapData] = useState<MapItem[]>([]);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const fetchIdAndMapData = async () => {
      try {
        const idResponse = await params;
        const spaceId = idResponse.id;
        setId(spaceId);

        const response = await axios.get(
          `https://ag05lgbwsj.execute-api.ap-south-1.amazonaws.com/arena/space/${spaceId}`
        );
        if (response.data && response.data.elements) {
          const fetchedElements = response.data.elements.map((item: { id: string; x: number; y: number }) => ({
            ...item,
            spaceId,
          }));
          setFetchedMapData(fetchedElements);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchIdAndMapData();
  }, [params]);

  const handleSelectImage = (image: ImageData) => setSelectedImage(image);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMapData((prev) => [
      ...prev,
      {
        ...selectedImage,
        x,
        y,
        spaceId: id,
        element: { id: selectedImage.id },
      },
    ]);
    setSelectedImage(null);
  };

  const handleConfirmChanges = async () => {
    if (mapData.length === 0) {
      alert("No elements placed on the map!");
      return;
    }

    const payload = mapData.map((item) => ({
      elementId: item.id,
      spaceId: item.spaceId,
      x: item.x,
      y: item.y,
    }));

    try {
      const response = await axios.post(
        "https://ag05lgbwsj.execute-api.ap-south-1.amazonaws.com/arena/space/addelement",
        payload
      );
      if (response.status) {
        alert("Elements added successfully!");
      } else {
        alert("Failed to add elements.");
      }
    } catch (e) {
      console.error("Error occurred while adding elements:", e);
      alert("Error occurred while adding elements.");
    }
  };

  return (
    <div className="absolute">
      <h1>Arena ID: {id}</h1>
      <div className="flex gap-4">
        <div className="w-1/4 p-4 border fixed top-0 left-0 bottom-0 bg-white z-10 overflow-auto">
          <h2>Image Store</h2>
          <div className="grid grid-cols-2 gap-2">
            {imageStore.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer p-2 border ${
                  selectedImage?.id === image.id ? "bg-blue-200" : ""
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <Image
                  src={imageMap[image.id]}
                  alt={image.id}
                  width={128}
                  height={128}
                  className="object-cover mx-auto"
                />
                <p className="text-center">{image.id}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="ml-[25%] p-4 border relative overflow-x-auto overflow-y-auto"
          style={{ height: "600px", backgroundColor: "#f0f0f0", width: "2000px" }}
          onClick={handleMapClick}
        >
          <h2>Map</h2>
          {fetchedMapData.map((item, index) => (
            <Image
              key={index}
              src={imageMap[item.element.id]}
              alt={item.id}
              width={50}
              height={50}
              style={{ position: "absolute", left: `${item.x}px`, top: `${item.y}px` }}
            />
          ))}
          {mapData.map((item, index) => (
            <Image
              key={index}
              src={imageMap[item.id]}
              alt={item.id}
              width={50}
              height={50}
              style={{ position: "absolute", left: `${item.x}px`, top: `${item.y}px` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <button onClick={handleConfirmChanges} className="bg-blue-500 text-white py-2 px-4 rounded">
          Confirm Changes
        </button>
      </div>
    </div>
  );
}
