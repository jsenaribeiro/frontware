export { }

declare global {
   interface String {
      /** easy query regex */
      query(regex: RegExp): string[]
      
      /** easy query regex */
      query(pattern: string): string[]
      
      /** easy query regex */
      query(regex: RegExp, multiple: true): string[][]
      
      /** easy query regex */
      query(pattern: string, multiple: true): string[][]
      
      /** structural comparison */
      equal(regex: RegExp): boolean
      
      /** structural comparison */
      equal(pattern: string): boolean
      
      /** structural comparison */
      equal(value: string, ignoreWhiteSpace: boolean): boolean
      
      /** uppercase first letter and lowercase the rest */
      capitalize(): string
      
      /** refined replace function */
      swap(...values: any[]): string
      
      /** remove a partial string */
      drop(value: string): string
      
      /** convert string into array of characters */
      toArray(): any[]
      
      /** parse a string to JSON */
      toObject(): object
      
      /** convert a numeric string to number */
      toNumber(): number

      /** add scapes to regex expression */
      toRegex(): string

      /** similar to string.Format(...) of C# */
      place(...positions: string[])
      
      //** fix string like:
      // - double spaces; */
      fix(): string
   }
}