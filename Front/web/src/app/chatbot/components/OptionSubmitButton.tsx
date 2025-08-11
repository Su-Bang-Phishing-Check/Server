'use client';

interface OptionSubmitButtonProps {
  disabled: boolean;
  onSubmit: () => void;
}

const OptionSubmitButton = ({
  disabled,
  onSubmit,
}: OptionSubmitButtonProps) => {
  return (
    <div className="flex justify-end mt-4">
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className={`
          px-4 py-2 rounded-full text-xs md:text-sm transition
          ${
            disabled
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#3177FF] text-white hover:bg-blue-600'
          }
        `}
      >
        완료
      </button>
    </div>
  );
};

export default OptionSubmitButton;
