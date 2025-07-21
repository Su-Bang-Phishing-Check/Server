"use client";
import NoticeList from "./NoticeList";
import NoticeTriangleIcon from "./NoticeTriangleIcon";

const Notice = () => {
  const handleNoticeClick = () => {
    console.log("notice list click");
  };
  const handleListClick = () => {
    console.log("list Click");
  };

  return (
    <section className="flex-col bg-[#3177FF] text-white p-4 w-full max-w-[940px] mx-auto rounded-lg shadow space-y-2">
      <div className="flex items-center space-x-2 px-4">
        <NoticeTriangleIcon />
        <h2 className="w-full text-left text-[1.5rem] font-semibold">
          최근 유행하는 보이스피싱 수법
        </h2>
        <div>
          <button
            className="h-[35px] w-[150px] text-[1.125rem] bg-white text-[#3177FF] rounded-[5px] cursor-pointer hover:bg-[#eaf2ff] transition shadow-md"
            onClick={handleNoticeClick}
          >
            전체보기
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-4">
        <NoticeList
          title="청첩장, 부고장 문자 사기 급증"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          title="입금 송금 알바 주의"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          title="신종 보이스피싱 수법 확인"
          date="2025.07.07"
          onClick={handleListClick}
        />
        <NoticeList
          title="가짜 금융기관 문자 주의"
          date="2025.07.07"
          onClick={handleListClick}
        />
      </div>
    </section>
  );
};

export default Notice;
