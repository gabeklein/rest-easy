import express, { Express, RequestHandler } from 'express';

import { abstract, handle404 } from './abstract';

let server: Express;
let exportedDefault = {
  listen: finalizeThenListen
};

function finalizeThenListen(...args: any){
  server.use(handle404);
  server.listen(...args);
}

function setNewDefaultInstance(instance?: Express){
  server = instance || express();
  Object.setPrototypeOf(exportedDefault, server);
}

type Verb = "get" | "post" | "put" | "delete" | "patch";

const resource = (verb: Verb) => 
  (loc: string, ...handlers: RequestHandler[]) => {
    const main = handlers.pop();
    if(!main)
      throw new Error(`Endpoint ${loc} has no supplied handler!`);
    server[verb](loc, ...handlers, abstract(main))
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
export * from "./errors";
export * from "./gates";