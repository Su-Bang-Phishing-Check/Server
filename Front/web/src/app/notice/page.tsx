import WebNotice from './components/WebNotice';
import MobileNotice from './components/MobileNotice';

const NoticePage = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-[900px] flex flex-col gap-y-4 py-2 mb-4 md:mb-6">
        <h1 className="text-2xl font-bold text-left text-[#3177FF]">
          공지사항
        </h1>
        <p className="text-gray-600 text-sm md:text-base break-keep">
          금융감독원에서 공지하고 있는 금융소비자보호 경보 내용을
          공유합니다.
        </p>
      </div>
      <section>
        <p className="hidden md:inline-block">
          <WebNotice />
        </p>
        <p className="md:hidden">
          <MobileNotice />
        </p>
      </section>
    </div>
  );
};

export default NoticePage;
