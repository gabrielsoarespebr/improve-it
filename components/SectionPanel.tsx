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

const groups = [
  {
    label: {
      title: "Most Useful",
      icon: "🎯",
      color: "text-blue-600",
    },
    categories: [
      { key: "casual", label: "Casual" },
      { key: "formal", label: "Formal" },
      { key: "shorter", label: "Make shorter" },
    ],
  },
  {
    label: {
      title: "For Devs",
      icon: "💻",
      color: "text-emerald-600",
    },
    categories: [
      {
        key: "semantic_commit",
        label: "Semantic commit",
      },
      {
        key: "pull_request_title",
        label: "Pull request title",
      },
      {
        key: "pull_request_description",
        label: "Pull request description",
      },
    ],
  },
  {
    label: {
      title: "Others",
      icon: "💭",
      color: "text-violet-600",
    },
    categories: [
      { key: "longer", label: "Make longer" },
      { key: "creative", label: "Creative" },
    ],
  },
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
      <div className="flex flex-col gap-6 overflow-y-auto">
        {groups.map((group) => (
          <div
            key={group.label.title}
            className={`flex flex-col gap-3 p-2 border border-gray-200 rounded-xl`}
          >
            {/* Group label */}
            <span
              className={`text-xs font-semibold tracking-widest ${group.label.color} uppercase`}
            >
              {group.label.icon} {group.label.title}
            </span>

            {/* Categories inside group */}
            {group.categories.map(({ key, label }) => (
              <div
                key={key}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
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
                      (suggestions[key] as string[]).map(
                        (txt: string, i: number) => (
                          <SuggestionCard
                            key={i}
                            text={txt}
                            onApply={(s) => onApply(lastSentence, s)}
                          />
                        ),
                      )
                    ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
