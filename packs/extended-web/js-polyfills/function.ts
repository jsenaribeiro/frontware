import '../declarations'

(Function.prototype as any).async = function () {
   const functionString = this.toString()
   const lines = functionString.split("\n")
   const headString = lines.at(0) || ''   
   const footString = [lines.at(-1) || '', lines.at(-2) || ''].join("\n")
   const bodyString = functionString.replace(headString, '')
   const awaitRegex = /=\s+await\s+[\w\(]/
   const asuncRegex = /async\s+function|async\s+[\(\w].+=>/
   const promiseRegex = /(return|=>)\s+Promise\.|(return|=>)\s+new\s+Promise\(/

   return headString.equal(asuncRegex)
        || bodyString.equal(awaitRegex)
        || footString.equal(promiseRegex)
}

export { }