'use client';
import TextAnalyse from './components/TextAnalyse/TextAnalyse';
import ImageAnalyse from './components/ImageAnalyse/ImageAnalyse';
import TabSelector from './components/TabSelector';
import { useState } from 'react';
import Link from 'next/link';

const AnalysePage = () => {
  const [selectedTab, setSelectedTab] = useState<'text' | 'image'>(
    'text'
  );

  return (
    <div className="flex flex-col items-center p-6 gap-y-6">
      <div className="w-full max-w-[900px] flex flex-col gap-y-4 py-2">
        <h1 className="text-2xl font-bold text-left text-[#3177FF]">
          AI 사기 문자 분석{' '}
          <span className="italic text-base text-[#3177FF]">
            Beta
          </span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          문자 메시지를 입력하거나 캡처를 업로드하면,{' '}
          <br className="md:hidden" />
          AI가 보이스피싱 위험도를 분석해 알려드립니다.
          <br />
          문자 내용을 복사하여 입력하거나, 이미지로 업로드해 주세요.
        </p>
      </div>
      <div className="w-full max-w-[900px]">
        <TabSelector
          selected={selectedTab}
          onSelect={setSelectedTab}
        />
        <div
          className="w-full max-w-[900px] md:flex-row h-[400px] md:h-[500px]
      ring-2 ring-blue-200 rounded-lg shadow-sm"
        >
          {selectedTab === 'text' ? (
            <TextAnalyse />
          ) : (
            <ImageAnalyse />
          )}
        </div>
      </div>
      <div className="w-full p-4 text-gray-500 text-xs md:text-sm">
        <p>
          ※ 사기 문자 AI 분석은 베타 버전입니다.{' '}
          <br className="md:hidden" />
          정확도 개선 중이며 결과는 참고용입니다.
          <br />
          피해가 의심되면 금융기관 또는 경찰에 즉시 신고해 주세요.
        </p>
        <div className="mt-2">
          개발자에게 피드백을 주시면, 서비스 개선에 큰 도움이 됩니다.{' '}
          <br className="md:hidden" />
          <Link
            href="/feedback"
            className="text-blue-400 hover:underline"
          >
            피드백 보내기
          </Link>
        </div>

        <p className="mt-2">
          입력하신 정보는 사기문자 분석 AI학습에 사용되며,{' '}
          <br className="md:hidden" />
          개인정보 보호를 위해 암호화되어 처리됩니다.
        </p>
      </div>
    </div>
  );
};
export default AnalysePage;
