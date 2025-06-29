// import { expect, test } from "bun:test";

// const oldCode = `
// function myFunction() {}
// async function myAsyncFunction() {}
// function* myGenFunction() { yield 1; }
// async function* myAsyncGenFunction() { yield 1; }
// export function exportedFunction() {}
// export async function exportedAsyncFunction() {}
// export default function namedDefault() {}
// const funcExpr = function namedFuncExpr() {};
// const asyncFuncExpr = async function namedAsyncFuncExpr() {};
// const genFuncExpr = function* namedGenFuncExpr() { yield 1; };
// const asyncGenFuncExpr = async function* namedAsyncGenFuncExpr() { yield 1; };
// const arrow = () => {};
// const asyncArrow = async () => {};
// const implicitArrow = (a, b) => a + b;
// const asyncImplicitArrow = async () => await Promise.resolve("done");
// export default function namedDefaultExport() {}
// export default async function namedAsyncDefaultExport() {}
// export default function namedExportedFunction() {}`

// const functions = 'myFunction,myAsyncFunction,myGenFunction,myAsyncGenFunction,'
//    + 'exportedFunction,exportedAsyncFunction,namedDefault,namedFuncExpr,namedAsyncFuncExpr,'
//    + 'namedGenFuncExpr,namedAsyncGenFuncExpr,arrow,asyncArrow,implicitArrow,asyncImplicitArrow,'
//    + 'namedDefaultExport,namedAsyncDefaultExport,namedExportedFunction'

// functions.split(',').map(x => x.trim()).forEach(function (name) {
//    test(`fn-metadata: ${name} success`, function () {
//       const code = coder(oldCode, '/')?.trim()
//       const isAsync = name.toLowerCase().includes('async')
//       expect(code).toContain(template(name, isAsync))
//    })   
// })
// const template = (nm, is) => `
// ${nm}['id'] = 0;
// ${nm}['tag'] = {};
// ${nm}['path'] = '/';
// ${nm}['async'] = ${is};
// ${nm}['module'] = module;
// ${nm}['refresh'] = () => {};
// ${nm}['metatags'] = [];
// ${nm}['stateless'] = true;
// ${nm}['decorators'] = [];`.trim()

