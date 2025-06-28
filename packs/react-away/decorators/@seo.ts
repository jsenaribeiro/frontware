/// <reference path="@seo.d.ts" />

import { getComponentName } from "common"

const charsets = ["UTF-8", "UTF-16"]

export interface SeoDecorator extends MetaTag {
   tag: string
   route: string
}

type Args = string | MetaTag | Function

const seoDecorator: Decorator<SeoDecorator, Component> = (title: string, args: Args) => (meta, call) => {
   const isString = typeof args === "string"
   const isFunction = typeof args == "function"
   const isCharSet = isString && charsets.includes(args)

   if (isString) return seo(title, { description: args })
   if (isCharSet) return seo(title, { charset: args })
   if (isFunction) return seo(title, args(global.ioc.param))

   seoDecorator.parameters = {
      ...args,
      tag: getComponentName(call),
      route: new URL(meta.url).pathname
   }
   
   return call
}

/** SEO decorator for title + description */
export function seo(title: string, description: string): ReturnType<typeof seoDecorator>

/** SEO decorator for title + charset */
export function seo(title: string, charset: "UTF-8"|"UTF-16"): ReturnType<typeof seoDecorator>

/** SEO decorator for title with MetaTag type */
export function seo(title: string, metadata: MetaTag): ReturnType<typeof seoDecorator>

/** SEO decorator for dynamic route with high-order functions */
export function seo(title: string, action: <T=record>(params: T) => MetaTag): ReturnType<typeof seoDecorator>

/** SEO decorator for title + metatags object */
export function seo(title: string, args: string|MetaTag|Function) { return seoDecorator }

