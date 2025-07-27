'use client';
import { useRouter } from 'next/navigation';

import React from 'react';

interface ButtonProps {
  variant: 'fill' | 'outline';
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}

const Button = ({
  variant,
  children,
  href,
  onClick,
}: ButtonProps) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(href);
    onClick?.();
  };
  const baseStyle =
    'cursor-pointer font-medium w-[180px] h-[50px] text-sm md:text-base rounded-[10px] px-4 py-2';
  const fillStyle =
    'bg-[#3177ff] text-white hover:bg-[#005ce6] transition-colors duration-200';
  const outlineStyle =
    'border-2 border-[#3177ff] text-[#3177ff] hover:bg-[#eaf2ff] transition-colors duration-200';
  const variantStyle = variant === 'fill' ? fillStyle : outlineStyle;

  return (
    <button
      className={`${baseStyle} ${variantStyle}`}
      onClick={handleButtonClick}
    >
      {children}
    </button>
  );
};

export default Button;
