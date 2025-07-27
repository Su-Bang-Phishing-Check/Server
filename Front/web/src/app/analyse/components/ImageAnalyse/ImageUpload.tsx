'use client';
import React from 'react';

interface ImageUploadProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

const ImageUpload = ({ image, setImage }: ImageUploadProps) => {
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div
      className="
      w-full h-50 md:h-70
      bg-white border border-gray-200 rounded-lg shadow-sm
        p-4 resize-none placeholder-gray-400
        focus:outline-none
        text-sm md:text-base"
    >
      <label className="text-sm md:text-basetext-sm text-gray-600 items-center">
        이미지를 업로드하세요
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden file:w-full"
        />
      </label>

      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="w-32 h-32 object-cover rounded border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
