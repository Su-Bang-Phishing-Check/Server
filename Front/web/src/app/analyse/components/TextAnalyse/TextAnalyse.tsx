'use client';

import { useState } from 'react';
import TextInput from './TextInput';
import AnalyseButton from '../../AnalyseButton';
import ResultText from './ResultText';
import Loading from '@/app/Loading';

export interface TextResponse {
  isScam: boolean;
  score: number;
}

const TextAnalyse = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<TextResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analyse/text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );
    console.log(res);

    if (!res.ok) {
      alert('결과값 확인 안됨!');
      return;
    }
    const data = await res.json();
    console.log(data);
    setResult(data);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-[900px] flex flex-col gap-y-4 items-center">
      <TextInput text={text} setText={setText} />
      <AnalyseButton
        onClick={handleSubmit}
        disabled={text.trim().length < 15 || text.trim().length > 256}
      />
      <Loading isLoading={isLoading} />
      <ResultText result={result} isLoading={isLoading} />
    </div>
  );
};

export default TextAnalyse;
