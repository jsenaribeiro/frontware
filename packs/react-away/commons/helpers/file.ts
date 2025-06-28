import './blob'
import * as fs from 'fs'
import * as fsAsync from 'fs/promises';

export class File extends Blob {
   name: string;
   lastModified: number;

   constructor(text: string, name: string);
   constructor(text: string, name: string, options?: { type?: string; lastModified?: number });
   constructor(parts: (string | Uint8Array | Buffer | ArrayBuffer | ArrayBufferView)[], name: string, options?: { type?: string; lastModified?: number });
   constructor(parts: string | (string | Uint8Array | Buffer | ArrayBuffer | ArrayBufferView)[],
      name: string, options: { type?: string; lastModified?: number } = {}) {

      if (typeof parts === "string") super([parts], { type: options.type ?? "text/plain" });

      else {
         const validParts = (parts as any[]).map(part => {
            if (part instanceof Uint8Array && !(part instanceof Buffer))
               return Buffer.from(part);
            return part;
         })

         super(validParts, options);
      }

      this.name = name;
      this.lastModified = options.lastModified ?? Date.now();
   }

   get [Symbol.toStringTag]() { return "File"; }

   public static async load(path: string): Promise<File>
   public static async load(path: string, decode: boolean): Promise<File>
   public static async load(path?: string, decode?: boolean): Promise<File> {
      if (!path) throw 'The path in File.load(path) is empty'
      if (await File.exists(path)) throw 'File.load(path) not found'

      const data = await fsAsync.readFile(path, { encoding: 'utf-8' })
      const text = decode ? decodeURI(data) : data
      const name = path.split(/[\\/]/).pop() ?? 'undefined';

      return new File(text, name, { type: File.mimeOf(path, text) })

   }

   public static exists = (path: string) =>
      new Promise<boolean>(done => done(fs.existsSync(path)))

   public static mimeOf(path: string, text: string): string {
      const extToMime: Record<string, string> = {
         txt: "text/plain",
         html: "text/html",
         htm: "text/html",
         css: "text/css",
         js: "application/javascript",
         json: "application/json",
         xml: "application/xml",
         csv: "text/csv",
         md: "text/markdown",
         svg: "image/svg+xml",
         jpg: "image/jpeg",
         jpeg: "image/jpeg",
         png: "image/png",
         gif: "image/gif",
         pdf: "application/pdf",
      };

      const mimeMap = path.toLowerCase()
         .match(/\.([a-z0-9]+)$/)
         ?.map(x => x[1] && extToMime[x[1]])
         ?.at(1)

      if (mimeMap) return mimeMap
      else text = text.trim()

      try { JSON.parse(text); return 'application/json' } catch { }
      if (/<\/?[a-z][\s\S]*>/i.test(text)) return 'text/html'
      else return 'text/plain'
   }
   
   public get blob(): Blob {
      return new Blob([this], { type: (this as any).type ?? "application/octet-stream" });
   }
}