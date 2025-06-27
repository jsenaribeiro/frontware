interface Router {
   readonly now: string
   goto(route: string): void
   match(route: string): boolean
   params<T extends object = any>(route: string): T
   queries: Record<string, string>
}

export const router: Router = {
   get now() { return location.pathname },
   goto(route: string) { history.pushState({}, "", route) },
   match(route: string) { return matching(route).routed  },
   params(route: string) { return matching(route).params },
   get queries() { 
      const search = window.location.search
      const entries = new URLSearchParams(search).entries()
      const queries = Object.fromEntries(entries)
      return queries
   }
}

function matching(route: string) {
   const names = [] as string[];
   const regex = new RegExp('^' + route.replace(/:([^/]+)/g, (_, k) => (names.push(k), '([^/]+)')) + '$')
   const result = location.pathname.match(regex);
   const entries = result && names.map((k, i) => [k, result[i + 1]])
   const params = entries ? Object.fromEntries(entries) : {}
   return { routed: !!result, params };
}