interface NoticeListProps {
  id?: string;
  title: string;
  date: string;
  onClick?: () => void;
}

const NoticeList = ({
  id,
  title,
  date,
  onClick,
}: NoticeListProps) => {
  return (
    <div
      id={id}
      className="flex justify-between items-center bg-[#85BAFF] w-full h-[35px] rounded-[5px] text-sm md:text-base text-black px-2 shadow-md cursor-pointer hover:bg-[#A0C4FF] transition-colors duration-200"
      onClick={onClick}
    >
      <p className="text-left truncate">{title}</p>
      <p className="text-[#5F5F5F] text-xs md:text-sm shrink-0">
        {date}
      </p>
    </div>
  );
};

export default NoticeList;
