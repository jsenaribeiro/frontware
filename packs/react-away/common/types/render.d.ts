export { }

declare global {
   type ServerRender = "static" | "dynamic" | "periodic"

   type Hydration = { off: boolean, tag: string, jsx?: RFC }

   interface SyncRender extends IRender<RFE, RFE | RFE[]> { }

   interface AsyncRender extends IRender<Async<RFE>, Async<RFE | RFE[]>> { }
}