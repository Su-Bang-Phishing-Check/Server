"use client";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

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
  created_at: string;
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
        { method: "GET", cache: "no-store" }
      );

      if (!res.ok) {
        console.error("공지사항 조회 실패");
        return;
      }
      const data: GetPageResponse = await res.json();
      setTotalPage(data.totalPage);
      setNotices(
        data.data.map((it) => ({
          id: it.id,
          title: it.title,
          link: it.link,
          created_at: it.created_at,
        }))
      );
    } catch (err) {
      setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      console.error("공지사항 조회 중 오류 발생:", err);
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
    <div className="flex flex-col items-center border-gray-200 m-4">
      {loading && <p>불러오는 중입니다...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && notices.length > 0 ? (
        <div className="w-full max-w-[900px]">
          <div className="border border-gray-200 rounded-sm overflow-hidden bg-white">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-20 px-4 py-3 text-left text-base font-semibold text-gray-600">
                    번호
                  </th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-600">
                    제목
                  </th>
                  <th className="w-36 px-4 py-3 text-right text-base font-semibold text-gray-600">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr
                    key={notice.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="h-16 px-4 py-3 text-base text-gray-700 tabular-nums">
                      {notice.id}
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <Link
                        href={notice.link}
                        className="block text-base hover:underline hover:text-blue-500 line-clamp-2"
                      >
                        {notice.title}
                      </Link>
                    </td>

                    <td className="h-16 px-4 py-3 text-right text-base text-gray-500 whitespace-nowrap">
                      {notice.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && !error && <p>공지사항이 없습니다.</p>
      )}
      <div>
        <button onClick={goPrev} disabled={pageNo === 1}>
          <FiChevronLeft
            size={20}
            className="inline-block cursor-pointer hover:text-blue-500"
          />
        </button>
        <span>
          {pageNo} / {totalPage}
        </span>
        <button onClick={goNext} disabled={pageNo === totalPage}>
          <FiChevronRight
            size={20}
            className="inline-block cursor-pointer hover:text-blue-500"
          />
        </button>
      </div>
    </div>
  );
};

export default GetPageNotice;
