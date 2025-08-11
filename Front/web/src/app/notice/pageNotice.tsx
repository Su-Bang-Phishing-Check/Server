'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GetPageResponse {
  pageNo: number;
  totalPage: number;
  dataCount: number;
  data: NoticeType[];
}

interface NoticeType {
  id: number;
  title: string;
  link: string;
  DATE_FORMAT: string;
}

const GetPageNotice = () => {
  const [pageNo, setPageNo] = useState(1);
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      const qs = new URLSearchParams({
        pageNo: String(pageNo),
      }).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notice/pageNotice?${qs}`,
        { method: 'GET', cache: 'no-store' }
      );

      if (!res.ok) {
        console.error('공지사항 조회 실패');
        return;
      }
      const data: GetPageResponse = await res.json();
      setTotalPage(data.totalPage);
      setNotices(
        data.data.map((it) => ({
          id: it.id,
          title: it.title,
          link: it.link,
          DATE_FORMAT: it.DATE_FORMAT,
        }))
      );
    } catch (err) {
      setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      console.error('공지사항 조회 중 오류 발생:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [pageNo]);

  const goPrev = () => setPageNo((p) => Math.max(p - 1, 1));
  const goNext = () => setPageNo((p) => Math.min(p + 1, totalPage));

  return (
    <div className="flex flex-col items-center p-6 border-gray-200">
      {loading && <p>불러오는 중입니다...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && notices.length > 0 ? (
        <div className="flex flex-col items-center p-6">
          {notices.map((notice) => (
            <div key={notice.id} className="mb-4">
              <p>
                <Link
                  href={notice.link}
                  className="text-blue-500 hover:underline"
                >
                  {notice.title}
                </Link>
              </p>
              <p className="text-gray-500 text-sm">
                {notice.DATE_FORMAT}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>공지사항이 없습니다.</p>
      )}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={pageNo <= 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ◁
        </button>
        <span className="text-sm text-gray-600">
          {pageNo} / {totalPage}
        </span>
        <button
          onClick={goNext}
          disabled={pageNo >= totalPage}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ▷
        </button>
      </div>
    </div>
  );
};

export default GetPageNotice;
