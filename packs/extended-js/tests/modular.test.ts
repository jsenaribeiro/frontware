import { expect, test } from "bun:test";
import { moduleMetadataPlugin } from "modular";

const oldCode = `
// 25 exporteds
export var variable = 1
export const constant = 2
export function Sample(){ return 3 }
export @decorator function decorated1(){ return 4 }
export @decorator() function decorated2(){ return 5 }
export @decorator(1,2,3) function decorated3(){ return 6 }
export @decorator({ ok:true }) function decorated4(){ return 7 }
@log(1234) export function exportedFunction() {}
@log() export async function exportedAsyncFunction() {}
@log({ ok: true}) export default function namedDefault() {}
@log(true) export default function namedDefaultExport() {}
@log(true) export default async function namedAsyncDefaultExport() {}
@log(true) export default function namedExportedFunction() {}
@log(true) export function myFunction() {}
@log(11,2) export async function myAsyncFunction() {}
@log([12]) export function* myGenFunction() { yield 1; }
@log('ok') export async function* myAsyncGenFunction() { yield 1; }
@log(true) export const funcExpr = function namedFuncExpr() {};
@log(true) export const asyncFuncExpr = async function namedAsyncFuncExpr() {};
@log(true) export const genFuncExpr = function* namedGenFuncExpr() { yield 1; };
@log(true) export const asyncGenFuncExpr = async function* namedAsyncGenFuncExpr() { yield 1; };
@log(true) export const arrow = () => {};
@log(true) export const asyncArrow = async () => {};
@log(true) export const implicitArrow = (a, b) => a + b;
@log(true) export const asyncImplicitArrow = async () => await Promise.resolve("done");

var _variable = 1
function _Sample(){ return 2 }
@decorator function _decorated1(){ return 3 }
@decorator() function _decorated2(){ return 4 }
@decorator(1,2,3) function _decorated3(){ return 5 }
@decorator({ ok:true }) function _decorated4(){ return 6 }
@log(1234) function _exportedFunction() {}
@log() async function _exportedAsyncFunction() {}
@log({ ok: true}) default function _namedDefault() {}
@log(true) default function _namedDefaultExport() {}
@log(true) default async function _namedAsyncDefaultExport() {}
@log(true) default function _namedExportedFunction() {}
@log(true) function _myFunction() {}
@log(11,2) async function _myAsyncFunction() {}
@log([12]) function* _myGenFunction() { yield 1; }
@log('ok') async function* _myAsyncGenFunction() { yield 1; }
@log(true) const _funcExpr = function _namedFuncExpr() {};
@log(true) const _asyncFuncExpr = async function _namedAsyncFuncExpr() {};
@log(true) const _genFuncExpr = function* _namedGenFuncExpr() { yield 1; };
@log(true) const _asyncGenFuncExpr = async function* _namedAsyncGenFuncExpr() { yield 1; };
@log(true) const _arrow = () => {};
@log(true) const _asyncArrow = async () => {};
@log(true) const _implicitArrow = (a, b) => a + b;
@log(true) const _asyncImplicitArrow = async () => await Promise.resolve("done");
`;

test('module metadata', async function () {
   const newCode = await moduleMetadataPlugin('/fake.ts', oldCode)
   console.log(newCode.code)
})
