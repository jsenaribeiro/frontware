/** response function factory of Response type */
export const response = (code: number, body = {} as any, type?: string, head?: any) =>
   new Response(body, { status: code, headers: new Headers({ ...head, 
      "content-type": type || 'text/plain', "charset":"utf-8" })})