interface OptionListProps {
  options: string[];
  onSelect: (index: number) => void;
}

const OptionList = ({ options, onSelect }: OptionListProps) => {
  return (
    <div className="flex flex-col space-y-2 mt-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {option}
        </button>
      ))}
    </div>
  );
};
export default OptionList;
