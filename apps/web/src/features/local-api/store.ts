import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { readLocalApiStatus, type LocalApiStatus } from "./client";

type LocalApiStoreStatus = LocalApiStatus | { state: "checking"; message: string };

export const useLocalApiStore = defineStore("local-api", () => {
  const status = ref<LocalApiStoreStatus>({
    state: "checking",
    message: "正在检查本地服务"
  });
  const connected = computed(() => status.value.state === "connected");

  async function refresh() {
    status.value = {
      state: "checking",
      message: "正在检查本地服务"
    };
    status.value = await readLocalApiStatus();
    return status.value;
  }

  return {
    status,
    connected,
    refresh
  };
});
