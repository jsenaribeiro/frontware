import { expect, test } from "bun:test"
import { extractFunctions } from "../plugin"
import { Ignore } from "../types"

const oldCode = `
function myFunction() {}
async function myAsyncFunction() {}
function* myGenFunction() { yield 1; }
async function* myAsyncGenFunction() { yield 1; }
export function exportedFunction() {}
export async function exportedAsyncFunction() {}
export default function namedDefault() {}
const funcExpr = function namedFuncExpr() {};
const asyncFuncExpr = async function namedAsyncFuncExpr() {};
const genFuncExpr = function* namedGenFuncExpr() { yield 1; };
const asyncGenFuncExpr = async function* namedAsyncGenFuncExpr() { yield 1; };
const arrow = () => {};
const asyncArrow = async () => {};
const implicitArrow = (a, b) => a + b;
export const asyncImplicitArrow = async () => await Promise.resolve("done");
export default function namedDefaultExport() {}
export default async function namedAsyncDefaultExport() {}
export default function namedExportedFunction() {}
function topFunction() { function subFunction() { } }
class Test { ignoreMyMethod(){ } }`

const functions = 'myFunction,myAsyncFunction,myGenFunction,myAsyncGenFunction,'
   + 'exportedFunction,exportedAsyncFunction,namedDefault,namedFuncExpr,namedAsyncFuncExpr,'
   + 'namedGenFuncExpr,namedAsyncGenFuncExpr,arrow,asyncArrow,implicitArrow,asyncImplicitArrow,'
   + 'namedDefaultExport,namedAsyncDefaultExport,namedExportedFunction,topFunction'

function pretest(ignoreds: Ignore) {
   const codes = extractFunctions(oldCode, ignoreds)
   return { codes, names: codes.map(x => x.name) }
}

test('fn-extractor: ignore nested function', function () {
   const names = pretest(Ignore.Nested).names
   expect(false).toBe(names.includes('subFunction'))
})

test('fn-extractor: ignore anonymous function', function () {
})

test('fn-extractor: get only nested function', function () {
   const names = pretest(Ignore.None).names
   expect(names).toContain('subFunction')
})

functions.split(',').map(x => x.trim()).forEach(function (name) {
   test(`fn-extractor: has ${name} success`, function () {
      const names = pretest(Ignore.Nested).names
      expect(names).toContainValues(functions.split(','))
   })   
})