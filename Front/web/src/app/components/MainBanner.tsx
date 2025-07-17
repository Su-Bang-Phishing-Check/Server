'use client';
import Button from './Button';

export default function MainBanner() {
  return (
    <section className="flex flex-col justify-center p-6 gap-y-6">
      <div>
        <h2 className="font-bold text-[3.25rem]">
          헷갈릴 땐,
          <br />
          피싱체크하세요.
        </h2>
        <p className="text-[1.25rem]">
          보이스피싱, 스미싱 위험을 빠르게 확인하세요.
          <br />
        </p>
      </div>
      <div className="h-[50px] flex items-center justify-center gap-x-4	">
        <Button variant="fill">챗봇으로 확인</Button>
        <Button variant="outline">사기문자분석</Button>
        <Button variant="outline">대응 매뉴얼</Button>
      </div>
      <div>
        <p>회원가입 없이, 누구나 쉽게 이용할 수 있습니다.</p>
      </div>
    </section>
  );
}
