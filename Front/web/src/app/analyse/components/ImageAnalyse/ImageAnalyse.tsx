'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';
import AnalyseButton from '../../AnalyseButton';
import AnalyseResult from '../../AnalyseResult';

const ImageAnalyse = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<null | {
    isScam: boolean;
    score: number;
  }>(null);

  const handleSubmit = async () => {
    if (!image) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analyse/image`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      alert('결과값 확인 안됨!');
      return;
    }

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="w-full max-w-[900px] flex flex-col items-center  gap-y-4">
      <ImageUpload image={image} setImage={setImage} />
      <AnalyseButton onClick={handleSubmit} disabled={!image} />
      <AnalyseResult result={result} />
    </div>
  );
};

export default ImageAnalyse;
