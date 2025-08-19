"use client";
import Button from "./Button";

const MainBanner = () => {
  return (
    <section className="flex flex-col justify-center p-6 gap-y-6 w-full bg-white">
      <div>
        <h2 className="font-bold text-[2rem] md:text-[3.25rem]">
          헷갈릴 땐,
          <br />
          {"피싱체크".split("").map((char, i) => (
            <span key={i} className="dot-above text-[#3177FF]">
              {char}
            </span>
          ))}
          하세요.
        </h2>
        <p className="text-base md:text-xl">
          <span className="font-bold">보이스피싱, 스미싱 </span>위험을 빠르게
          확인하세요.
          <br />
        </p>
      </div>
      <div className="h-[50px] flex items-center justify-center gap-x-4	md:gap-x-10">
        <Button variant="fill" href="/chatbot">
          챗봇으로 진단
        </Button>
        <Button variant="outline" href="/analyse">
          사기문자분석
        </Button>
        <Button variant="outline" href="/safe-manual">
          대응 매뉴얼
        </Button>
      </div>
      <div>
        <p className="text-sm md:text-base">
          회원가입 없이, 누구나 쉽게 이용할 수 있습니다.
        </p>
      </div>
    </section>
  );
};

export default MainBanner;
