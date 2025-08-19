'use client';
import { useEffect, useState } from 'react';
import NoticeList from './NoticeList';
import NoticeTriangleIcon from './NoticeTriangleIcon';
import { useRouter } from 'next/navigation';
import Loading from '@/app/Loading';

interface GetMainNoticeResponse {
  dataCount: number;
  data: {
    id: number;
    title: string;
    link: string;
    created_at: string;
  }[];
}

interface Notice {
  id: number;
  title: string;
  link: string;
  created_at: string;
}

const Notice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchNotices = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notice/mainNotice`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.error('메인화면 공지사항 조회 실패');
      setIsLoading(false);
      return;
    }
    const data: GetMainNoticeResponse = await res.json();
    setNotices(
      data.data.map((it) => ({
        id: it.id,
        title: it.title,
        link: it.link,
        created_at: it.created_at,
      }))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <section
      className="flex-col bg-[#3177FF] text-white p-4 
    w-full max-w-[940px] mx-auto shadow space-y-2"
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
            onClick={() => router.push('/notice')}
          >
            전체보기
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-2 md:px-4">
        <Loading isLoading={isLoading} />
        {notices.length === 0 && (
          <p className="text-sm text-gray-200">
            공지사항이 없습니다.
          </p>
        )}
        {notices.map((it) => (
          <NoticeList
            key={it.id}
            title={it.title}
            date={it.created_at}
            link={it.link}
          />
        ))}
      </div>
    </section>
  );
};

export default Notice;
