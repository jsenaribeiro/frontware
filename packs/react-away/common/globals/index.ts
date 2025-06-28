import { env } from "./env"
import { ioc } from "./ioc"
import { own } from "./own"

export { loadEnv } from './env.load'

declare global {
   interface Global {
      /** global env file */
      env: Env

      /** application reflection */
      own: Own

      /** IoC container */
      ioc: IoC
   }
}

export const global: Global = { env, own, ioc }