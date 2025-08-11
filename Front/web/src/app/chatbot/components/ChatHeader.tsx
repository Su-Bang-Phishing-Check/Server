"use client";

const ChatHeader = () => {
  return (
    <div className="flex flex-col w-full p-4">
      <div className="w-full max-w-[900px] flex justify-between gap-x-6 gap-y-4 py-2">
        <h1 className="text-2xl font-bold text-left text-[#3177FF]">
          보이스피싱 위험도 자가진단
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="text-xs md:text-sm px-3 h-10 py-1.5 rounded-full 
                   bg-blue-100 text-blue-600 
                   hover:bg-blue-200 
                   transition-colors duration-200"
        >
          다시 시작하기
        </button>
      </div>
      <div>
        <p className="text-gray-600 text-sm md:text-base">
          실제 상황처럼 구성된 질문에 따라, <br className="md:hidden" />
          채팅을 통해 보이스피싱 위험도를 진단해 드립니다.
          <br />각 질문에 맞는 선택지를 클린하여 진행해 주세요.
        </p>
        <p className="text-gray-600 text-xs md:text-sm">
          ※ 본 서비스는 AI 기반 위험 예측 도구이며, 법적 판단이나 실제 피해
          여부에 대한 확정적 판단은 아닙니다.
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
