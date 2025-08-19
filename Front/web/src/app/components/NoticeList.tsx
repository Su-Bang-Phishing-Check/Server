import Link from "next/link";
interface NoticeListProps {
  title: string;
  date: string;
  link: string;
}

const NoticeList = ({ title, date, link }: NoticeListProps) => {
  return (
    <div
      className="flex justify-between items-center 
                 bg-[#85BAFF] w-full h-[35px] rounded-[5px] 
                 text-sm md:text-base text-black px-2 shadow-md
                 hover:bg-[#A0C4FF] transition-colors duration-200"
    >
      <Link href={link} className="flex items-center w-full min-w-0">
        <p className="flex-1 min-w-0 text-left truncate pr-6">{title}</p>
        <p className="text-[#5F5F5F] text-xs md:text-sm flex-shrink-0">
          {date}
        </p>
      </Link>
    </div>
  );
};

export default NoticeList;
