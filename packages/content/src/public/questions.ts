import type { Question } from "@jiku/contracts";

export const publicQuestions = [
  {
    id: "typescript-structural-typing",
    title: "说明 TypeScript 的结构化类型",
    category: "TypeScript",
    topic: "类型系统",
    tags: ["typescript", "type-system", "structural-typing"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "为什么 TypeScript 使用结构化类型？它会怎样影响赋值兼容性？",
    standardAnswer:
      "TypeScript 比较的是值的结构，而不是要求类型之间有显式的名义声明。只要一个值拥有目标类型要求的成员，并且这些成员类型兼容，它就可以赋值给目标类型。这样既贴近 JavaScript 对普通对象的使用方式，也能在缺字段或字段类型不兼容时给出检查。",
    keyPoints: [
      { text: "说明按结构或形状判断兼容性", weight: 4 },
      { text: "说明赋值时检查目标类型要求的成员", weight: 3 },
      { text: "能联系到 JavaScript 普通对象的使用习惯", weight: 3 }
    ],
    followUps: ["什么场景下名义类型会更有用？"],
    commonMistakes: ["把结构化类型误解成继承关系。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "概念",
          score: 4,
          description: "正确解释结构化类型。"
        },
        {
          name: "赋值兼容性",
          score: 3,
          description: "说明成员兼容性检查。"
        },
        {
          name: "取舍",
          score: 3,
          description: "说明它和 JavaScript 互操作性的关系。"
        }
      ]
    }
  },
  {
    id: "javascript-event-loop",
    title: "描述 JavaScript 事件循环",
    category: "JavaScript",
    topic: "运行时",
    tags: ["javascript", "event-loop", "async"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "JavaScript 中调用栈、任务队列和微任务队列是怎样配合工作的？",
    standardAnswer:
      "JavaScript 会先在调用栈上执行同步代码。当调用栈清空后，运行时会先清空已经排队的微任务，例如 Promise 的回调，然后再取下一个宏任务，例如定时器或用户事件。这个顺序解释了为什么同一轮里 Promise 回调通常会早于 setTimeout 回调执行。",
    keyPoints: [
      { text: "区分调用栈、宏任务和微任务", weight: 4 },
      { text: "说明微任务会先于下一个宏任务执行", weight: 4 },
      { text: "能用 Promise 和定时器举例", weight: 2 }
    ],
    followUps: ["requestAnimationFrame 通常处在什么时机？"],
    commonMistakes: ["说 JavaScript 会把所有任务并行执行。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "运行时模型",
          score: 4,
          description: "说明调用栈和队列。"
        },
        {
          name: "执行顺序",
          score: 4,
          description: "正确说明微任务顺序。"
        },
        {
          name: "例子",
          score: 2,
          description: "提供具体异步例子。"
        }
      ]
    }
  },
  {
    id: "vue-computed-vs-watch",
    title: "比较 Vue 中的 computed 和 watch",
    category: "Vue",
    topic: "响应式",
    tags: ["vue", "reactivity", "computed", "watch"],
    difficulty: "easy",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "在 Vue 3 中什么时候应该用 computed，什么时候应该用 watch？",
    standardAnswer:
      "computed 适合表达可以由响应式状态推导出来的值，并且会根据依赖缓存，直到依赖变化才重新计算。watch 适合处理由响应式变化触发的副作用，例如持久化、网络请求，或者和命令式 API 集成。",
    keyPoints: [
      { text: "computed 用于派生状态", weight: 4 },
      { text: "computed 会基于依赖缓存", weight: 2 },
      { text: "watch 用于副作用", weight: 4 }
    ],
    followUps: ["watchEffect 适合解决什么问题？"],
    commonMistakes: ["用 watch 保存一个本来可以 computed 出来的值。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "computed",
          score: 4,
          description: "说明派生和缓存状态。"
        },
        {
          name: "watch",
          score: 4,
          description: "说明副作用场景。"
        },
        {
          name: "判断",
          score: 2,
          description: "能选择更简单的响应式工具。"
        }
      ]
    }
  },
  {
    id: "react-state-rerender",
    title: "说明 React 状态更新和重新渲染",
    category: "React",
    topic: "渲染",
    tags: ["react", "state", "rendering"],
    difficulty: "medium",
    frequency: "high",
    accessLevel: "free",
    products: ["web"],
    question: "React 组件触发状态更新后会发生什么？怎样减少不必要的渲染？",
    standardAnswer:
      "React 会为组件树安排更新，重新执行受影响的组件函数以得到下一次 UI 描述，再和之前的树进行协调，最后提交必要的宿主环境更新。减少不必要渲染时，应把状态放在真正使用它的位置附近，在渲染期间直接派生简单值，保持稳定 key，只在确实有成本或需要稳定子组件参数时再使用 memoization。",
    keyPoints: [
      { text: "说明状态更新会安排重新渲染", weight: 3 },
      { text: "提到协调和提交阶段", weight: 3 },
      { text: "建议让状态靠近使用处并派生简单值", weight: 2 },
      { text: "说明 memoization 不应滥用", weight: 2 }
    ],
    followUps: ["React.memo 什么时候有帮助，什么时候只是噪声？"],
    commonMistakes: ["认为每次重新渲染都会完整替换 DOM。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "更新模型",
          score: 3,
          description: "说明状态更新和重新渲染。"
        },
        {
          name: "协调",
          score: 3,
          description: "提到比较和提交工作。"
        },
        {
          name: "状态设计",
          score: 2,
          description: "让状态靠近使用处并派生简单值。"
        },
        {
          name: "优化",
          score: 2,
          description: "只在有明确成本或稳定参数需求时使用 memoization。"
        }
      ]
    }
  },
  {
    id: "cocos-node-component",
    title: "说明 Cocos Creator 中的 Node 和 Component",
    category: "Cocos",
    topic: "场景模型",
    tags: ["cocos", "node", "component"],
    difficulty: "easy",
    frequency: "medium",
    accessLevel: "free",
    products: ["web"],
    question: "在 Cocos Creator 中，Node 和 Component 是什么关系？",
    standardAnswer:
      "Node 表示场景层级中的对象，负责变换、父子关系和激活状态。Component 挂载在 Node 上，用来提供行为或渲染能力。这种组合模型把场景结构和可复用行为分开。",
    keyPoints: [
      { text: "说明 Node 属于场景层级", weight: 4 },
      { text: "说明 Component 提供行为或渲染能力", weight: 4 },
      { text: "提到组合模型", weight: 2 }
    ],
    followUps: ["组合模型在游戏场景中为什么有用？"],
    commonMistakes: ["把每种行为都做成 Node 子类。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "Node",
          score: 4,
          description: "说明层级和变换职责。"
        },
        {
          name: "Component",
          score: 4,
          description: "说明挂载行为。"
        },
        {
          name: "架构",
          score: 2,
          description: "说明组合思想。"
        }
      ]
    }
  },
  {
    id: "ai-agent-tool-boundary",
    title: "定义 AI Agent 的工具边界",
    category: "AI Agent",
    topic: "工具调用",
    tags: ["ai-agent", "tools", "contracts"],
    difficulty: "medium",
    frequency: "medium",
    accessLevel: "free",
    products: ["web"],
    question: "一个安全的 AI Agent 工具边界应该包含哪些内容？",
    standardAnswer:
      "安全的工具边界应该说明工具目的、输入 schema、输出 schema、副作用、权限模型、失败模式和审计行为。Agent 应该校验输入，暴露尽量窄的能力，避免把一个工具变成不受限制的 shell。",
    keyPoints: [
      { text: "说明输入和输出合同", weight: 3 },
      { text: "说明副作用和权限", weight: 3 },
      { text: "覆盖失败模式和审计", weight: 2 },
      { text: "拒绝过宽的工具能力", weight: 2 }
    ],
    followUps: ["如果要设计文件写入工具，怎样限制才安全？"],
    commonMistakes: ["给模型一个很宽的工具，却不做输入校验。"],
    scoring: {
      totalScore: 10,
      passScore: 6,
      dimensions: [
        {
          name: "合同",
          score: 3,
          description: "定义输入和输出 schema。"
        },
        {
          name: "安全",
          score: 3,
          description: "定义副作用和权限。"
        },
        {
          name: "运维",
          score: 2,
          description: "说明失败模式和审计日志。"
        },
        {
          name: "范围",
          score: 2,
          description: "避免不受限制的工具。"
        }
      ]
    }
  }
] satisfies Question[];
