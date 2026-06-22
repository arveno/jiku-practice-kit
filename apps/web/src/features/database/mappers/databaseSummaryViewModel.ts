import type { LocalDatabaseSummary } from "../../local-api/client";

type DatabaseStatViewModel = {
  id: string;
  label: string;
  value: string;
};

type DatabaseDetailViewModel = DatabaseStatViewModel;

type DatabaseSummaryViewModel = {
  stats: DatabaseStatViewModel[];
  details: DatabaseDetailViewModel[];
};

const stateLabels: Record<LocalDatabaseSummary["state"], string> = {
  connected: "已连接",
  unwritable: "不可写",
  unavailable: "未连接"
};

export function mapDatabaseSummaryViewModel(
  summary: LocalDatabaseSummary
): DatabaseSummaryViewModel {
  return {
    stats: [
      { id: "attempts", label: "总作答", value: String(summary.totalAttempts) },
      {
        id: "progress",
        label: "进度文件",
        value: String(summary.questionProgressCount)
      },
      {
        id: "review",
        label: "复习计划",
        value: String(summary.reviewScheduleCount)
      },
      {
        id: "corrupted",
        label: "异常文件",
        value: String("corruptedCount" in summary ? summary.corruptedCount : 0)
      }
    ],
    details: [
      { id: "state", label: "状态", value: stateLabels[summary.state] },
      {
        id: "root",
        label: "数据根目录",
        value: "root" in summary ? summary.root : "-"
      },
      {
        id: "databasePath",
        label: "数据库目录",
        value: "databasePath" in summary ? summary.databasePath : "-"
      },
      {
        id: "activeSession",
        label: "当前轮次",
        value: summary.activeSession
          ? `${summary.activeSession.id} · 第 ${summary.activeSession.currentIndex + 1}/${summary.activeSession.questionIds.length} 题`
          : "无"
      }
    ]
  };
}
