interface UserMessageProps {
  text: string;
}

const UserMessage = ({ text }: UserMessageProps) => {
  const date = new Date();
  const formattedData = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col items-end gap-x-2 mt-2">
      <div
        className="text-sm md:text-base text-white bg-gray-600
      p-2 rounded-xl shadow-md pl-6 pr-4 whitespace-pre-line"
      >
        {text}
      </div>
      <p className="mt-1 text-xs md:text-sm text-gray-500">
        {formattedData}
      </p>
    </div>
  );
};

export default UserMessage;
