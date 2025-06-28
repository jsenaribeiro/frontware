class CSSStyleSheet {
   cssRules: any[] = [];
   replaceSync(cssString: string) {
      cssString = cssString.replace(/\/\*[\s\S]+\*\//gmi, '')

      this.cssRules = cssString
         .split('}')
         .map(rule => rule.trim())
         .filter(Boolean)
         .map(rule => {
            const [selector, body] = rule.split('{');
            if (!selector || !body) return null;
            // Parseia propriedades CSS
            const styleObj: Record<string, string> = {};
            body.split(';').forEach(pair => {
               const [key, value] = pair.split(':');
               if (key && value) styleObj[key.trim()] = value.trim();
            });
            return new CSSStyleRule(selector.trim(), styleObj);
         })
         .filter(Boolean);
   }
}

class CSSStyleRule {
   selectorText: string;
   style: any;
   constructor(selectorText: string, styleObj: Record<string, string>) {
      this.selectorText = selectorText;      
      this.style = {
         _styleObj: styleObj,
         length: Object.keys(styleObj).length,
         item(index: number) { return Object.keys(this._styleObj)[index] || null; },
         getPropertyValue(prop: string) { return this._styleObj[prop] || '';},
         [Symbol.iterator]: function* () {
            for (const key of Object.keys(this._styleObj)) {
               yield key;
            }
         }
      };
      Object.keys(styleObj).forEach((k, i) => { this.style[i] = k; });
   }
}

(globalThis as any).CSSStyleSheet = CSSStyleSheet;
(globalThis as any).CSSStyleRule = CSSStyleRule;

export { }