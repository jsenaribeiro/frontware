export { }

import { File } from '../../js-server-side'

declare global {
   interface IPath {
      isDirectory: boolean
      name: string
      path: string
      mode: 'file'|'http'
      pathname: string
      filename: string
      parent: IPath
      route: string
      
      file(): Promise<File|null>
      toString()
      directory(): Promise<IPath[]> 
      directory(ext: `.${string}`): Promise<IPath[]>
      directory(only: 'file' | 'folder'): Promise<IPath[]> 
      backTo(name: string): IPath
      resolve(relativePath: string): IPath
      endsWith(...args: string[]): boolean
      delete(): Promise<boolean>
      clear(): Promise<boolean>
   }

   interface PathConstructor extends Class {

      /** project root folder */
      cwd: string

      /** node_modules folder */
      npm: string

      /** current module path */
      now: string

      new(path: string): IPath
      new(meta: ImportMeta): IPath

      from(path: string): IPath
      from(meta: ImportMeta): IPath
   }
}