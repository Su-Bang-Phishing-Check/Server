interface UserMessageProps {
  text: string;
  time: string;
}

const UserMessage = ({ text, time }: UserMessageProps) => {
  return (
    <div className="flex flex-col items-end gap-x-2 mt-2">
      <div
        className="text-sm md:text-base text-white bg-gray-600
      p-2 rounded-xl shadow-md pl-6 pr-4 whitespace-pre-line"
      >
        {text}
      </div>
      <p className="mt-1 text-xs md:text-sm text-gray-500">{time}</p>
    </div>
  );
};

export default UserMessage;
