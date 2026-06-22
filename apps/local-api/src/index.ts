import { createLocalApiServer } from "./server";
import { createLocalDatabaseStore } from "./store";

const port = Number(process.env.JIKU_LOCAL_API_PORT ?? 8787);
const host = "127.0.0.1";
const server = createLocalApiServer(createLocalDatabaseStore());

server.listen(port, host, () => {
  console.log(`jiku local api listening on http://${host}:${port}`);
});
