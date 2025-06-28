export function fromKebabCaseToCamelCase(field: string) {
   for (const match of field.matchAll(/-\w/gm)) {
      const [oldName] = match; if (!oldName) continue
      const newName = oldName.replace("-", "").toUpperCase()
      field = field.replace(oldName, newName)
   }

   return field
}

export interface StyleRule {
   /** CSS query selector */
   selector: string

   /** CSS styling object */
   stylings: record
}