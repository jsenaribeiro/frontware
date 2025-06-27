
/** it loads the env file and sets to env object */
export async function loadEnv(bound: boolean) {
   if (!bound) return

   const path = '.env'
   const record = await parseEnv(path);

   Object.keys(record) // boolean
      .filter(k => record[k])
      .filter(k => record[k].match(/true|false/i))
      .forEach(k => record[k] = record[k].toLowerCase().trim() == 'true')

   Object.keys(record) // number
      .filter(k => !isNaN(parseFloat(record[k])))
      .forEach(k => record[k] = parseFloat(record[k]))

   Object.merge(global.env, record)

   validation(global.env)
}

async function parseEnv(path = '.env'): Promise<record> {
   const file = Bun.file(path)
   const have = await file.exists()

   if (!have) throw new Error(`File env not found in '${path}'.`)

   const content = await file.text()
   const lines = content.split('\n')
   const env: Record<string, string> = {}

   for (const line of lines) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) continue

      const [key, ...rest] = trimmed.split('=')
      const value = rest.join('=').trim().replace(/^"|"$/g, '')

      if (key) env[key.trim()] = value
   }

   return env
}

/** validate if env file is ok */
export function validation(instance) {
   const requireds = {
      PORT: 3000,
      PREFIX_URL: '/'
   }

   for (const k of Object.keys(requireds)) {
      const done = Object.hasOwn(instance, k)
      const none = !(done && instance[k])

      if (!done) throw fail(k, 'field')
      if (none) instance[k] = requireds[k]
   }

   return true
}

/** env file error message */
const fail = (key, pre = '') => `Not found ${pre}'${key.trim()}' of .env file`