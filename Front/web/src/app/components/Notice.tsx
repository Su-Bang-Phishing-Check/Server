'use client';
import NoticeList from './NoticeList';
import NoticeTriangleIcon from './NoticeTriangleIcon';
import { useRouter } from 'next/navigation';

const Notice = () => {
  const router = useRouter();

  const handleNoticeClick = () => {
    router.push('/notice');
  };

  const handleListClick = () => {
    console.log('list Click');
  };

  return (
    <section
      className="flex-col 
    bg-[#3177FF] text-white p-4 
    w-full max-w-[940px] mx-auto 
    shadow space-y-2"
    >
      <div className="flex items-center space-x-2 px-2 md:px-4">
        <NoticeTriangleIcon />
        <h2 className="w-full text-left text-[1rem] md:text-[1.5rem] font-semibold">
          최근 유행하는 보이스피싱 수법
        </h2>
        <div>
          <button
            className="h-[35px] w-[80px] md:w-[150px] 
            font-medium text-[0.875rem] md:text-[1.125rem] 
            bg-white text-[#3177FF] rounded-[5px] 
            cursor-pointer hover:bg-[#eaf2ff] transition shadow-md"
            onClick={handleNoticeClick}
          >
            전체보기
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-2 md:px-4">
        <NoticeList
          id="n-001"
          title="청첩장, 부고장 문자 사기 급증"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          id="n-002"
          title="입금 송금 알바 주의"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          id="n-003"
          title="신종 보이스피싱 수법 확인"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          id="n-004"
          title="가짜 금융기관 문자 주의"
          date="2025.07.07"
          onClick={handleListClick}
        />
      </div>
    </section>
  );
};

export default Notice;
