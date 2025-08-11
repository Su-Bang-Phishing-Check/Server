import MainBanner from "./components/MainBanner";
import Notice from "./components/Notice";
import ChatbotBanner from "./components/ChatbotBanner";
import MessageBanner from "./components/MessageBanner";
import ContactBanner from "./components/ContactBanner";
import ManualBanner from "./components/ManualBanner";

const Home = () => {
  return (
    <>
      <MainBanner />
      <Notice />
      <div className="flex flex-col md:grid md:grid-cols-2 p-4 gap-3 md:gap-4 items-center justify-center md:my-2">
        <ChatbotBanner />
        <MessageBanner />
        <ContactBanner />
        <ManualBanner />
      </div>
    </>
  );
};

export default Home;
