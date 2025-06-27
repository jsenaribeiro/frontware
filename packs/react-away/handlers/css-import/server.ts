import { fromKebabCaseToCamelCase, StyleRule } from './shared'

export async function serverParseCSS(cssString: string) {
   const cssList: StyleRule[] = []
   const cssParser = await import('css').then(x => x.default)
   const { stylesheet } = cssParser.parse(cssString)

   for (const rule of stylesheet!.rules) {
      const { type, selectors, declarations } = rule // as CSS.Rule
      
      if (type != "rule") continue      
      
      if (!selectors?.length || !declarations?.length) continue

      for (const selector of selectors) 
      for (const rule of declarations) { // as CSS.Declaration[]
         if (!rule.property || !rule.value) continue
         
         const found = cssList.find(x => x.selector == selector)
         const field = fromKebabCaseToCamelCase(rule.property)
         const value = rule.value
         
         if (found) found.stylings[field] = value
         else cssList.push({ selector, stylings: { [field]:value } })
      
      }
   }

   return cssList;
}