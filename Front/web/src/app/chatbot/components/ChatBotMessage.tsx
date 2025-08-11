import React from 'react';
import Image from 'next/image';

interface ChatBotMessageProps {
  question: string;
}

const ChatBotMessage = ({ question }: ChatBotMessageProps) => {
  const date = new Date();
  const formattedData = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div>
      <div className="flex flex-col items-start mb-2">
        <div className="flex items-center gap-x-2 mb-2">
          <Image
            src="/assets/bot.png"
            alt="Bot"
            width={40}
            height={40}
            className="w-8 md:w-10 h-8 md:h-10 rounded-full"
          />
          <p className="mt-1 ml-1 text-xs md:text-sm text-gray-500">
            {formattedData}
          </p>
        </div>
        <p
          className="text-sm md:text-base text-white bg-[#3177FF]
        p-2 rounded-xl shadow-md pl-4 pr-6"
        >
          {question}
        </p>
      </div>
    </div>
  );
};

export default ChatBotMessage;
