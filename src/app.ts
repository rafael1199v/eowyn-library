import { envs } from './config/envs';
import { PostgresDatabase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  await main();
})();


async function main() {
  await PostgresDatabase.connect({
    pgUrl: envs.PG_URL
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}