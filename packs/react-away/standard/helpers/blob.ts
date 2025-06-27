export class Blob {
   private parts: (string | Uint8Array)[];
   type: string;
   size: number;

   constructor(parts: (string | Uint8Array)[] = [], options: { type?: string } = {}) {
      const reducer = (acc, p) => acc + (typeof p === 'string'
         ? new TextEncoder().encode(p).length
         : p.byteLength)

      this.parts = parts;
      this.type = options.type ?? '';
      this.size = parts.reduce(reducer, 0);
   }

   public text = () => Promise.resolve(new TextDecoder().decode(this.u7Arr))

   async arrayBuffer(): Promise<ArrayBuffer> {
      return this.u7Arr.buffer instanceof ArrayBuffer
         ? this.u7Arr.buffer.slice(this.u7Arr.byteOffset, this.u7Arr.byteOffset + this.u7Arr.byteLength)
         : new Uint8Array(this.u7Arr.buffer, this.u7Arr.byteOffset, this.u7Arr.byteLength).slice().buffer as ArrayBuffer;
   }

   public slice = (start?: number, end?: number, type?: string) =>
      new Blob(this.parts, { type: type ?? this.type })

   get [Symbol.toStringTag]() { return "Blob"; }

   private get u7Arr(): Uint8Array {
      const mapper = p => (typeof p === 'string' ? new TextEncoder().encode(p) : p)
      const reducer = (acc, b) => acc + b.length
      const buffers = this.parts.map(mapper);
      const full = new Uint8Array(buffers.reduce(reducer, 0));
      let offset = 0;
      for (const b of buffers) {
         full.set(b, offset);
         offset += b.length;
      }
      return full;
   }
}