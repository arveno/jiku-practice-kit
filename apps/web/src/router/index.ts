import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../features/home/HomePage.vue";
import PracticePage from "../features/practice/PracticePage.vue";
import QuestionsPage from "../features/questions/QuestionsPage.vue";
import ReviewPage from "../features/review/ReviewPage.vue";
import ImportExportPage from "../features/scorecard/ImportExportPage.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/questions", name: "questions", component: QuestionsPage },
    { path: "/practice", name: "practice", component: PracticePage },
    { path: "/review", name: "review", component: ReviewPage },
    { path: "/import-export", name: "import-export", component: ImportExportPage }
  ]
});
