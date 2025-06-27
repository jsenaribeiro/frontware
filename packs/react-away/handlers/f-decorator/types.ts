export interface DecoratorCode {
   full: string;
   name: string;
   args: string;
   call: string;
}

export interface Check {
   check: string | null
   found: string | null
   match: RegExpMatchArray | null;
   catch: Record<string, DecoratorCode[]>;
}


export interface CodeFunction {
   is: Flags
   name: string;
   index: number;
   header: string;
   content: string;
   complete: string;
   signature: string;
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
