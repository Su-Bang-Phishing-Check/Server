'use client';

import React from 'react';

const TextInput = ({
  text,
  setText,
}: {
  text: string;
  setText: (value: string) => void;
}) => {
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="문자 내용을 입력하거나 복사하여 붙여넣어 주세요."
      className="
      w-full h-50 md:h-70
      bg-white border border-gray-200 rounded-lg shadow-sm
        p-4 resize-none placeholder-gray-400
        focus:outline-none
        text-sm md:text-base"
    />
  );
};

export default TextInput;
