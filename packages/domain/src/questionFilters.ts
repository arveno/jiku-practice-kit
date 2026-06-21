import type {
  Difficulty,
  Frequency,
  Question,
  QuestionAccessLevel
} from "@jiku/contracts";

export type QuestionFilters = {
  keyword?: string;
  category?: string;
  topic?: string;
  tag?: string;
  difficulty?: Difficulty;
  frequency?: Frequency;
  accessLevel?: QuestionAccessLevel;
};

export type QuestionFilterOptions = {
  categories: string[];
  topics: string[];
  tags: string[];
  difficulties: Difficulty[];
  frequencies: Frequency[];
  accessLevels: QuestionAccessLevel[];
};

export type QuestionStats = {
  totalCount: number;
  categoryCount: number;
  highFrequencyCount: number;
  freeCount: number;
};

function sortedValues<T extends string>(values: Iterable<T>): T[] {
  return Array.from(new Set(values)).sort();
}

function questionMatchesKeyword(question: Question, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (normalizedKeyword.length === 0) {
    return true;
  }

  return [
    question.title,
    question.category,
    question.topic,
    question.question,
    question.standardAnswer,
    ...question.tags
  ].some((value) => value.toLowerCase().includes(normalizedKeyword));
}

export function deriveQuestionFilterOptions(
  questions: Question[]
): QuestionFilterOptions {
  return {
    categories: sortedValues(questions.map((question) => question.category)),
    topics: sortedValues(questions.map((question) => question.topic)),
    tags: sortedValues(questions.flatMap((question) => question.tags)),
    difficulties: sortedValues(questions.map((question) => question.difficulty)),
    frequencies: sortedValues(questions.map((question) => question.frequency)),
    accessLevels: sortedValues(questions.map((question) => question.accessLevel))
  };
}

export function filterQuestions(
  questions: Question[],
  filters: QuestionFilters
): Question[] {
  return questions.filter((question) => {
    if (!questionMatchesKeyword(question, filters.keyword ?? "")) {
      return false;
    }

    if (filters.category && question.category !== filters.category) {
      return false;
    }

    if (filters.topic && question.topic !== filters.topic) {
      return false;
    }

    if (filters.tag && !question.tags.includes(filters.tag)) {
      return false;
    }

    if (filters.difficulty && question.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.frequency && question.frequency !== filters.frequency) {
      return false;
    }

    if (filters.accessLevel && question.accessLevel !== filters.accessLevel) {
      return false;
    }

    return true;
  });
}

export function getQuestionStats(questions: Question[]): QuestionStats {
  return {
    totalCount: questions.length,
    categoryCount: new Set(questions.map((question) => question.category)).size,
    highFrequencyCount: questions.filter((question) => question.frequency === "high")
      .length,
    freeCount: questions.filter((question) => question.accessLevel === "free").length
  };
}
