import { TextResponse } from "./TextAnalyse";

interface ResultTextProps {
  result: TextResponse | null;
  isLoading: boolean;
}
const ResultText = ({ result, isLoading }: ResultTextProps) => {
  return (
    <div className="result-box">
      {isLoading && <p className="text-gray-500">분석 중...</p>}
      {!isLoading && result ? (
        <div className="text-black">
          <h2 className="text-lg font-semibold">분석 결과</h2>
          <p>
            사기 여부:{" "}
            {result.isScam ? "🚨 사기 문자입니다." : "✅ 정상적인 문자입니다."}
          </p>
          {/* <p>신뢰 점수: {(result.score * 100).toFixed(4)}%</p> */}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResultText;
