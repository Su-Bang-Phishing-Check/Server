"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import ChatBotMessage from "./ChatBotMessage";
import OptionList from "./OptionList";
import OptionSubmitButton from "./OptionSubmitButton";
import UserMessage from "./UserMessage";

interface TempType {
  next: number[];
  next_2: number[];
  cur_question: number;
  followup?: number | null;
}

interface ChatInitRequest {
  state: 0;
}

interface ChatNextRequest {
  state: 1;
  select: number[];
  temp: TempType;
}

interface ChatAPIResponse {
  state: 0 | 1 | 2;
  question?: string;
  options?: string[];
  temp?: TempType;
  result?: string;
}

// 채팅 이력 누적 관리
interface Message {
  type: "bot" | "user";
  text: string;
  options?: string[];
  finish?: boolean;
  time: string;
}

const ChatMessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]); // 채팅 메시지
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤 관리
  const [temp, setTemp] = useState<TempType>(); // 서버 temp 데이터
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); // 선택 옵션 인덱스
  const [didSubmit, setDidSubmit] = useState(false); // 현재 옵션 제출 여부
  const didInit = useRef(false);

  // 현재 시간 포맷팅
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 현재 활성 봇 메세지 인덱스
  const activeBotIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === "bot") {
        return i;
      }
    }
    return -1;
  }, [messages]);

  // 자동 스크롤 설정
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // state 0 : 초기화 요청 + 1단계 질문, 옵션 셋팅
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const initFetch = async () => {
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
      setTemp(data.temp);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.question ?? "",
          options: data.options ?? [],
          time: getCurrentTime(),
        },
      ]);
      setSelectedOptions([]);
      setDidSubmit(false);
    };
    initFetch();
  }, []);

  // 사용자 선택 옵션 토글
  const onToggleOptions = (index: number) => {
    setSelectedOptions((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  };

  // state 1 :
  // 유저 메세지 셋팅
  // 선택 옵션 전송 + 다음 질문, 옵션 셋팅
  const submitOptions = async (selectedOptions: number[]) => {
    if (selectedOptions.length === 0) {
      console.warn("선택된 옵션이 없습니다.");
      return;
    }
    if (didSubmit) {
      console.warn("이미 제출된 상태입니다.");
      return;
    }

    setDidSubmit(true);
    const activeOptions = messages[activeBotIndex]?.options ?? [];
    const selectedText = selectedOptions
      .map((i) => activeOptions[i])
      .join(", \n");

    setMessages((prev) => [
      ...prev,
      { type: "user", text: selectedText, time: getCurrentTime() },
    ]);

    const body: ChatNextRequest = {
      state: 1,
      select: selectedOptions,
      temp: temp!,
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
      setDidSubmit(false);
      return;
    }
    const data: ChatAPIResponse = await res.json();
    console.log(data);

    if (data.state === 1) {
      setTemp(data.temp);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.question ?? "",
          options: data.options ?? [],
          time: getCurrentTime(),
        },
      ]);
      setSelectedOptions([]);
      setDidSubmit(false);
    } else if (data.state === 2) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.result ?? "",
          finish: true,
          time: getCurrentTime(),
        },
      ]);
      setSelectedOptions([]);
    }
  };

  console.log("messages", messages);

  return (
    <div className="overflow-y-auto h-full">
      {messages.map((msg, index) => {
        const isActive = index === activeBotIndex;
        return (
          <div key={index}>
            {msg.type === "bot" && (
              <>
                <ChatBotMessage question={msg.text} time={msg.time} />
                {isActive && !msg.finish && msg.options && (
                  <>
                    <OptionList
                      options={msg.options}
                      selected={selectedOptions}
                      onToggle={onToggleOptions}
                    />
                    <OptionSubmitButton
                      disabled={selectedOptions.length === 0 || didSubmit}
                      onSubmit={() => submitOptions(selectedOptions)}
                    />
                  </>
                )}
              </>
            )}
            {msg.type === "user" && (
              <UserMessage text={msg.text} time={msg.time} />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
