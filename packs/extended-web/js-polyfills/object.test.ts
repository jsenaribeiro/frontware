import { expect, test } from 'bun:test'
import './object.js'

test('Object: JSON as toString()', function() {
   const obj = { ok: true }

   expect(obj.toString()).toBe('{"ok":true}')
})

test('Object: merging objets', function () {
   var obj1, obj2

   obj1 = { name: 'jonathan' }
   obj2 = { name: 'john', done: true }

   Object.merge(obj1, obj2)   
   expect(obj1.toString()).toBe('{"name":"john"}')

   obj1 = { name: 'john', done: true }
   obj2 = { name: 'jonathan' }

   Object.merge(obj1, obj2)   
   expect(obj1.toString()).toBe('{"name":"jonathan","done":true}')
})

const getValueOfScenarions = [
   { bind: 'ok', data: true, fail: '' },
   { bind: 'x.y.z', data: '', fail: '' },
   { bind: 'person.name', data: 'john', fail: '' },
   { bind: 'a.b.c.d.e.f', data: 'world', fail: '' },
   { bind: 'a.b.c.d.hello', data: '..', fail: 'Not found path binding' }
]

getValueOfScenarions.forEach(function (scenario) {
   const obj = { ok: true, person: { name: 'john' }, a: { b: { c: { d: { e: { f: 'world' } } } } } }
   const txt = scenario.fail ? `${scenario.fail} in '${scenario.bind}'` : `get valueOf '${scenario.bind}'`
   
   test(`Object: ${txt}`, function () {
      try { expect(obj.valueOf(false, scenario.bind)).toBe(scenario.data) }
      catch(ex) { expect(ex).toInclude(scenario.fail) }
   })
})

const setValueOfScenarions = [
   { bind: 'ok', data: false, fail: '', get: x => x.ok },
   { bind: 'x.y.z', data: 'ok', fail: '', get: x => x.x.y.z },
   { bind: 'person.name', data: 'jonathan', fail: '', get: x => x.person.name },
   { bind: 'a.b.c.d.e.f', data: 'world!!!', fail: '', get: x => x.a.b.c.d.e.f },
   { bind: 'a.b.c.d.hello', data: '...', fail: 'Not found path binding', get: x => null }
]

setValueOfScenarions.forEach(function (scenario) {
   const xyz = { x: { y: { z: '' } } }
   const etc = { a: { b: { c: { d: { e: { f: 'world' } } } } } }
   const obj = { ok: true, person: { name: 'john' }, ...xyz, ...etc }
   const txt = scenario.fail ? `${scenario.fail} in '${scenario.bind}'` : `set valueOf '${scenario.bind}'`

   test(`Object: ${txt}`, function () {
      try { 
         obj.valueOf(false, scenario.bind, scenario.data); 
         expect(scenario.get(obj)).toBe(scenario.data)
       }
      catch (ex) {
         expect(ex).toInclude(scenario.fail)
      }
   })
})

// 