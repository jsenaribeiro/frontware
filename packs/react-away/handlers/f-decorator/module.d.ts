declare global {
   interface Module {
      /** active use side of module */
      use: 'client'|'server'

      /** module path */
      path: `file://${string}`

      /** imports and exports */
      ports: Ports
   }

   type Ports = {
      imports: Type[]
      exports: Type[]
   }
}

export { }