# @overweb

Overweb is a software engineering research in frontend developement. The **jss** here means javascript on server (or server-side javascript).

| character | mean | description |
|:-:|-|-|
| \> | package | sub-divisions  |
| ^ | dependencies | imported packages |
| + | innovation | new library feature |
| - | minimalized | enhanced simplified feature |
| = | supports | feature that library supports |
| ~ | incremental | relative enhanced feature |
| L | related | related itens of a feature |

## @overweb/client 

| | |
|-:|-|
| **js-aid** <br> (< 1kb) | + fetch swr extensions: cache, token, clear <br> ~ type mixins: string, object, array <br>  ~ event api fluent facade |
| **async-api** <br> (< 1kb) | ^ js-aid <br> + REST mapping <br> + synchorization <br> + authentication |
| **native-spa** <br> agnostic <br> (< 30kb) | ^ async-api, js-plus, js-aid <br> + router-api: unified router <br> + multi-spa: microfrontend <br> + i18n-aid: i18n props |


## @overweb/server 

| | |
|-:|-|
| **jss-metaprogram**| + function decorators <br> - new globals env, ioc, own <br> ~ facade File, Path, JSXON, etc |
| **html-container** | + micro-component architecture <br> + web standard friendly <br> + JSX-in-HTML feature |
| **jsx-launcher** | + loader: build, import, link(html) <br>  + render: component, element, fragment <br> + server: match(route), fetch(req), catch(ex) |

## @overweb/framework (react-away)

| innovation | improvement | support | 
|-|-|-|
| + reactive objects <br> + dual binding <br> + attribute handler  <br> + modular CSS | - await props (suspense alternative) <br> - directory routes (no conventions) <br> - dynamic route (with decorators) <br> - props routing (declarative way) | = prefetch routing <br> = server components <br> = SSR streaming <br> = restful api |



## Sample

Example of todo list using jsx-framework with global states with reactive objects, data binding props and modular CSS imports

#### **/index.ts** (startup script)

```ts
import { launch } from 'jsx-framework'

const store = { list:[], task:'', done:false }

await launch({ store })
   .handle('[show]', props => ({ ...props, hidden: !props.show}))
   .handle('/hello', req => new Response('world'))   
   .server('./index.html')
```
 
#### **/routes/index.ts** (directory routing)

```tsx
import './index.css'                        

export const TodoList = (props, ({ store })) => <div>
   <h1>Todo List</h1>
   <input data={store} bind='task'/>
   <button onChange={add(store)}>Add</button>      
   { store.list?.map(todoItem) }
</div> 
 
const todoItem = item = <li> 
   <label class={item.done && 'done'}>{ item.name }</label> | 
   <input type='checkbox' checked={item.done} />
</li>

const add = store = e => store.list
   .push({ task:props.task, done:false })
```
 
#### **/routes/index.css** (modular CSS)

```css
.done { text-decoration: line-through }      
```