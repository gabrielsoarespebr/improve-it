import { Suggestions } from "@/lib/types";
import SuggestionCard from "./SuggestionCard";
import { Skeleton } from "./ui/Skeleton";
import { Empty } from "./ui/Empty";

interface Props {
  suggestions: Suggestions | null;
  loading: boolean;
  onApply: (sentence: string, suggestion: string) => void;
  lastSentence: string;
}

const categories = [
  { key: "casual", label: "Casual", color: "bg-emerald-500" },
  { key: "formal", label: "Formal", color: "bg-blue-500" },
  { key: "shorter", label: "Make shorter", color: "bg-pink-500" },
  { key: "semantic_commit", label: "Semantic commit", color: "bg-orange-500" },
  {
    key: "pull_request_title",
    label: "Pull request title",
    color: "bg-cyan-500",
  },
  {
    key: "pull_request_description",
    label: "Pull request description",
    color: "bg-teal-500",
  },
  { key: "longer", label: "Make longer", color: "bg-amber-500" },
  { key: "creative", label: "Creative", color: "bg-violet-500" },
] as const;

export default function SectionPanel({
  suggestions,
  loading,
  onApply,
  lastSentence,
}: Props) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      {/* Rewrite categories */}
      {categories.map(({ key, label, color }) => (
        <div
          key={key}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="font-bold">{label}</span>
          </div>
          <div className="px-4 py-2 flex flex-col min-h-12">
            {loading && <Skeleton />}
            {!loading && !suggestions && (
              <Empty
                text={`3 ${label.toLowerCase()} suggestions will appear here.`}
              />
            )}
            {!loading &&
              suggestions &&
              (!suggestions[key] ||
              (suggestions[key] as string[]).length === 0 ? (
                <Empty text="No suggestions available." />
              ) : (
                (suggestions[key] as string[]).map((txt: string, i: number) => (
                  <SuggestionCard
                    key={i}
                    text={txt}
                    onApply={(s) => onApply(lastSentence, s)}
                  />
                ))
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
