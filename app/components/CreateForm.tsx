"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HandleCreateBlog } from "../lib/BlogFunc";

interface CreateFormProps {
  userSession: any;
}

const CreateForm = ({userSession}: CreateFormProps) => {
    const userData = JSON.parse(userSession);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState("");
    const [content, setContent] = useState("");
  
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
  
    const fileRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter()
  
    // ---------------------------
    // Category Input
    // ---------------------------
    const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryInput(e.target.value);
    };
  
    const handleAddCategory = () => {
      const newCats = categoryInput
        .split(/\s+/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0 && !categories.includes(c));
      setCategories([...categories, ...newCats]);
      setCategoryInput("");
    };
  
    const handleRemoveCategory = (index: number) => {
      const newCats = [...categories];
      newCats.splice(index, 1);
      setCategories(newCats);
    };
  
    // ---------------------------
    // Image Upload
    // ---------------------------
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64 = reader.result as string;
        setImageBase64(base64);
        setImagePreview(base64);
      };
  
      reader.readAsDataURL(file);
    };
  
    // ---------------------------
    // Submit Handler
    // ---------------------------
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const payload = {
        title,
        description: desc,
        categories,
        content,
        thumbnail: imageBase64,
        author: userData.userId
      };

      const res = await HandleCreateBlog(payload)

      if (res.status === "success") {
        router.push(`/blogs/${res.message}`)
      }

    };
  return (
    <div className="w-full max-w-3xl">
    <h1 className="text-3xl font-semibold mb-6">Create Blog Post</h1>

    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#131519] p-6 rounded-2xl border border-[#1E2024]"
    >
      {/* TITLE */}
      <div>
        <label className="text-sm text-gray-400">Title</label>
        <input
          type="text"
          className="w-full mt-1 bg-[#0D0F12] border border-[#2a2d33] px-4 py-2 rounded-lg text-gray-200 outline-none focus:border-blue-500 transition"
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* DESCRIPTION WITH CHARACTER LIMIT */}
      <div>
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-400">Short Description</label>
          <span className="text-xs text-gray-500">{desc.length}/155</span>
        </div>

        <textarea
          className="w-full mt-1 bg-[#0D0F12] border border-[#2a2d33] px-4 py-2 rounded-lg text-gray-200 outline-none focus:border-blue-500 transition resize-none h-24"
          placeholder="Write a short SEO-friendly description..."
          maxLength={155}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
      </div>

      {/* IMAGE UPLOAD + THUMBNAIL */}
      <div>
        <label className="text-sm text-gray-400">Thumbnail Image (16:9)</label>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {imagePreview ? (
          <div className="mt-2 relative w-[300px] h-[180px] rounded-xl overflow-hidden border border-[#2a2d33]">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1 text-xs shadow"
              onClick={() => {
                setImagePreview(null);
                setImageBase64(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex items-center justify-center w-[300px] h-[180px] border-2 border-dashed border-[#2a2d33] rounded-xl bg-[#0D0F12] cursor-pointer hover:border-blue-500 transition"
          >
            <span className="text-xs text-gray-500">
              Click to upload 1280×720 image
            </span>
          </div>
        )}
      </div>

      {/* CATEGORY INPUT → CHIPS */}
      <div>
        <label className="text-sm text-gray-400">Categories</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 bg-[#0D0F12] border border-[#2a2d33] px-4 py-2 rounded-lg text-gray-200 outline-none focus:border-blue-500 transition"
            placeholder="type words separated by spaces..."
            value={categoryInput}
            onChange={handleCategoryInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex items-center bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs"
            >
              <span>{cat}</span>
              <button
                type="button"
                className="ml-2 text-blue-200 hover:text-white"
                onClick={() => handleRemoveCategory(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div>
        <label className="text-sm text-gray-400">Content</label>
        <textarea
          className="w-full mt-1 bg-[#0D0F12] border border-[#2a2d33] px-4 py-2 rounded-lg text-gray-200 outline-none focus:border-blue-500 transition h-40"
          placeholder="Write the full blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
      >
        Publish Blog
      </button>
    </form>
  </div>
  )
}

export default CreateForm