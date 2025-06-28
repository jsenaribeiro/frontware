declare global {
   type Route = Record<string, RouteMetaData>

   interface RouteMetaData {
      /** list of route metatags */
      metas?: MetaTag

      /** HTML rendered cached */
      cache?: HTMLString

      /** HTML for suspense await */
      await?: HTMLString

      /** false for fallback routing  */
      exact?: boolean

      /** crashed JSX when try to render in server-side */
      crash?: RFE
   }
}

export { }