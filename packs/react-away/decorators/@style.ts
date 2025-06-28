import { serverParseCSS, StyleRule } from "importers"
import { global } from "commons";

export interface StyleDecorator { url: string,  styles: StyleRule[] }

const styleDecorator: Decorator<StyleDecorator, Component> = (url: string) => (meta, call) => {
   if (!global.own.is.serve) return call

   Bun.file(meta.resolve(url)).text()
      .then(appendingFunctionCSS)

   async function appendingFunctionCSS(css) {
      const styles = await serverParseCSS(css)
      call.metadata.module.ports.imports.push(styles)
      styleDecorator.parameters = { url, styles }
   }

   styleDecorator.parameters = { url, styles:[] }
   
   return call
}

/** It applies a CSS into decorated component 
 * @param {string} url CSS relative path */
export function style(url: `${string}`): ReturnType<typeof styleDecorator> { return styleDecorator(url) }

