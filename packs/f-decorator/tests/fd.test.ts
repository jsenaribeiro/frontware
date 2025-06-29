// import { expect, test } from "bun:test";
// import { functionDecoratorPlugin } from "./plugin";

// const coder = functionDecoratorPlugin

// const oldCode = `
// @log(true) function myFunction() {}
// @log(11,2) async function myAsyncFunction() {}
// @log([12]) function* myGenFunction() { yield 1; }
// @log('ok') async function* myAsyncGenFunction() { yield 1; }
// @log(1234) export function exportedFunction() {}
// @log() export async function exportedAsyncFunction() {}
// @log({ ok: true}) export default function namedDefault() {}
// @log(true) const funcExpr = function namedFuncExpr() {};
// @log(true) const asyncFuncExpr = async function namedAsyncFuncExpr() {};
// @log(true) const genFuncExpr = function* namedGenFuncExpr() { yield 1; };
// @log(true) const asyncGenFuncExpr = async function* namedAsyncGenFuncExpr() { yield 1; };
// @log(true) const arrow = () => {};
// @log(true) const asyncArrow = async () => {};
// @log(true) const implicitArrow = (a, b) => a + b;
// @log(true) const asyncImplicitArrow = async () => await Promise.resolve("done");
// @log(true) export default function namedDefaultExport() {}
// @log(true) export default async function namedAsyncDefaultExport() {}
// @log(true) export default function namedExportedFunction() {}`


// const newCode = `
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
// export default function namedExportedFunction() {}

// log(import.meta, myFunction)(true);
// log(import.meta, myAsyncFunction)(11,2);
// log(import.meta, myGenFunction)([12]);
// log(import.meta, myAsyncGenFunction)('ok');
// log(import.meta, exportedFunction)(1234);
// log(import.meta, exportedAsyncFunction)();
// log(import.meta, namedDefault)({ ok: true});
// log(import.meta, namedFuncExpr)(true);
// log(import.meta, namedAsyncFuncExpr)(true);
// log(import.meta, namedGenFuncExpr)(true);
// log(import.meta, namedAsyncGenFuncExpr)(true);
// log(import.meta, arrow)(true);
// log(import.meta, asyncArrow)(true);
// log(import.meta, implicitArrow)(true);
// log(import.meta, asyncImplicitArrow)(true);
// log(import.meta, namedDefaultExport)(true);
// log(import.meta, namedAsyncDefaultExport)(true);
// log(import.meta, namedExportedFunction)(true);`

// const cases = [
//    'myFunction',
//    'myAsyncFunction',
//    'myGenFunction',
//    'myAsyncGenFunction',
//    'exportedFunction',
//    'exportedAsyncFunction',
//    'namedDefault',
//    'namedFuncExpr',
//    'namedAsyncFuncExpr',
//    'namedGenFuncExpr',
//    'namedAsyncGenFuncExpr',
//    'arrow',
//    'asyncArrow',
//    'implicitArrow',
//    'asyncImplicitArrow',
//    'namedDefaultExport',
//    'namedAsyncDefaultExport',
//    'namedExportedFunction']

// test(`fn-decorator: success`, function () {
//    const code = coder(oldCode)?.trim()
//    expect(code.trim()).toBe(newCode.trim())
// })   

// cases.forEach(function (name) {
//    test(`fn-decorator: ${name} success`, function () {
//       const code = coder(oldCode)?.trim()
//       const have = `(import.meta, ${name})`
//       // console.log(code)
//       expect(code.trim()).toContain(have)
//    })   
// })