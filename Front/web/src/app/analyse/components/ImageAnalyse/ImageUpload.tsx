'use client';
import React from 'react';

interface ImageUploadProps {
  image: File[];
  setImage: (file: File[]) => void;
}

const ImageUpload = ({ image, setImage }: ImageUploadProps) => {
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const updatedFiles = [...image, ...files];

      if (updatedFiles.length > 5) {
        alert('이미지는 최대 5개까지만 업로드할 수 있습니다.');
        setImage(updatedFiles.slice(0, 5));
      } else {
        setImage(updatedFiles);
      }
    }
  };

  const handleRemove = (index: number) => {
    setImage(image.filter((_, i) => i !== index));
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
      <label className="text-sm md:text-base text-sm text-gray-600 items-center cursor-pointer">
        이미지를 업로드하세요
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden file:w-full"
        />
      </label>

      {/** 이미지 미리보기 */}
      {image.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {image.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="w-32 h-32 object-cover rounded border border-gray-300"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
