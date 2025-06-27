import { expect, test } from "bun:test";
import { PathClass } from "./path";

const cases = [
   { url: 'c:\\top\\sub', path: 'c:/top/sub' },
   { url: 'file:///top/sub/', path: 'file:///top/sub' },
   { url: 'file://c:\\top\\sub', path: 'file://c:/top/sub' },
   { url: 'file://c:\\top\\sub', type: 'file' },
   { url: 'http://c:\\top\\sub', type: 'http' },
   { url: 'file:///top/sub/name.txt', name: 'name' },
   { url: 'file:///top/sub/name.txt', filename: 'name.txt' },
   { url: 'file:///top/sub/name.txt', pathname: '/top/sub' },
   { url: 'file:///top/sub', parent: '/top' },
   { url: 'file:///top/sub/name.txt', parent: '/top' },
]

test('Path: format path', function () {
   cases.forEach(function (info) {
      const path = new PathClass(info.url)
      // const [field, value] = Object.entries(info).at(1)
      
      // expect(path[field]).toBe(value)
   })
})

test('Path: . is ced', function () {
   const path = new PathClass('.')
   expect(path.path).toBe(PathClass.cwd)
})