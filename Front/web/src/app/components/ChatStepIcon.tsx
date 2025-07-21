import { GoAlert } from "react-icons/go";
import { GoChecklist } from "react-icons/go";
import { BsQuestion } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";

const ChatStepIcon = () => {
  return (
    <div className="flex justify-center items-center space-x-6 mt-2 text-black">
      <div className="flex items-center justify-center w-[60px] h-[60px] bg-[#CEE3FF] rounded-full">
        <GoAlert className="h-10 w-10" />
      </div>
      <div>
        <FiChevronRight className="h-5 w-5" />
      </div>
      <div className="flex items-center justify-center w-[60px] h-[60px] bg-[#CEE3FF] rounded-full">
        <GoChecklist className="h-10 w-10" />
      </div>
      <div>
        <FiChevronRight className="h-5 w-5" />
      </div>
      <div className="flex items-center justify-center w-[60px] h-[60px] bg-[#CEE3FF] rounded-full">
        <BsQuestion className="h-10 w-10" />
      </div>
    </div>
  );
};

export default ChatStepIcon;
