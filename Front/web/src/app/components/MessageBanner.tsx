'use client';
import { useRouter } from 'next/navigation';
import { TbMessage2Exclamation } from 'react-icons/tb';

const MessageBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push('/analyse');
  };

  return (
    <div
      onClick={handleBannerClick}
      className="cursor-pointer 
      flex items-center justify-center 
      bg-white p-4 text-black 
      w-full h-[150px] md:h-[200px]
      border-3 border-blue-100 rounded-xl hover:bg-blue-100
      hover:shadow-md active:scale-95 transition-transform"
    >
      <div className="w-5/7 p-3">
        <div className="text-lg font-bold">
          문자 내용 분석{' '}
          <span className="italic text-base text-[#3177FF]">
            Beta
          </span>
        </div>
        <div className="text-sm md:text-base text-left mt-2">
          <span className="font-bold">문자 화면</span> 및{' '}
          <span className="font-bold">내용</span>을 통해
          <br />
          <span className="font-bold text-[#3177FF]">AI</span>로
          스미싱 위험을 분석합니다.
        </div>
      </div>
      <div
        className="w-1/5 p-2
      flex items-center justify-center"
      >
        <TbMessage2Exclamation className="w-13 h-13 text-[#3177ff]" />
      </div>
    </div>
  );
};

export default MessageBanner;
