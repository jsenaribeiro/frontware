import { expect, test } from "bun:test"
import { styleProps } from "./styleProps"

test('[style] ignore when has no [grid|cols|gap] props', function () { 
   const [oldProps, params] = [{}, {} as any]
   const newProps = styleProps(oldProps, params)
   expect(oldProps).toBe(newProps)
})

test('[style] add component name in CSS className', function () {
   const [oldProps, params] = [{}, { tag: 'Component' } as any]
   const newProps = styleProps(oldProps, params)
   expect(newProps.className).toBe('Component')
})

test('[style] grid to style.display = grid', function () {
   const { display } = pretest('1fr')
   expect(display).toBe("grid")
})

test('[style] col="1fr" to grid-template-colums = "1fr"', function () {
   const { gridTemplateColumns } = pretest('1fr')
   expect(gridTemplateColumns).toBe("1fr")
})

test('[style] col={2} to grid-template-colums = "1fr 1fr"', function () {
   const { gridTemplateColumns } = pretest(2)
   expect(gridTemplateColumns).toBe("1fr 1fr")
})

test('[style] gaps="?" to grid-template-colums = style.gaps', function () {
   const { gaps } = pretest(2, "10px 10px")
   expect(gaps).toBe("10px 10px")
})

function pretest(cols: any, gaps?: any) {
   const params = {} as any
   const oldProps = { grid: '', cols, gaps }
   const newProps = styleProps(oldProps, params)
   return newProps.style
}