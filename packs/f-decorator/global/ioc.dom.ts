
export class BrowserIoC implements IoC {
   public react = () => { }
   public refer: any
   public await: boolean
   public query: record
   public fails: any[]
   public store: record
   public param: record

   get title() { return document.title }

   get route() {
      return globalThis.location?.pathname as string
   }

   get logon() {
      if (!globalThis.sessionStorage) return ''
      const json = sessionStorage.getItem('logon')
      return json && JSON.parse(json)
   }
}