import type { Question } from "@jiku/contracts";

export const publicQuestions = [
  {
    id: "typescript-structural-typing",
    title: "Explain TypeScript structural typing.",
    category: "TypeScript",
    topic: "Type System",
    tags: ["typescript", "type-system", "structural-typing"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question:
      "Why does TypeScript use structural typing, and how does it affect assignability?",
    standardAnswer:
      "TypeScript compares the shape of values instead of requiring explicit nominal declarations. A value is assignable when it has the required members with compatible types, which makes plain JavaScript objects easy to type while still catching missing or incompatible fields.",
    keyPoints: [
      { text: "Mentions shape-based compatibility", weight: 4 },
      { text: "Explains assignability by required members", weight: 3 },
      { text: "Connects the model to JavaScript ergonomics", weight: 3 }
    ],
    followUps: ["When would nominal typing be useful?"],
    commonMistakes: ["Confusing structural typing with inheritance."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Concept",
          score: 4,
          description: "Defines structural typing correctly."
        },
        {
          name: "Assignability",
          score: 3,
          description: "Explains compatible member checks."
        },
        {
          name: "Tradeoff",
          score: 3,
          description: "Names JavaScript interoperability."
        }
      ]
    }
  },
  {
    id: "javascript-event-loop",
    title: "Describe the JavaScript event loop.",
    category: "JavaScript",
    topic: "Runtime",
    tags: ["javascript", "event-loop", "async"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question:
      "How do call stack work, task queue, and microtask queue cooperate in JavaScript?",
    standardAnswer:
      "JavaScript executes synchronous code on the call stack. When the stack is empty, the runtime drains queued microtasks such as resolved promise handlers before taking the next task such as timers or user events. This ordering explains why promise callbacks usually run before setTimeout callbacks scheduled in the same turn.",
    keyPoints: [
      { text: "Separates stack, tasks, and microtasks", weight: 4 },
      { text: "States microtasks run before the next task", weight: 4 },
      { text: "Uses promise and timer examples", weight: 2 }
    ],
    followUps: ["Where does requestAnimationFrame fit?"],
    commonMistakes: ["Saying JavaScript runs everything in parallel."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Runtime model",
          score: 4,
          description: "Explains stack and queues."
        },
        {
          name: "Ordering",
          score: 4,
          description: "Gets microtask ordering right."
        },
        {
          name: "Example",
          score: 2,
          description: "Provides a concrete async example."
        }
      ]
    }
  },
  {
    id: "vue-computed-vs-watch",
    title: "Compare computed and watch in Vue.",
    category: "Vue",
    topic: "Reactivity",
    tags: ["vue", "reactivity", "computed", "watch"],
    difficulty: "easy",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "When should you use computed, and when should you use watch in Vue 3?",
    standardAnswer:
      "Use computed for derived values that can be expressed from reactive state and cached until dependencies change. Use watch for side effects triggered by reactive changes, such as persistence, network calls, or integration with imperative APIs.",
    keyPoints: [
      { text: "Computed is for derived state", weight: 4 },
      { text: "Computed values are cached by dependency", weight: 2 },
      { text: "Watch is for side effects", weight: 4 }
    ],
    followUps: ["What is watchEffect useful for?"],
    commonMistakes: ["Using watch to store a value that could be computed."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Computed",
          score: 4,
          description: "Explains derived cached state."
        },
        {
          name: "Watch",
          score: 4,
          description: "Explains side effect use cases."
        },
        {
          name: "Judgment",
          score: 2,
          description: "Chooses the simpler primitive."
        }
      ]
    }
  },
  {
    id: "react-state-rerender",
    title: "Explain React state updates and re-rendering.",
    category: "React",
    topic: "Rendering",
    tags: ["react", "state", "rendering"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question:
      "What happens when a React component schedules a state update, and how can you avoid unnecessary renders?",
    standardAnswer:
      "React schedules work for the component tree, re-runs affected component functions to produce the next UI, reconciles the result with the previous tree, and commits the necessary host updates. To avoid unnecessary renders, keep state close to where it is used, derive simple values during render, preserve stable keys, and reserve memoization for measured expensive work or stable child props.",
    keyPoints: [
      { text: "Explains scheduled update and re-render", weight: 3 },
      { text: "Mentions reconciliation and commit", weight: 3 },
      { text: "Recommends local state and derived values", weight: 2 },
      { text: "Uses memoization only when justified", weight: 2 }
    ],
    followUps: ["When would React.memo help, and when would it be noise?"],
    commonMistakes: ["Assuming every re-render causes a full DOM replacement."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Update model",
          score: 3,
          description: "Explains scheduled state updates and re-rendering."
        },
        {
          name: "Reconciliation",
          score: 3,
          description: "Mentions comparison and commit work."
        },
        {
          name: "State design",
          score: 2,
          description: "Keeps state close and derives simple values."
        },
        {
          name: "Optimization",
          score: 2,
          description: "Uses memoization only for clear cost or stable props."
        }
      ]
    }
  },
  {
    id: "cocos-node-component",
    title: "Explain Node and Component in Cocos Creator.",
    category: "Cocos",
    topic: "Scene Model",
    tags: ["cocos", "node", "component"],
    difficulty: "easy",
    frequency: "medium",
    accessLevel: "free",
    products: ["web"],
    question:
      "What is the relationship between a Node and a Component in Cocos Creator?",
    standardAnswer:
      "A Node represents an object in the scene hierarchy and owns transform, parenting, and activation state. Components attach behavior or rendering capability to nodes. This composition model keeps scene structure separate from reusable behavior.",
    keyPoints: [
      { text: "Node belongs to the scene hierarchy", weight: 4 },
      { text: "Component adds behavior or rendering", weight: 4 },
      { text: "Mentions composition", weight: 2 }
    ],
    followUps: ["Why is composition useful in game scenes?"],
    commonMistakes: ["Treating every behavior as a subclassed node."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Node",
          score: 4,
          description: "Explains hierarchy and transform role."
        },
        {
          name: "Component",
          score: 4,
          description: "Explains attached behavior."
        },
        {
          name: "Architecture",
          score: 2,
          description: "Explains composition."
        }
      ]
    }
  },
  {
    id: "ai-agent-tool-boundary",
    title: "Define an AI agent tool boundary.",
    category: "AI Agent",
    topic: "Tool Use",
    tags: ["ai-agent", "tools", "contracts"],
    difficulty: "medium",
    frequency: "medium",
    accessLevel: "free",
    products: ["web"],
    question: "What should be included in a safe tool boundary for an AI agent?",
    standardAnswer:
      "A safe tool boundary states the tool purpose, input schema, output schema, side effects, permission model, failure modes, and audit behavior. The agent should validate inputs, expose narrow capabilities, and avoid turning one tool into an unrestricted shell.",
    keyPoints: [
      { text: "Names input and output contracts", weight: 3 },
      { text: "Mentions side effects and permissions", weight: 3 },
      { text: "Covers failures and auditability", weight: 2 },
      { text: "Rejects overly broad tools", weight: 2 }
    ],
    followUps: ["How would you design a file-write tool safely?"],
    commonMistakes: ["Giving the model a broad tool without validation."],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Contract",
          score: 3,
          description: "Defines input and output schema."
        },
        {
          name: "Safety",
          score: 3,
          description: "Defines side effects and permissions."
        },
        {
          name: "Operations",
          score: 2,
          description: "Explains failures and audit logs."
        },
        {
          name: "Scope",
          score: 2,
          description: "Avoids unrestricted tools."
        }
      ]
    }
  }
] satisfies Question[];
