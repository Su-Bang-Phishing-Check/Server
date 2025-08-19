'use client';
import React from 'react';

interface AnalyseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const AnlyseButton = ({ onClick, disabled }: AnalyseButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-[180px] md:w-[450px] h-[50px]
        bg-[#3177FF] text-white font-medium rounded-lg
        hover:bg-[#005CE6] transition-colors duration-200
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      분석하기
    </button>
  );
};

export default AnlyseButton;
