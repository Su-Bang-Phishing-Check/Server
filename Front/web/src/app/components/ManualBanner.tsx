'use client';
import { useRouter } from 'next/navigation';
import { LuFileCheck } from 'react-icons/lu';

const ManualBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push('/safe-manual');
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
        <div className="text-lg font-bold">보이스피싱 대응 방법</div>
        <div className="text-sm md:text-base text-left mt-2">
          <span className="font-bold text-red-500">보이스피싱</span>
          을 당했다면?
          <br />
          신속한 조치로 피해를 최소화합니다.
          <br />
        </div>
      </div>
      <div
        className="w-1/5 p-2
            flex items-center justify-center"
      >
        <LuFileCheck className="w-13 h-13 text-[#3177ff]" />
      </div>
    </div>
  );
};

export default ManualBanner;
