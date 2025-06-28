/** facade to renderToString of react-dom/server */
declare function htmlfyJSX(node: RRE): string;
export declare const JSXON: {
    parse: (json: string) => RRE;
    htmlfy: typeof htmlfyJSX;
    stringify: (jsx: RRE, tabs?: number) => string;
};
export {};
