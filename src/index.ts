import { join } from "path";
import express, { Express, RequestHandler, Request, Response } from 'express';

import { abstract, handle404 } from './abstract';
import { testHandler, declareHost } from './test';

type Verb = "get" | "post" | "put" | "delete" | "patch";

let server: Express;
let exportedDefault = {
  listen: finalizeThenListen,
  declared: [] as string[]
};

function finalizeThenListen(head: any, ...args: any){
  server.use(handle404);
  server.listen(head, ...args);

  if(typeof head === "number"){
    declareHost(`http://localhost:${head}`);
    console.log(`Listening on port ${head}`)
  }
}

function setNewDefaultInstance(instance?: Express){
  server = instance || express();
  Object.setPrototypeOf(exportedDefault, server);
}

function addRouteToList(verb: string, path: string) {
  // const padding = Array(6 - verb.length + 1).join(" ");
  verb = verb.toUpperCase();
  exportedDefault.declared.push(`[${verb}] ${path}`);
}

const routeStack = [] as string[];
let currentNamespace = {} as {
  module: string;
  prefix: string;
};

function callHandler(verb: Verb){
  return (loc: string, handler: Function) => {
    const namespace = getNamespace() || "";
    const path = join(namespace, ...routeStack, loc);

    addRouteToList(verb, path)
  
    if(!handler)
      throw new Error(`Resource ${path} has no supplied handler!`);
  
    let wrapper = verb == "get"
      ? (req: Request) => handler(req.query) 
      : (req: Request) => handler(req.body)
  
    server[verb](path, abstract(wrapper as any))
  }
}

function definitionHandler(loc: string, verb: Verb){
  const namespace = getNamespace() || "";
  const path = join(namespace, ...routeStack, loc);
  
  return (...handlers: RequestHandler[]) => {
    const main = handlers.pop();
    if(!main)
      throw new Error(`Resource ${path} has no supplied handler!`);

    addRouteToList(verb, path)
    server[verb](path, ...handlers, abstract(main))
  }
}

const stacktraces = /at +(.+):\d+:\d+\)/;
const verb = /\[as [A-Z]+\]/;

function getNamespace(): string | void;
function getNamespace(setPrefix: string): void; 
function getNamespace(setPrefix?: string): string | void {
  let file = "";
  const fn = __filename;
  const ns = currentNamespace;

  try {
    let found = false;
    const stack = new Error()
      .stack!
      .split("\n")
      .slice(1)
      .map(x => stacktraces
        .exec(x)![1]
        .split(" (")
      );

    for(const [func, f] of stack){
      if(found){
        file = f;
        break;
      }

      if(func.match(verb) || func.indexOf("Function.apply") >= 0 && f == fn)
        found = true;
    }

    if(!file && (ns.prefix || setPrefix))
      throw new Error("Could not determine file resource was defined in!")
    
    if(typeof setPrefix == "string"){
      ns.module = file;
      ns.prefix = setPrefix;
    }
    else if(ns.module == file)
      return ns.prefix;
  }
  catch(err){}
}

function scope(prefix: string, context: () => void){
  routeStack.push(prefix);
  context();
  routeStack.pop();
}

type Wrapper = (
  returned: any, 
  request: Request, 
  response: Response
) => any;

function extendHandler(verb: Verb){
  return (
    middleware: RequestHandler[] = [], 
    wrap?: Wrapper) => {    

    return (loc: string) => {
      const namespace = getNamespace() || "";
      const path = join(namespace, ...routeStack, loc);

      return (handler: RequestHandler) => {
        addRouteToList(verb, path);
  
        if(wrap){
          const original = handler;
          handler = async (req: any, res: any, next: any) => {
            let result = original(req, res, next);
            if(result instanceof Promise)
              result = await result;
  
            return wrap(result, req, res);
          }
        }
  
        server[verb](path, ...middleware, abstract(handler))
      }
    }
  }
}

function resource(verb: Verb){
  function register(loc: string, ...handlers: RequestHandler[]): any {
    const handle = definitionHandler(loc, verb);

    if(handlers.length > 0)
      handle.apply(null, handlers)
    else
      return handle
  }

  register.test = testHandler(verb);
  register.extend = extendHandler(verb);
  register.apply = callHandler(verb);
  
  return register;
}

setNewDefaultInstance();

export const GET = resource("get");
export const POST = resource("post");
export const PUT = resource("put");
export const PATCH = resource("patch");
export const DELETE = resource("delete");
export const ROUTE = scope;
export const USE = (...args: RequestHandler[]) => server.use(...args);

export { setNewDefaultInstance as setDefault };
export { exportedDefault as default, exportedDefault as API, exportedDefault };
export { ROUTE as NEST };
export { getNamespace as NAMESPACE };
export { json, urlencoded } from "express";
export { print } from "./print";
export * from "./errors";
export * from "./gates";