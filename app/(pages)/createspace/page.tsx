"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mimeType: "image/png",
    dimensions: "1024x768",
    mapId: "",
    file: null as File | null,
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Only runs on the client side
    const storedUserId = localStorage.getItem("nickname");
    setUserId(storedUserId);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is not available.");
      return;
    }

    try {
      // Step 1: Request the presigned URL from the backend
      console.log(userId);
      const response = await axios.post(
        "https://iww5u9cjm3.execute-api.ap-south-1.amazonaws.com/spacedashboard/space",
        {
          userId: userId,
          name: formData.name,
          mimeType: formData.mimeType,
          dimensions: formData.dimensions,
          mapId: formData.mapId,
        }
      );
      console.log(response);
      const url = response.data.presignedUrl;
      console.log("Presigned URL:", url);

      // Step 2: Upload the file to S3 using the presigned URL
      if (formData.file && url) {
        const putResponse = await axios.put(url, formData.file, {
          headers: {
            "Content-Type": formData.mimeType, // Set the MIME type
          },
        });

        if (putResponse.status === 200) {
          alert("File uploaded successfully!");
        } else {
          alert("Failed to upload the file.");
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Other fields remain the same */}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
