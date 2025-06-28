import { launch as internalLaunch } from "pipeline/launch"
import { bindProps, formProps, routeProps, styleProps } from "properties"
import { cssImportPlugin, moduleMetadataPlugin, functionDecoratorPlugin } from "importers"
import {
   awaitPropsRender,
   reactivePropsRender,
   serverComponentRender,
   lazySuspenseRender,
   cssImportMerge
} from "renderers"


export async function launch() {
   
   await internalLaunch(true)
      .match("props", bindProps)
      .match("props", formProps)
      .match("props", routeProps)
      .match("props", styleProps)
      .match("import", cssImportPlugin)
      .match("import", moduleMetadataPlugin)
      .match("import", functionDecoratorPlugin)
      .match("jsx", "component", awaitPropsRender)
      .match("jsx", "component", reactivePropsRender)
      .match("jsx", "component", serverComponentRender)
      .match("jsx", "fragment", lazySuspenseRender)
      .match("jsx", "element", cssImportMerge)
   
   // request handler
   // decorators
}