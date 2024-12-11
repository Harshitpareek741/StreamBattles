"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

// Define types for image data and map data
interface ImageData {
  id: string;
}

const imageStore: ImageData[] = [
  { id: "image1123" },
  { id: "Image2" },
  { id: "Image3" },
  { id: "Image4" }
];

// Define a map for image name to url
const imageMap: Record<string, string> = {
  image1123: "https://rukminim2.flixcart.com/image/850/1000/l1mh7rk0/poster/0/d/h/medium-shinchan-cartoon-wall-poster-decorative-poster-for-original-imagd5f6m5zwvhhy.jpeg?q=20&crop=false",
  Image2: "https://www.partysuppliesindia.com/cdn/shop/products/A2_33_c020ee18-0c82-4dc1-b16d-c90a64707b20.jpg?v=1635508143&width=1500",
  Image3: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFyYWNrJTIwb2JhbWF8ZW58MHx8MHx8fDA%3D",
  Image4: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20230905052053.jpg"
};

interface MapItem extends ImageData {
  element: any;
  x: number;
  y: number;
  spaceId: string; // Add spaceId
}

export default function ArenaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // State to store the selected image, fetched map data, and map data
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [fetchedMapData, setFetchedMapData] = useState<MapItem[]>([]); // Fetched map data
  const [mapData, setMapData] = useState<MapItem[]>([]); // Array for new map data (images to be placed)
  const [id, setId] = useState<string>(""); // State to store the id

  // Fetch id and map data
  useEffect(() => {
    const fetchIdAndMapData = async () => {
      try {
        const idResponse = await params; // Wait for the promise to resolve
        const spaceId = idResponse.id;
        setId(spaceId); // Set the id

        const response = await axios.get(
          `https://ag05lgbwsj.execute-api.ap-south-1.amazonaws.com/arena/space/${spaceId}`
        );
        if (response.data && response.data.elements) {
          const fetchedElements = response.data.elements.map((item: any) => ({
            ...item,
            spaceId: spaceId,
          }));
          setFetchedMapData(fetchedElements); // Set the fetched map data
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchIdAndMapData();
  }, [params]); // Refetch when params change

  // Handle selecting an image from the store
  const handleSelectImage = (image: ImageData) => {
    setSelectedImage(image);
  };

  // Handle clicking on the map
 // Handle clicking on the map
const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!selectedImage) {
    alert("Please select an image first!");
    return;
  }

  // Get click position
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Add selected image to the mapData array with position, spaceId, and element
  setMapData((prev) => [
    ...prev,
    {
      ...selectedImage,
      x,
      y,
      spaceId: id,
      element: { id: selectedImage.id }, // Include the element property
    },
  ]);

  // Clear selected image after placing
  setSelectedImage(null);
};


  // Function to handle the POST request to the API
  const handleConfirmChanges = async () => {
    if (mapData.length === 0) {
      alert("No elements placed on the map!");
      return;
    }

    const payload = mapData.map((item) => ({
      elementId: item.id, // Example element ID
      spaceId: item.spaceId,
      x: item.x,
      y: item.y,
    }));

    try {
      const response = await axios.post(
        "https://ag05lgbwsj.execute-api.ap-south-1.amazonaws.com/arena/space/addelement",
        payload
      );
      console.log(response);

      if (response.status) {
        alert("Elements added successfully!");
      } else {
        alert("Failed to add elements.");
      }
    } catch (error) {
      alert("Error occurred while adding elements.");
    }
  };

  return (
    <div className="absolute ">
      <h1>Arena ID: {id}</h1>
      
      <div className="flex gap-4">
        {/* Image Store Section */}
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
                <img
                  src={imageMap[image.id]} // Use imageMap to get the URL
                  alt={image.id}
                  className="w-32 h-32 object-cover mx-auto" // Fixed size (32x32) and centered image
                />
                <p className="text-center">{image.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div
          className="ml-[25%] p-4 border relative overflow-x-auto overflow-y-auto" // Allow horizontal and vertical scrolling
          style={{
            height: "600px",
            backgroundColor: "#f0f0f0",
            width: "2000px", // Increase the map's width to make it horizontally scrollable
          }}
          onClick={handleMapClick}
        >
          <h2>Map</h2>
          {/* Render the fetched map data */}
          {fetchedMapData.map((item, index) => (
            <img
              key={index}
              src={imageMap[item.element.id]} // Use imageMap to get the URL
              alt={item.id}
              style={{
                position: "absolute",
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: "50px", // Adjust as needed
                height: "50px",
              }}
            />
          ))}
          {/* Render the new map data */}
          {mapData.map((item, index) => (
            <img
              key={index}
              src={imageMap[item.id]} // Use imageMap to get the URL
              alt={item.id}
              style={{
                position: "absolute",
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: "50px", // Adjust as needed
                height: "50px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Confirm Changes Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleConfirmChanges}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
}
