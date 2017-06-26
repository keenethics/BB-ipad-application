declare module "*.json" {
  const json: any;
  export const objects: any;
  export default json;
}

declare module "d3-geo-projection" {
  export function geoPatterson(): any;
}

declare module "crypto-js/aes" {
  export function decrypt(data: any, key: string): any;
  export function encrypt(data: string, key: string): any;
}

declare module "crypto-js/enc-utf8" {
  const utf8: any;
  export default utf8;
}

declare module "guid" {
  export function raw(): string;
}

declare module "child_process" {
  export function exec(command: string, callback: Function): any;
  export function fork(modulePath: string, args?: any[], options?: any[]): any;
}

declare module "fs" {
  export function existsSync(path: string): void;
  export function writeFile(path: string, data: any, callback: Function): void;
  export function unlinkSync(path: string): void;
}

interface Fiber {
    reset: () => any;
    run: (param?: any) => any;
    throwInto: (ex: any) => any;
}

declare module "fibers" {

    function Fiber(fn: Function): Fiber;

    namespace Fiber {
        export var current: Fiber;
        export function yield(value?: any): any
    }

    export = Fiber;
}