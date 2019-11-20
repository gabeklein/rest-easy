import express, { Express, RequestHandler } from 'express';

import { abstract, handle404 } from './abstract';
import { testHandler, declareHost } from './test';

type Verb = "get" | "post" | "put" | "delete" | "patch";

let server: Express;
let exportedDefault = {
  listen: finalizeThenListen
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

function definitionHandler(loc: string, verb: Verb){
  return (...handlers: RequestHandler[]) => {
    const main = handlers.pop();
    if(!main)
      throw new Error(`Endpoint ${loc} has no supplied handler!`);
    server[verb](loc, ...handlers, abstract(main))
  }
}

const resource = (verb: Verb) => {
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
export const USE = (...args: RequestHandler[]) => server.use(...args);

export { setNewDefaultInstance as setDefault }
export { exportedDefault as default, exportedDefault as API, exportedDefault };
export { json, urlencoded } from "express";
export { print } from "./print"
export * from "./errors";
export * from "./gates";