import MainBanner from "./components/MainBanner";
import Notice from "./components/Notice";
import ChatbotBanner from "./components/ChatbotBanner";
import MessageBanner from "./components/MessageBanner";

const Home = () => {
  return (
    <>
      <MainBanner />
      <Notice />
      <div className="flex items-center justify-center my-2">
        <ChatbotBanner />
        <MessageBanner />
      </div>
    </>
  );
};

export default Home;
