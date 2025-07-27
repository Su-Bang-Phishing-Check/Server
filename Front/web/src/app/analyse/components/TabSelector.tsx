'use client';

interface TabSelectorProps {
  selected: 'text' | 'image';
  onSelect: (tab: 'text' | 'image') => void;
}

const TabSelector = ({ selected, onSelect }: TabSelectorProps) => {
  return (
    <div className="flex justify-center space-x-2 font-base md:font-semibold">
      <button
        className={`px-4 py-2 rounded-t-lg ${
          selected === 'text'
            ? 'bg-[#3177FF] text-white'
            : 'bg-gray-100 text-gray-700 border-b-2 border-blue-200'
        }`}
        onClick={() => onSelect('text')}
      >
        텍스트 분석
      </button>
      <button
        className={`px-4 py-2 rounded-t-lg ${
          selected === 'image'
            ? 'bg-[#3177FF] text-white'
            : 'bg-gray-100 text-gray-700 border-b-2 border-blue-200'
        }`}
        onClick={() => onSelect('image')}
      >
        이미지 분석
      </button>
    </div>
  );
};

export default TabSelector;
