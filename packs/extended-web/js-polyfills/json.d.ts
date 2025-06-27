import './array';
declare global {
    interface JSON {
        is(value: string): boolean;
        scriptify<T = any>(that: T): string;
        scriptify<T = any>(that: T, swap: Swap): string;
        scriptify<T = any>(that: T, swap: Swap, functionless: boolean): string;
    }
}
type Swap = (field: string, value: any) => any;
export {};
