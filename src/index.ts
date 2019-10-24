import express, { Express, RequestHandler } from 'express';

import { abstract } from './abstract';

let server: Express;

function setNewDefaultInstance(instance?: Express){
  server = instance || express();
}

type Verb = "get" | "post" | "put" | "delete" | "patch";

const resource = (verb: Verb) => 
  (loc: string, ...handlers: RequestHandler[]) => {
    const handle = handlers.pop();
    if(!handle)
      throw new Error(`Endpoint ${loc} has no supplied handler!`);
    handlers.push(abstract(handle));
    server[verb](loc, ...handlers)
  }

setNewDefaultInstance();

export const GET = resource("get");
export const POST = resource("post");
export const PUT = resource("put");
export const PATCH = resource("patch");
export const DELETE = resource("delete");
export const USE = (...args: RequestHandler[]) => server.use(...args);

export { setNewDefaultInstance as setDefault }
export { server as default, server as API, server };
export { json, urlencoded } from "express";
export * from "./errors";
export * from "./gates";