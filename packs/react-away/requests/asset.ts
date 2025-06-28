import { Path, File, global, response } from "commons"

export async function assetsRequest(request: Request) {
   const route = new URL(request.url).pathname
   const asset = global.own.directories.assets
   
   if (!route.startsWith(asset)) return request

   try {
      const path = Path.cwd + route
      const have = await File.exists(path)
      if (!have) throw `Not found in ${path}`

      const file = await File.load(path)
      return new Response(file.blob)
   }
   catch (message) {
      return response(404, message)
   }
}