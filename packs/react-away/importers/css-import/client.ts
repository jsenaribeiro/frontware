import { fromKebabCaseToCamelCase, StyleRule } from "./shared"

export function clientParseCSS(cssString: string) {
   const cssList: StyleRule[] = []
   const styleSheet = new CSSStyleSheet()
   
   styleSheet.replaceSync(cssString)

   for (const rule of [...styleSheet.cssRules]) {
      if (rule instanceof CSSStyleRule == false) continue

      const stylings = {} as object

      for (let index = 0; index < rule.style.length; index++) {
         const style = rule.style || {} as any
         const field = style.item ? style.item(index) : style[index]
         const value = rule.style.getPropertyValue(field)
         const label = fromKebabCaseToCamelCase(field)

         if (stylings[label] || !value) continue
         else stylings[label] = value.toString()
      }

      cssList.push({ selector: rule.selectorText, stylings })
   }

   return cssList;
}