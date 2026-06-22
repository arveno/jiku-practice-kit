import { describe, expect, test } from "vitest";
import type { QuestionFilterOptions, QuestionFilters } from "@jiku/domain";
import {
  mapQuestionFiltersToQuery,
  mapQueryToQuestionFilters
} from "./questionFilterQuery";

const options: QuestionFilterOptions = {
  categories: ["React", "Vue"],
  topics: ["Rendering", "Reactivity"],
  tags: ["react", "vue"],
  difficulties: ["easy", "medium"],
  frequencies: ["high", "medium"],
  accessLevels: ["free"]
};

describe("mapQueryToQuestionFilters", () => {
  test("keeps valid URL query filters and ignores unknown values", () => {
    expect(
      mapQueryToQuestionFilters(
        {
          keyword: " state ",
          category: "React",
          topic: "Rendering",
          tag: "react",
          difficulty: "medium",
          frequency: "high",
          accessLevel: "free",
          unknown: "ignored"
        },
        options
      )
    ).toEqual({
      keyword: "state",
      category: "React",
      topic: "Rendering",
      tag: "react",
      difficulty: "medium",
      frequency: "high",
      accessLevel: "free"
    });

    expect(
      mapQueryToQuestionFilters(
        {
          category: "Angular",
          difficulty: "hard",
          keyword: "   "
        },
        options
      )
    ).toEqual({});
  });

  test("uses the first query value when the router provides arrays", () => {
    expect(
      mapQueryToQuestionFilters(
        {
          category: ["Vue", "React"],
          tag: ["vue"]
        },
        options
      )
    ).toEqual({
      category: "Vue",
      tag: "vue"
    });
  });
});

describe("mapQuestionFiltersToQuery", () => {
  test("serializes non-empty filters into URL query values", () => {
    const filters: QuestionFilters = {
      keyword: "state",
      category: "React",
      tag: "react",
      difficulty: "medium",
      frequency: "high",
      accessLevel: "free"
    };

    expect(mapQuestionFiltersToQuery(filters)).toEqual({
      keyword: "state",
      category: "React",
      tag: "react",
      difficulty: "medium",
      frequency: "high",
      accessLevel: "free"
    });
  });
});
