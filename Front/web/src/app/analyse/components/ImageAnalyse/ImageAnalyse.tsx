'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';
import AnalyseButton from '../../AnalyseButton';
import ResultImg from './ResultImg';
import Loading from '@/app/Loading';

export interface imageResponse {
  data: {
    image_idx: number;
    isScam: boolean;
  }[];
}

const ImageAnalyse = () => {
  const [images, setImages] = useState<File[]>([]);
  const [result, setResult] = useState<imageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    setIsLoading(true);

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
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-[900px] flex flex-col items-center gap-y-4">
      <ImageUpload image={images} setImage={setImages} />
      <AnalyseButton
        onClick={handleSubmit}
        disabled={images.length === 0}
      />
      <Loading isLoading={isLoading} />
      <ResultImg result={result} isLoading={isLoading} />
    </div>
  );
};

export default ImageAnalyse;
