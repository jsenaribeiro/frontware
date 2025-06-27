declare global {
   interface Number {
      format(commas: boolean): string
      format(commas: boolean, digits: number): string
   }

   interface NumberConstructor {
      newUID(): number
   }
}

Number.prototype.format = function(commas?: boolean, digits?: number) {
   const numeric = this.toString()
   const splited = separtorThousand(this)

   if (commas === undefined) return numeric
   if (digits === undefined) return commas ? splited : numeric
   if (digits == 0) return this.format(commas)

   const results = this.toFixed(digits)
   const decimal = '.' + results.at(2)
   const integer = new Number(results.split(".")[0])
   const changed = separtorThousand(integer)
   const returns = numeric.replace(integer.toString(), changed) + decimal

   return returns
}

Number.newUID = function () {
   return new Date().getTime()
}

const separtorThousand = (n: Number) => n.toString()
   .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")

export {}