interface IFile extends Blob {
   name: string;
   lastModified: number;
   readonly [Symbol.toStringTag]: string;
}
 
type PartType = string | Uint8Array | ArrayBuffer | ArrayBufferView

interface IFileConstructor {
   new(parts: string | (PartType)[],name: string,
      options?: { type?: string; lastModified?: number }): IFile;

   load(path: string): Promise<IFile>;
   load(path: string, decode: boolean): Promise<IFile>;
   exists(path: string): Promise<boolean>;
   mimeOf(path: string, text: string): string;
}
 