# f-decorator

It implements a function decorator and function annotation with new global object for reflection, including IoC container and env file support.

## new globals

- **global.own**: reflection object
- **global.ioc**: IoC container object (optional)
- **global.env**: typed env file, independent of env nodejs

## own intropection

- **global.own.decorators**: all function decorators
- **global.own.functions**: all functions in project
- **global.own.modules**: all modules in project


```ts
function Example() {  }

Example.path        // file path of Example function
Example.module      // module host of Example function
Example.decorators  // list all related function decorators
```

## function decorator

```ts
interface LogDecorator { value: number }
interface LogDecoratorArgs { hi: string }

class log extends Decorator<LogDecorator, LogDecoratorArgs> {
   constructor(args: LogDecoratorArgs) { super(args) }

   public annotation() {
      // stored in decorator.data
      return { value: 1 } 
   }
}

@log({ message: 'it works'})
function Example() { }

Example.decorators[0].name == 'log'
Example.decorators[0].data.value == 1
```