"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { IoEnterOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

interface ProductCardProps {
  image: string; // URL of the product image
  spaceId: string; // Space ID
  name: string; // Product name
  onDelete: () => void; // Callback to refresh data
  userId: string; // ID of the current user
}

const color = ["red", "blue", "green", "yellow"];

const ProductCard: React.FC<ProductCardProps> = ({ image, name, spaceId, onDelete, userId }) => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  // Simulate the number of players (for example, random number between 0 and 10)
  const playersInRoom = Math.floor(Math.random() * 11); // Random number between 0 and 10

  useEffect(() => {
    // This will run only on the client-side
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
      window.location.href = `${process.env.NEXT_PUBLIC_FIRST_GAME}?name=${username}&color=${color[Math.floor(Math.random() * 10) % 4]}`;
    } else {
      router.push(`/arena/${spaceId}`); // Navigate to the arena page
    }
  };

  const isCurrentUser = username && userId === username; // Check if the logged-in user is the owner of the space

  return (
    <div
      className="w-72 bg-slate-700 border-white border-2 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
      onClick={handleEnter} // Trigger handleEnter when div is clicked
    >
      <a href="#">
        <img
          src={image}
          alt={name}
          className="h-50 w-72 object-cover rounded-t-xl"
        />
        <div className="px-4 py-3 w-72">
          <p className="text-lg font-bold text-white truncate block capitalize">
            {name}
          </p>
          {/* Display the fake number of players */}
          <p className="text-sm text-white">
            {playersInRoom} {playersInRoom === 1 ? "player" : "players"} in the room
          </p>
          <div className="flex justify-end items-center space-x-2">
            <button
              className="p-3 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-yellow-300 transform transition-all duration-150 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation(); // Prevent div onClick from being triggered
                handleEnter(); // Trigger handleEnter when enter button is clicked
              }}
            >
              <IoEnterOutline />
            </button>

            <button
              className={`p-2 text-xl text-white focus:outline-none focus:ring-2 focus:ring-green-300 hover:text-green-400 transform transition-all duration-150 hover:scale-110 ${!isCurrentUser ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent div onClick from being triggered
                if (isCurrentUser) handleEdit(); // Trigger handleEdit if user is authorized
              }}
              disabled={!isCurrentUser} // Disable button if the user is not authorized
            >
              <FaRegEdit />
            </button>

            <button
              className={`p-2 text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-red-600 transform transition-all duration-150 hover:scale-110 ${!isCurrentUser ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent div onClick from being triggered
                if (isCurrentUser) handleDelete(); // Trigger handleDelete if user is authorized
              }}
              disabled={!isCurrentUser} // Disable button if the user is not authorized
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
