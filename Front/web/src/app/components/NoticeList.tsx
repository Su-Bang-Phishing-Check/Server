interface NoticeListProps {
  title: string;
  date: string;
  onClick?: () => void;
}

const NoticeList = ({ title, date, onClick }: NoticeListProps) => {
  return (
    <div
      className="flex justify-between items-center bg-[#85BAFF] w-full h-[35px] rounded-[5px] text-base text-black px-2 shadow-md cursor-pointer hover:bg-[#A0C4FF] transition-colors duration-200"
      onClick={onClick}
    >
      <p className="text-left truncate">{title}</p>
      <p className="text-[#5F5F5F] text-sm shrink-0">{date}</p>
    </div>
  );
};

export default NoticeList;
