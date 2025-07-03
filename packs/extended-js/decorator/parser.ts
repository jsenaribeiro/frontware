import * as ts from 'typescript';
import { Ignore, FunctionCode, Flags } from '../types/shared';

//** extract function from code, ignore method and tested function by defualt */
export function extractFunctions(source: string, ignore: Ignore = Ignore.None): FunctionCode[] {
   const src = ts.createSourceFile('tmp.ts', source, ts.ScriptTarget.Latest, true)
   const has = (flag: Ignore) => (ignore & flag) !== 0
   const res: FunctionCode[] = []

   const ignored: Flags = {
      arrow: has(Ignore.Arrow),
      nested: has(Ignore.Nested),
      method: has(Ignore.Method),
      default: has(Ignore.Default),
      anonymous: has(Ignore.Anonymous)
   }

   loop(src, { nested: false })
   
   return res;

   function push(fn: ts.FunctionLikeDeclaration, name: string, is: Flags) {
      name ||= 'anonymous'
      
      is.asynchronous = !!fn.modifiers
         ?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword);
      
      if (ignored.arrow && is.arrow) return;
      if (ignored.nested && is.nested) return;
      if (ignored.method && is.method) return;
      if (ignored.default && is.default) return;
      if (ignored.anonymous && (is.anonymous || name == 'anonymous')) return;
      
      const all = getAll(fn, src)
      const args = getParameters(fn, src)
      const index = fn.getStart(src)
      const header = getFunctionHeader(fn, src)
      const content = fn.body?.getText() || ''
      const complete = getComplete(args, content)
      const signature = getSignature(header, args)
      const exportation = isFunctionExported(fn)

      res.push({ name, header, signature, content, index, all, complete, is, decorators: [], exportation });
   }
   
   function loop(node: ts.Node, flags: Flags) {
      const isNested = node => flags.nested || ts.isFunctionLike(node)
      const isDefault = node => (node.modifiers || [])
         .some(m => m.kind === ts.SyntaxKind.DefaultKeyword) || false

      if (ts.isFunctionDeclaration(node) && node.name)
         push(node, node.name.text, { ...flags, default: isDefault(node) });

      else if (ts.isMethodDeclaration(node))
         push(node, node.name.getText(), { ...flags, method: true });

      else if (ts.isVariableStatement(node))
         node.declarationList.declarations.forEach(d => {
            const [i, name] = [d.initializer, d.name.getText()];

            if (i && ts.isFunctionExpression(i))
               push(i, i.name?.getText() || name, { ...flags, default: false });

            if (i && ts.isArrowFunction(i))
               push(i, name, { ...flags, arrow: true });

         });

      node.forEachChild(child =>
         loop(child, { ...flags, nested: isNested(node) }));
   }
}

function getComplete(args: string, body: string) {
   args = args.includes('=') ? args.split('=')[1].trim() : args
   return `${args} => ${body}`
}

function isFunctionExported(node: ts.FunctionLikeDeclaration): boolean {
   if (!node.modifiers) return false;
   return node.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword);
}
 
function getSignature(header: string, args: string) {
   const result = header.replace(/\@\w+\(.*?\)\s*|\@\w+ /g, '') + args
   return result.replace('export ', '').trim()
}

function getAll(fn: ts.FunctionLikeDeclaration, src: ts.SourceFile): string {
   if (fn.name?.getText(src)) return fn.getText()
   if (!ts.isVariableDeclaration(fn.parent)) return ''
   else return fn.parent.parent.parent.getText()
}

function getFunctionHeader(fn: ts.FunctionLikeDeclaration, src: ts.SourceFile): string {
   const identifier = fn.name?.getText(src)

   if (identifier && !ts.isVariableDeclaration(fn.parent)) {   
      const start = fn.getStart(src);
      const nameStart = fn.name?.getStart(src) ?? start;
      const modifiersAndKeyword = src.text.slice(start, nameStart).trim();

     return `${modifiersAndKeyword} ${identifier}`.trim();
   }
   
   else if (!ts.isVariableDeclaration(fn.parent)) return ''

   const name = fn.parent.name.getText();
   const base = fn.parent.parent.parent.getText()
   
   return base.split(name)[0] + name
}

function getParameters(fn: ts.FunctionLikeDeclaration, src: ts.SourceFile) {
   if (fn.name?.getText(src)) return `(${fn.parameters.map(p => p.getText()).join(', ')})`;
   if (!ts.isVariableDeclaration(fn.parent)) return ''

   const base = fn.parent.parent.getText()
   const root = fn.parent.parent.parent.getText()
   const sync = !root.includes('async')
   const part = base.split('=>')[0].trim()
   const crop = part.indexOf('(')
   const done = part.substring(crop)

   return (sync ? ' = ' : ' = async ') + done
}