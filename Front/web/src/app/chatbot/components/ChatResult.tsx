import { useState } from "react";

interface ResultData {
  t_type: string[];
  x_type: string[];
}

const ChatResult = ({ t_type, x_type }: ResultData) => {
  const [result, setResult] = useState<number>(0);

  if (t_type.length === 0 && x_type.length === 0) {
    setResult(0);
  } else if (t_type.length > 0 && x_type.length === 0) {
    setResult(1);
  } else if (t_type.length === 0 && x_type.length > 0) {
    setResult(2);
  } else if (t_type.length > 0 && x_type.length > 0) {
    setResult(3);
  }
  return (
    <div className="text-base">
      <h1>선택하신 내용은 </h1>
      {result === 0 && (
        <span>
          사기 유형을 알 수 없습니다.
          <br />
          의심되는 내용이 있다면 금융감독원이나 경찰청으로 문의바랍니다.
        </span>
      )}
      {result === 1 && (
        <>
          <span>금융감독원에서 공지하는 주요 사기 유형중</span>
          <div className="block text-lg text-[#001C52] font-bold mt-1">
            {t_type.join(", ")}
          </div>
          <div>와 일치합니다.</div>
        </>
      )}
      {result === 2 && (
        <>
          <span>금융감독원에서 발표한 피해사례 중 </span>{" "}
          <div className="block text-lg text-[#001C52] font-bold mt-1">
            {x_type.join(", ")}
          </div>
          <div>와 일치합니다.</div>
        </>
      )}
      {result === 3 && (
        <>
          <span>금융감독원에서 공지한 주요 사기 유형과 피해사례</span>
          <div className="block text-lg text-[#001C52] font-bold mt-1">
            {t_type.join(", ")} {x_type.join(", ")}
          </div>
          <span>와 일치합니다.</span>
        </>
      )}
      <div>자세한 내용은 금융감독원이나 경찰청으로 문의하시기 바랍니다.</div>
    </div>
  );
};

export default ChatResult;
