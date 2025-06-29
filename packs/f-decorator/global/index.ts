import { env } from "./env"
import { ioc } from "./ioc"
import { own } from "./own"

export { loadEnv } from './env.load'

declare global {
   interface Reflection {
      /** global env file */
      env: Env

      /** IoC container */
      ioc: IoC

      /** reflection object */
      own: Own
   }
}

export const global: Reflection = { env, own, ioc }