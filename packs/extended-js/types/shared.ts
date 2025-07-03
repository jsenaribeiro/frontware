export interface DecoratorCode {
   full: string; // @decorator(args)
   name: string; // decorator
   args: string; // args
   call: string; // decorator(args)
}

export interface FunctionCode {
   is: Flags // ignore
   all: string; // full ocurrence
   name: string; // function.name
   index: number; // index ocurrence in string
   header: string; // function name(args) | const name = (args)
   content: string; // { return 1 }
   complete: string // function name(args) { } | const name = (args) => { }
   signature: string; // name(args) | name = (args)
   decorators: DecoratorCode[]
   exportation: boolean // 
}

export interface Check {
   check: string | null
   found: string | null
   regex: RegExpMatchArray | null
}

export interface Flags {
   arrow?: boolean
   nested?: boolean
   method?: boolean
   default?: boolean
   anonymous?: boolean
   asynchronous?: boolean
}

export enum Ignore {
   None = 0,
   Anonymous = 1 << 0,
   Nested = 1 << 1,
   Method = 1 << 2,
   Arrow = 1 << 3,
   Default = 1 << 4
}

export type Writable<T> = {
   -readonly [P in keyof T]: T[P];
}