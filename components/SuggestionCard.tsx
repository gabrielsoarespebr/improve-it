interface Props {
  text: string;
  onApply: (text: string) => void;
}

export default function SuggestionCard({ text, onApply }: Props) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <p className="flex-1 text-sm text-black leading-relaxed">{text}</p>
      <button
        onClick={() => onApply(text)}
        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-green-50 hover:border-green-400 transition-colors"
        title="Apply suggestion"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <polyline points="1,6 4,10 11,2" />
        </svg>
      </button>
    </div>
  );
}
