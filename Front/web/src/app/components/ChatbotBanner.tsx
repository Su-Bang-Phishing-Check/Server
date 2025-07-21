"use client";
import ChatStepIcon from "./ChatStepIcon";
import { useRouter } from "next/navigation";

const ChatbotBanner = () => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/chatbot");
  };

  return (
    <div
      onClick={handleChatClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border-3 border-[#CEE3FF] p-4 rounded-lg shadow-sm text-black w-[450px] h-[200px]"
    >
      <h1 className="text-lg font-semibold">
        상황선택 → 요구사항선택 → 위험도 확인
      </h1>
      <div>
        <ChatStepIcon />
      </div>
    </div>
  );
};

export default ChatbotBanner;
