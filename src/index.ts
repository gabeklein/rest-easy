import { join } from "path";
import express, { Express, RequestHandler } from 'express';

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
  const resource = `[${verb}] ${path}`;
  exportedDefault.declared.push(resource);
}

const routeStack = [] as string[];
let currentNamespace = {} as {
  module: string;
  prefix: string;
};

function definitionHandler(loc: string, verb: Verb){
  const namespace = getNamespace() || "";
  const path = join(namespace, ...routeStack, loc);
  
  addRouteToList(verb, path)

  return (...handlers: RequestHandler[]) => {
    const main = handlers.pop();
    if(!main)
      throw new Error(`Resource ${path} has no supplied handler!`);
    server[verb](path, ...handlers, abstract(main))
  }
}

const atModule = /\s+at.+\((.+):\d+:\d/;
const cwd = process.cwd();
const isInWorkingDirectory = 
  (d: string) => d.indexOf("node_modules") < 0 && d.indexOf(cwd) >= 0;

function getNamespace(): string | void;
function getNamespace(setPrefix: string): void; 
function getNamespace(setPrefix?: string): string | void {
  const stackAlaCarte = new Error();
  try {
    const at = stackAlaCarte.stack!.split("\n").slice(2).find(isInWorkingDirectory) as any;
    const file = atModule.exec(at)![1];
    const ns = currentNamespace;
    
    if(setPrefix){
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

function resource(verb: Verb){
  function register(loc: string, ...handlers: RequestHandler[]): any {
    const handle = definitionHandler(loc, verb);

    if(handlers.length > 0)
      handle.apply(null, handlers)
    else
      return handle
  }

  register.test = testHandler(verb);
  
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