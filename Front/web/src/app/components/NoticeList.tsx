import Link from "next/link";
interface NoticeListProps {
  title: string;
  date: string;
  link: string;
}

const NoticeList = ({ title, date, link }: NoticeListProps) => {
  return (
    <div className="flex justify-between items-center bg-[#85BAFF] w-full h-[35px] rounded-[5px] text-sm md:text-base text-black px-2 shadow-md cursor-pointer hover:bg-[#A0C4FF] transition-colors duration-200">
      <Link href={link}>
        <p className="text-left truncate">{title}</p>
        <p className="text-[#5F5F5F] text-xs md:text-sm shrink-0">{date}</p>
      </Link>
    </div>
  );
};

export default NoticeList;
