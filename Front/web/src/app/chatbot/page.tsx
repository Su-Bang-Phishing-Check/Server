import ChatHeader from './components/ChatHeader';
import ChatMessageList from './components/ChatMessageList';

const ChatbotPage = () => {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <ChatHeader />
      <section className="flex-1 w-full overflow-y-auto p-4 space-y-4 bg-white">
        <ChatMessageList />
      </section>
    </div>
  );
};

export default ChatbotPage;
