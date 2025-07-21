"use client";

import React from "react";

interface ButtonProps {
  variant: "fill" | "outline";
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant, children, onClick }: ButtonProps) => {
  const handleButtonClick = () => {
    console.log("버튼 클릭");
    onClick?.();
  };
  const baseStyle = "w-[180px] h-[50px] text-base	rounded-[10px] px-4 py-2";
  const fillStyle =
    "bg-[#3177ff] text-white hover:bg-[#005ce6] transition-colors duration-200";
  const outlineStyle =
    "border-2 border-[#3177ff] text-[#3177ff] hover:bg-[#eaf2ff] transition-colors duration-200";
  const variantStyle = variant === "fill" ? fillStyle : outlineStyle;

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
