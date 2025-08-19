import { GoAlertFill } from "react-icons/go";
import { FiAlertTriangle } from "react-icons/fi";
const AlertIcon = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <GoAlertFill className="w-[31px] h-[32px] text-red-500" />
      <FiAlertTriangle className="w-[34px] h-[36px] text-white absolute" />
    </div>
  );
};

export default AlertIcon;
