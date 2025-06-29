# f-decorator

It implements a function decorator with global object for reflection, including IoC container and env file support.

## new globals

- **global.own**: reflection object
- **global.ioc**: IoC container object (optional)
- **global.env**: typed env file, independent of env nodejs

## own intropection

- **global.own.decorators**: all data decorators
- **global.own.functions**: all functions
- **global.own.modules**: all modules


## object reflection


```ts
function Example() {  }

Example.path        // file path of function
Example.async       // true if it returns Promise
Example.module      // module host of Example function
Example.decorators  // list all related function decorators

Module.ports.exports  // all exported objects
global.own.modules.
```

## function decorator

Creating a function decorator.

```ts
class log extends Decorator {
   constructor(args: LogDecoratorArgs) { super(args) }
   public annotation = () => 'done' // decorator.data
}

```

Using a function decorator.

```ts
@log({ hi: 'it works'})
function Example() { }

Example.decorators[0].name == 'log'
Example.decorators[0].data == 'done'
```

It is transpiled as below.

```ts
const Example = new log({ hi: 'it works'})
   .decorate(function Example() { })
   .target
```

## color syntax issue

To prevent error syntax warning, just use @ts-ignore in typescript projects.

```ts
// @ts-ignore
@log({ hi: 'it works'})
function Example() { }
```