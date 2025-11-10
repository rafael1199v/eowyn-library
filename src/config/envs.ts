import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  PG_URL: get('PG_URL').required().asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),

}



