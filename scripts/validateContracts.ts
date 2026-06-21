import { createEmptyScorecard, parseQuestion, parseScorecard } from "@jiku/contracts";

const sampleQuestion = {
  id: "contract-smoke-question",
  title: "Contract smoke question",
  category: "Contract",
  topic: "Schema",
  tags: ["contract"],
  difficulty: "easy",
  frequency: "low",
  accessLevel: "free",
  products: ["web"],
  question: "Does the shared contract parse a valid free question?",
  standardAnswer: "Yes. The shared schema is the only parser for questions.",
  keyPoints: [{ text: "Uses shared schema", weight: 10 }],
  followUps: [],
  commonMistakes: [],
  scoring: {
    totalScore: 10,
    passScore: 6,
    dimensions: [
      {
        name: "Contract",
        score: 10,
        description: "Validates through @jiku/contracts."
      }
    ]
  }
};

parseQuestion(sampleQuestion);
parseScorecard(createEmptyScorecard());

console.log("contracts validated");
