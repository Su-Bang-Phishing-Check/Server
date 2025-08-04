'use client';
import { useState, useEffect } from 'react';
import ChatBotMessage from './ChatBotMessage';
import OptionList from './OptionList';
import OptionSubmitButton from './OptionSubmitButton';

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
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [temp, setTemp] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    []
  );

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
      setQuestion(data.question);
      setOptions(data.options);
      setTemp(data.temp);
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

  // state 1 : 선택 옵션 전송 + 다음 질문, 옵션 셋팅
  const submitOptions = async (selectedOptions: number[]) => {
    if (selectedOptions.length === 0) {
      console.warn('선택된 옵션이 없습니다.');
      return;
    }
    const body: ChatNextRequest = {
      state: 1,
      select: selectedOptions,
      temp: temp,
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

    setQuestion(data.question);
    setOptions(data.options);
    setTemp(data.temp);

    setSelectedOptions([]);
  };

  return (
    <div>
      <ChatBotMessage question={question} />
      <OptionList
        options={options}
        selected={selectedOptions}
        onToggle={onToggleOptions}
      />
      <OptionSubmitButton
        disabled={selectedOptions.length === 0}
        onSubmit={() => submitOptions(selectedOptions)}
      />
    </div>
  );
};

export default ChatMessageList;
