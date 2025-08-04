const UserMessage = () => {
  const date = new Date();
  const formattedData = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-end">
      <div></div>
    </div>
  );
};

export default UserMessage;
