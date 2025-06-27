declare global {
    interface Number {
        format(commas: boolean): string;
        format(commas: boolean, digits: number): string;
    }
    interface NumberConstructor {
        newUID(): number;
    }
}
export {};
