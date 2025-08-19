interface OptionListProps {
  options: string[];
  selected: number[];
  onToggle: (index: number) => void;
}

const OptionList = ({
  options,
  selected,
  onToggle,
}: OptionListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onToggle(index)}
          className={`
            px-4 py-2 border rounded-full text-sm
            ${
              selected.includes(index)
                ? 'bg-[#3177FF] text-white'
                : 'bg-gray-100 text-blue-600 hover:bg-blue-100'
            }
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
export default OptionList;
