"use client";

import { useState } from "react";
import TextInput from "./TextInput";
import AnalyseButton from "../../AnalyseButton";
import AnalyseResult from "../../AnalyseResult";

const TextAnalyse = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | {
    isScam: boolean;
    score: number;
  }>(null);

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyse/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    console.log(res);
    if (!res.ok) {
      alert("결과값 확인 안됨!");
      return;
    }
    const data = await res.json();
    console.log(data);
    setResult(data);
  };

  return (
    <div className="w-full max-w-[900px] flex flex-col gap-y-4 items-center">
      <TextInput text={text} setText={setText} />
      <AnalyseButton onClick={handleSubmit} disabled={!text.trim()} />
      <AnalyseResult result={result} />
    </div>
  );
};

export default TextAnalyse;
