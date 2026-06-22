export function mapQuestionIdsToPracticeRoute(questionIds: string[]) {
  return {
    name: "practice",
    query: {
      questionIds: questionIds.join(",")
    }
  };
}
