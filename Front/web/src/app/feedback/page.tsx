'use client';
import { useState } from 'react';
import Loading from '@/app/Loading';

interface FeedbackRequest {
  text: string;
}

interface FeedbackPageResponse {
  success: boolean;
}

const FeedbackPage = () => {
  const MAX_LEN = 300;
  const [feedback, setFeedback] = useState<FeedbackRequest>({
    text: '',
  });
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const disabled: boolean =
    feedback.text.trim().length < 5 || feedback.text.length > MAX_LEN;

  const submitFeedback = async () => {
    if (disabled) return;
    setIsLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: feedback.text.trim() }),
      }
    );

    if (!res.ok) {
      console.error('Error submitting feedback');
    }

    const data: FeedbackPageResponse = await res.json();
    setIsLoading(false);
    setFeedback({ text: '' });
    if (data.success) {
      setMessage('피드백이 성공적으로 제출되었습니다. 감사합니다!');
    } else {
      setMessage('제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 gap-y-6">
      <div className="w-full max-w-[900px] flex flex-col gap-y-4 py-2">
        <h1 className="text-2xl font-bold text-left text-[#3177FF]">
          개발자에게 요청사항을 남겨주세요
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          더 나은 피싱체크가 되기 위한 의견을 주시면 감사하겠습니다.
          <br />
          이용하면서 좋았던 점, 불편했던 점, 개선이 필요한 부분 등{' '}
          <br className="md:hidden" />
          의견을 남겨주시면 더 나은 서비스 제공을 위해 노력하겠습니다.
        </p>
      </div>
      <div className="w-full max-w-[900px]">
        <textarea
          value={feedback.text}
          onChange={(e) => setFeedback({ text: e.target.value })}
          placeholder="요청사항/개선점/버그 제보 등을 자유롭게 작성해주세요."
          className="
      w-full min-h-[200px] md:min-h-[280px]
      bg-white border border-gray-200 rounded-lg shadow-sm
        p-4 resize-none placeholder-gray-400
        focus:outline-none
        text-sm md:text-base"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>최소 5자 이상 작성해주세요.</span>
          <span>
            {feedback.text.length}/{MAX_LEN}
          </span>
        </div>
      </div>
      <Loading isLoading={isLoading} />
      <button
        onClick={submitFeedback}
        disabled={disabled}
        className="
        w-[180px] md:w-[450px] h-[50px]
        bg-[#3177FF] text-white font-medium rounded-lg
        hover:bg-[#005CE6] transition-colors duration-200
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
      "
      >
        제출하기
      </button>
      {message && (
        <div className="mt-4 text-base text-gray-600">{message}</div>
      )}
    </div>
  );
};

export default FeedbackPage;
