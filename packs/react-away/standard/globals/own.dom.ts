export class BrowserOwn implements Own {
   public is = is
   public url = './index.html'
   public root = '#root'
   public route = {}
   public states = []
   public modules = []
   public handlers = []
   public functions = []
   public hydrations = []
   public directories: Directories = {
      assets: '/assets',
      builds: '/builds',
      routes: '/routes'
   };
}

const is: Status = {
   build: false,
   debug: false,
   fails: false,
   serve: false
}
