import type { QuestionFilterOptions, QuestionFilters } from "@jiku/domain";

type QueryValue = string | null | (string | null)[] | undefined;
type QuestionFilterQuery = Record<string, QueryValue>;

function firstQueryValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

function trimmedQueryValue(value: QueryValue) {
  const nextValue = firstQueryValue(value)?.trim();
  return nextValue && nextValue.length > 0 ? nextValue : undefined;
}

function optionValue<T extends string>(value: QueryValue, options: T[]) {
  const nextValue = trimmedQueryValue(value);
  return nextValue && options.includes(nextValue as T) ? (nextValue as T) : undefined;
}

export function mapQueryToQuestionFilters(
  query: QuestionFilterQuery,
  options: QuestionFilterOptions
): QuestionFilters {
  return Object.fromEntries(
    Object.entries({
      keyword: trimmedQueryValue(query.keyword),
      category: optionValue(query.category, options.categories),
      topic: optionValue(query.topic, options.topics),
      tag: optionValue(query.tag, options.tags),
      difficulty: optionValue(query.difficulty, options.difficulties),
      frequency: optionValue(query.frequency, options.frequencies),
      accessLevel: optionValue(query.accessLevel, options.accessLevels)
    }).filter(([, value]) => value !== undefined)
  );
}

export function mapQuestionFiltersToQuery(filters: QuestionFilters) {
  const keyword = filters.keyword?.trim();

  return Object.fromEntries(
    Object.entries({
      ...filters,
      keyword: keyword && keyword.length > 0 ? keyword : undefined
    }).filter(([, value]) => value !== undefined && value !== "")
  );
}
