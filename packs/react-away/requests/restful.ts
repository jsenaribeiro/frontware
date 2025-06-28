import { response } from "commons"

export async function restfulRequest(request: Request) {
   const path = new URL(request.url).pathname

   if (!path.startsWith('/apis')) return request

   try {
      const exp = request.method.toLowerCase()
      const url = `/apis/${path.replace("/api/", "/")}`
      const api = await import(url).then(x => x[exp])
      const res = await api(request)

      if (api) return new Response(res)
      throw `not found ${exp} verb in ${url}`
   }
   catch (ex) {
      return response(404, ex)
   }
}