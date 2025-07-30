"use client";
import { useState, useEffect } from "react";
import ChatBotMessage from "./ChatBotMessage";
import OptionList from "./OptionList";

export interface ChatInitRequest {
  state: 0;
}
export interface ChatNextRequest {
  state: 1;
  select: number[];
  temp: any;
}

export interface ChatAPIResponse {
  state: 0 | 1;
  question: string;
  options: string[];
  temp: any;
}

const ChatMessageList = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [temp, setTemp] = useState<any>(null);

  useEffect(() => {
    const fetchInit = async () => {
      const body: ChatInitRequest = { state: 0 };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("init fetch 실패");
        return;
      }

      const data: ChatAPIResponse = await res.json();
      console.log(data);
      setQuestion(data.question);
      setOptions(data.options);
      setTemp(data.temp);
    };
    fetchInit();
  }, []);

  const handleOptionSelect = async (index: number) => {
    const body: ChatNextRequest = {
      state: 1,
      select: [index],
      temp: temp,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("next fetch 실패");
      return;
    }

    const data: ChatAPIResponse = await res.json();
    console.log(data);
    setQuestion(data.question);
    setOptions(data.options);
    setTemp(data.temp);
  };

  return (
    <div>
      <ChatBotMessage question={question} />
      <OptionList options={options} onSelect={handleOptionSelect} />
    </div>
  );
};

export default ChatMessageList;
