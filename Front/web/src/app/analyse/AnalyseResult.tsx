interface AnalyseResultProps {
  result: { isScam: boolean; score: number } | null;
}
const AnalyseResult = ({ result }: AnalyseResultProps) => {
  return (
    <div className="result-box">
      {result ? (
        <div className="text-black">
          <h2 className="text-lg font-semibold">분석 결과</h2>
          <p>
            사기 여부:{' '}
            {result.isScam
              ? '🚨 사기 문자입니다.'
              : '✅ 정상적인 문자입니다.'}
          </p>
          <p>신뢰 점수: {result.score.toFixed(2)}%</p>
        </div>
      ) : (
        <p className="text-gray-500">분석 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default AnalyseResult;
