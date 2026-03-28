"use client";

import { useState, useRef, useCallback } from "react";
import { GrammarIssue, Suggestions } from "@/lib/types";
import SectionPanel, { Empty, Skeleton } from "@/components/SectionPanel";

function getLastSentence(text: string): string | null {
  const t = text.trimEnd();
  if (!t) return null;
  const last = t[t.length - 1];
  if (![".", "!", "?"].includes(last)) return null;
  const matches = t.match(/[^.!?\n][^.!?\n]*[.!?]/g);
  if (!matches) return null;
  const s = matches[matches.length - 1].trim();
  return s.length > 4 ? s : null;
}

export default function Home() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSentence, setLastSentence] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setText(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const sentence = getLastSentence(val);
        if (!sentence || sentence === lastSentence) return;

        setLastSentence(sentence);
        setLoading(true);
        setSuggestions(null);

        try {
          const res = await fetch("/api/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sentence }),
          });
          const data = await res.json();
          setSuggestions(data);
        } catch (_) {}

        setLoading(false);
      }, 700);
    },
    [lastSentence],
  );

  const handleApply = useCallback((original: string, suggestion: string) => {
    setText((prev) => {
      const idx = prev.lastIndexOf(original);
      if (idx === -1) return prev;
      return (
        prev.slice(0, idx) + suggestion + prev.slice(idx + original.length)
      );
    });
    setLastSentence(suggestion);
    setSuggestions(null);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-[1fr_380px] gap-6 h-[calc(100vh-3rem)]">
        {/* Left — Editor */}
        {/* Grammar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
              Your text
            </span>
            <textarea
              value={text}
              onChange={handleChange}
              placeholder={
                "Start writing in English or Portuguese…\n\nFinish a sentence with  .  !  or  ?  to get suggestions automatically."
              }
              className="flex-1 bg-white border border-gray-200 rounded-xl p-5 text-[15px] leading-relaxed text-gray-900 resize-none outline-none focus:border-gray-400 placeholder:text-gray-300"
            />
            {loading && (
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 border border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                Analyzing sentence…
              </p>
            )}
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-gray-500">
                Grammar fix
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2 min-h-12">
              {loading && <Skeleton />}
              {!loading && !suggestions && (
                <Empty text="Finish a sentence to see grammar feedback." />
              )}
              {!loading &&
                suggestions &&
                (!suggestions.grammar_issues ||
                suggestions.grammar_issues.length === 0 ? (
                  <p className="text-sm text-green-600">
                    No grammar issues found.
                  </p>
                ) : (
                  suggestions.grammar_issues.map(
                    (g: GrammarIssue, i: number) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-red-500">
                          {g.error}
                        </span>
                        <span className="text-gray-600"> — {g.suggestion}</span>
                      </div>
                    ),
                  )
                ))}
            </div>
          </div>
        </div>

        {/* Right — Suggestions */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
            Suggestions
          </span>
          <SectionPanel
            suggestions={suggestions}
            loading={loading}
            onApply={handleApply}
            lastSentence={lastSentence}
          />
        </div>
      </div>
    </main>
  );
}
