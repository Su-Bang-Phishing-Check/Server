'use client';

import React from 'react';

const TextInput = ({
  text,
  setText,
}: {
  text: string;
  setText: (value: string) => void;
}) => {
  const MAX_LEN = 256;

  return (
    <>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="문자 내용을 입력하거나 복사하여 붙여넣어 주세요."
        className="w-full h-50 md:h-70
        bg-white border border-gray-200 rounded-lg shadow-sm
        p-4 resize-none placeholder-gray-400
        focus:outline-none
        text-sm md:text-base"
      />
      <div className="flex w-full justify-between px-2 text-xs text-gray-500">
        <p>최소 15자 이상 작성해주세요.</p>
        <p>
          {text.length}/{MAX_LEN}
        </p>
      </div>
    </>
  );
};

export default TextInput;
