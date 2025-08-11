'use client';
import { useState, useEffect, useRef } from 'react';
import ChatBotMessage from './ChatBotMessage';
import OptionList from './OptionList';
import OptionSubmitButton from './OptionSubmitButton';
import UserMessage from './UserMessage';

interface TempType {
  next: [];
  next_2: [];
  cur_question: number;
  follwup?: number | null;
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
  question: string;
  options: string[];
  temp: TempType;
}

// 채팅 이력 누적 관리
interface Message {
  id?: string;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
  finish?: boolean;
}

const ChatMessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤 관리
  const [options, setOptions] = useState<string[]>([]);
  const [temp, setTemp] = useState<TempType>();
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    []
  );

  // 자동 스크롤 설정
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // state 0 : 초기화 요청 + 1단계 질문, 옵션 셋팅
  useEffect(() => {
    const fetchInit = async () => {
      const body: ChatInitRequest = { state: 0 };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        console.error('init fetch 실패');
        return;
      }

      const data: ChatAPIResponse = await res.json();
      console.log(data);
      setTemp(data.temp);
      setOptions(data.options);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: data.question, options: data.options },
      ]);
    };

    fetchInit();
  }, []);

  // 사용자 중복 선택 저장
  const onToggleOptions = (index: number) => {
    setSelectedOptions((prev) =>
      prev.includes(index)
        ? prev.filter((x) => x !== index)
        : [...prev, index]
    );
  };

  // state 1 :
  // 유저 메세지 셋팅
  // 선택 옵션 전송 + 다음 질문, 옵션 셋팅
  const submitOptions = async (selectedOptions: number[]) => {
    if (selectedOptions.length === 0) {
      console.warn('선택된 옵션이 없습니다.');
      return;
    }

    const selectedText = selectedOptions
      .map((index) => options[index])
      .join(', \n');

    setMessages((prev) => [
      ...prev,
      { type: 'user', text: selectedText },
    ]);

    const body: ChatNextRequest = {
      state: 1,
      select: selectedOptions,
      temp: temp!,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      console.error('next fetch 실패');
      return;
    }
    const data: ChatAPIResponse = await res.json();
    console.log(data);

    if (data.state === 1) {
      setTemp(data.temp);
      setOptions(data.options);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: data.question, options: data.options },
      ]);
      setSelectedOptions([]);
    } else if (data.state === 2) {
      setOptions([]);
      setSelectedOptions([]);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: data.question, finish: true },
      ]);
    }
  };

  return (
    <div className="overflow-y-auto h-full">
      {messages.map((msg, index) => (
        <div key={msg.id ?? index}>
          {msg.type === 'bot' && msg.finish !== true && (
            <>
              <ChatBotMessage question={msg.text} />
              {!msg.finish && (
                <>
                  {msg.options && (
                    <>
                      <OptionList
                        options={msg.options}
                        selected={selectedOptions}
                        onToggle={onToggleOptions}
                      />
                      <OptionSubmitButton
                        disabled={selectedOptions.length === 0}
                        onSubmit={() =>
                          submitOptions(selectedOptions)
                        }
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
          {msg.type === 'user' && <UserMessage text={msg.text} />}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
