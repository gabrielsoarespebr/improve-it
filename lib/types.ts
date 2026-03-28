export interface GrammarIssue {
  error: string;
  suggestion: string;
}

export interface Suggestions {
  grammar_issues: GrammarIssue[];
  casual: string[];
  formal: string[];
  longer: string[];
  shorter: string[];
  creative: string[];
  semantic_commit: string[];
  pull_request_title: string[];
  pull_request_description: string[];
}
