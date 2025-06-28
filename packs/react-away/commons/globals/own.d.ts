/** @module Own reflection type */

import './own.handler'

declare global {
   interface Own {
      is: Status
      url: string 
      root: HTMLQuery
      route: Route
      states: State[]
      modules: Module[]
      handlers: Handlers
      functions: Function[]
      hydrations: Hydration[]
      directories: Directories
   }   
   
   interface Handlers extends HandleMode {
      catch: CatchHandler[]
      fetch: FetchHandler[]
      match: {
         jsx: {
            component: JsxHandler
            fragment: JsxHandler
            element: JsxHandler
         }
         make: MakeHandler[]
         props: PropsHandler[]
         import: ImportHandler[]
      }
   }      
      
   interface State {
      /** uid = component unique identifier 
       *  @returns component setState    */
      [uid: string]: [() => {}]
   }

   interface Status {
      debug: boolean;
      build: boolean;
      serve: boolean;
      fails: boolean;      
   }

   interface Directories {
      builds: `/${string}`
      routes: `/${string}`
      assets: `/${string}`
   }

   type Hydration = { off: boolean, tag: string, jsx?: JSX }
}

export { }