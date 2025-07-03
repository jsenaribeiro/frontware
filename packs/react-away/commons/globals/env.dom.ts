import { loadEnv } from "./env.load"

export class BrowserEnv implements Env {
   public PORT = 0
   public DELAY = 33
   public ZIPPED = false
   public MINIFIED = true
   public PREFIX_URL = '/'
   public HOSTNAME = 'http://locahost'
   public ROBOT = []
   public SITEMAPS = []
   public load = loadEnv
}