import { RequestHandler } from 'express';

import { abstract } from './abstract';
import { server } from './server';

export { server, server as API, server as default };
export { json, urlencoded } from "express";
export * from "./errors";
export * from "./gates";

type Verb = "get" | "post" | "put" | "delete" | "patch";

const resource = (verb: Verb) => 
  (loc: string, ...handlers: RequestHandler[]) => {
    const handle = handlers.pop();
    if(!handle)
      throw new Error(`Endpoint ${loc} has no supplied handler!`);
    handlers.push(abstract(handle));
    server[verb](loc, ...handlers)
  }

export const GET = resource("get");
export const POST = resource("post");
export const PUT = resource("put");
export const PATCH = resource("patch");
export const DELETE = resource("delete");
export const USE = server.use.bind(server);