"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

const UploadForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mimeType: "image/png",
    dimensions: "1024x768",
    mapId: "124",
    file: null as File | null,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for preview image

  useEffect(() => {
    // Only runs on the client side
    const storedUserId = localStorage.getItem("nickname");
    setUserId(storedUserId);
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
          maxDistance: 1.00,
          spacing: 17.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);


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

      // Update the preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Set the preview image
      };
      reader.readAsDataURL(file);
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
      const url = response.data.presignedUrl;

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
    <div ref={vantaRef} className="h-screen w-screen overflow-hidden">
      <div>
        <Header />
      </div>
      <div className="my-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-4 border bg-opacity-30 bg-gray-500 text-white border-gray-300 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-400 bg-opacity-40 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-white">
              CreateSpace
            </label>

            <div className="mb-8">
              <input
                type="file"
                name="file"
                id="file"
                className="sr-only"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className="relative flex min-h-[300px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-6 text-center"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-60 object-contain border border-gray-300 rounded-md"
                  />
                ) : (
                  <div>
                    <span className="mb-2 block text-xl font-semibold text-white">Drop files here</span>
                    <span className="mb-2 block text-base font-medium text-white">Or</span>
                    <span className="inline-flex rounded border cursor-pointer border-[#e0e0e0] py-2 px-7 text-base font-medium text-white">
                      Browse
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Change File Button */}
            {previewImage && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                >
                  Change File
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-lg text-white">{formData.file?.name || "No file chosen"}</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
