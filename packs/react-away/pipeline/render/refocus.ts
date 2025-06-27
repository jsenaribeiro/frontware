"use client"

/** bugfix: retore the previous input focus after the parent rendering */
export function refocus(timeout: number): boolean {
   if (global.env.SIDE == "server") return true

   const currentUID = document.activeElement?.getAttribute("uid") || "0"
   const getQuery = query => document.querySelector<any>(query)
   const focus = _ => getQuery(`[uid='${currentUID}']`)?.focus()

   setTimeout(focus, timeout)
   
   return true
}