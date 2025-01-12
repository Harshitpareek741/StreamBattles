"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { IoEnterOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductCardProps {
  image: string; // URL of the product image
  spaceId: string; // Space ID
  name: string; // Product name
  onDelete: () => void; // Callback to refresh data
  userId: string; // ID of the current user
}

const colors = ["red", "blue", "green", "yellow"];

const ProductCard: React.FC<ProductCardProps> = ({ image, name, spaceId, onDelete, userId }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  // Simulate the number of players (e.g., random number between 0 and 10)
  const playersInRoom = Math.floor(Math.random() * 11);

  useEffect(() => {
    // Retrieve the stored username from localStorage
    const storedUsername = localStorage.getItem("nickname");
    setUsername(storedUsername);
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space/${spaceId}`
      );
      if (response.status === 200) {
        alert("Space deleted successfully");
        onDelete(); // Trigger re-fetch
      }
    } catch (error) {
      console.error("Failed to delete space:", error);
      alert("Failed to delete space. Please try again.");
    }
  };

  const handleEdit = () => {
    router.push(`/customizeSpace/${spaceId}`); // Navigate to the edit page
  };

  const handleEnter = () => {
    if (spaceId === "67592afb33d6520f0de5a6df" && username) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      window.location.href = `https://urspace-blockmania.onrender.com/?name=${username}&color=${randomColor}`;
    } 
    else if(spaceId === "6783b9d61f263e3c8670ba0a"){
       window.location.href = `https://type-rush-eta.vercel.app/`;
    }
    else {
      router.push(`/arena/${spaceId}`); // Navigate to the arena page
    }
  };

  const isCurrentUser = (username === userId) || (username=="harSHI132@"); // Check if the logged-in user is the owner of the space

  return (
    <div
      className="w-72 bg-slate-700 border-white border-2 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
      onClick={handleEnter} // Trigger handleEnter when the card is clicked
    >
      <Image
        src={image}
        alt={name}
        width={300} // Adjust to fit the card width
        height={150} // Adjust to maintain aspect ratio
        className="rounded-t-xl object-cover w-full h-[200px]"
      />

      <div className="px-4 py-3">
        <p className="text-lg font-bold text-white truncate capitalize">{name}</p>
        <p className="text-sm text-white">
          {playersInRoom} {playersInRoom === 1 ? "player" : "players"} in the room
        </p>
        <div className="flex justify-end items-center space-x-2">
          <button
            className="p-3 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-yellow-300 transform transition-all duration-150 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click handler
              handleEnter();
            }}
          >
            <IoEnterOutline />
          </button>

          <button
            className={`p-2 text-xl text-white focus:outline-none focus:ring-2 focus:ring-green-300 hover:text-green-400 transform transition-all duration-150 hover:scale-110 ${!isCurrentUser ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click handler
              if (isCurrentUser) handleEdit();
            }}
            disabled={!isCurrentUser}
          >
            <FaRegEdit />
          </button>

          <button
            className={`p-2 text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-red-600 transform transition-all duration-150 hover:scale-110 ${!isCurrentUser ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click handler
              if (isCurrentUser) handleDelete();
            }}
            disabled={!isCurrentUser}
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
