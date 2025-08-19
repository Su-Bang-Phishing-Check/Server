'use client';

import InstallPWA from '../PWA/installPWA';
import { useState } from 'react';

const PWABtn = () => {
  const { state, ios, installed, promptInstall } = InstallPWA();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (installed) return null;

  const handleClick = async () => {
    if (ios) {
      setShowIOSGuide(true); // iOS는 안내 모달 열기
      return;
    }

    if (state === 'can-install') {
      const result = await promptInstall();
      if (result === 'accepted') {
      } else if (result === 'dismissed') {
        alert('설치를 취소하셨습니다.');
      } else {
        alert('현재 설치를 진행할 수 없습니다.');
      }
    } else {
      alert(
        '현재 브라우저/환경에서는 설치를 진행할 수 없습니다.\n' +
          '• 프로덕션 모드에서 다시 시도해 주세요.\n' +
          '• 주소창의 설치 아이콘(+)이 보이면 사용할 수 있습니다.'
      );
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 
        md:px-4 md:py-2 bg-[#3177ff] hover:bg-[#2563eb] active:scale-95 transition 
        text-white text-sm md:text-base font-medium shadow-sm cursor-pointer"
        aria-label={ios ? 'iOS 설치 안내' : '웹 앱 설치'}
      >
        {ios ? '📱 설치 안내' : '📥 설치'}
      </button>

      {/* iOS 안내 */}
      {ios && showIOSGuide && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <h2 className="text-lg font-semibold">
              iOS에서 설치하기
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>Safari 브라우저로 이 페이지를 열어주세요.</li>
              <li>
                하단(또는 상단)의 <b>공유</b> 아이콘(⬆️)을 탭하세요.
              </li>
              <li>
                <b>홈 화면에 추가</b>를 선택합니다.
              </li>
              <li>
                이름을 확인하고 <b>추가</b>를 누르면 완료됩니다.
              </li>
            </ol>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWABtn;
