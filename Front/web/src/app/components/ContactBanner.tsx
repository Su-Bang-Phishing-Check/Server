'use client';
import { useRouter } from 'next/navigation';
import { FaAddressBook } from 'react-icons/fa6';

const ContactBanner = () => {
  const router = useRouter();
  const handleBannerClick = () => {
    router.push('/contact-book');
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
        <div className="text-lg font-bold">금융기관 연락처 확인</div>
        <div className="text-sm md:text-base text-left mt-2">
          30개의 <span className="font-bold">금융·공공기관</span>{' '}
          <span className="font-bold text-[#3177FF]">연락처 </span>
          확인
          <br />
          기관명을 누르면{' '}
          <span className="font-bold">공식 홈페이지</span>로
          <br />
          연결됩니다.
        </div>
      </div>
      <div
        className="w-1/5 p-2
                  flex items-center justify-center"
      >
        <FaAddressBook className="w-13 h-13 text-[#3177ff]" />
      </div>
    </div>
  );
};

export default ContactBanner;
