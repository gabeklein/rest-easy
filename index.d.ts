import express, { RequestHandler, Express } from 'express';
import { ApplicationRequestHandler } from 'express-serve-static-core';

interface Request<T> 
  extends express.Request {
  query: T
}

interface RequestWithBody<T> 
  extends express.Request {
  body: T
}

type Handle<I, O = void> = (
  req: Request<I>,
  res: express.Response
) => O | Promise<O>;

type HandleBody<I, O = void> = (
  req: RequestWithBody<I>,
  res: express.Response
) => O | Promise<O>;

type HandleSpecial<I, O = void> = (
  input: I,
  req: express.Request,
  res: express.Response
 ) => O | Promise<O>;

interface SpecialRegister<H, O> {
  <T>(dir: string, fn: H): void;
  <T>(dir: string): (fn: H) => void
}

interface RestEasyApp {
  declared: string[];
}

declare const API: Express & RestEasyApp;

interface DefinitionHandler<T, O> {
  (fn: Handle<T, O>): void;
  (m1: RequestHandler, fn: Handle<T, O>): void
  (m1: RequestHandler, m2: RequestHandler, fn: Handle<T, O>): void
  (m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: Handle<T, O>): void
}

interface DefinitionBodyHandler<T, O> {
  (fn: HandleBody<T, O>): void;
  (m1: RequestHandler, fn: HandleBody<T, O>): void
  (m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
  (m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void
}

/**
 * Register a GET request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function GET <T={}, O=any> (loc: string): DefinitionHandler<T, O>;
export function GET <T={}, O=any> (loc: string, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: Handle<T, O>): void
export namespace GET {
  function test(dir: string, query?: {}, headers?: {}): void;

  function extend(
    middleware: RequestHandler[]
  ): <T>(dir: string, handler: Handle<T>) => void;

  function extend<O = any, I = any>(
    middleware: RequestHandler[], 
    wrap?: (
      result: O,
      request: express.Request, 
      response: express.Response
    ) => any
  ): <T = I>(dir: string) => (handle: Handle<T, O>) => void;
}

/**
 * Register a POST request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function POST <T={}, O=any> (loc: string): DefinitionBodyHandler<T, O>;
export function POST <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void
export namespace POST {
  function test(dir: string, body?: {}, headers?: {}): void;

  function extend(
    middleware: RequestHandler[]
  ): <T>(dir: string, handler: HandleBody<T>) => void;

  function extend<O = any, I = any>(
    middleware: RequestHandler[], 
    wrap?: (
      result: O,
      request: express.Request, 
      response: express.Response
    ) => any
  ): <T = I>(dir: string) => (handle: HandleBody<T, O>) => void;
}

/**
 * Register a PUT request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function PUT <T={}, O=any> (loc: string): DefinitionBodyHandler<T, O>;
export function PUT <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void
export namespace PUT {
  function test(dir: string, body?: {}, headers?: {}): void;
}

/**
 * Register a PATCH request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function PATCH <T={}, O=any> (loc: string): DefinitionBodyHandler<T, O>;
export function PATCH <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void
export namespace PATCH {
  function test(dir: string, body?: {}, headers?: {}): void;
}

/**
 * Register a DELETE request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Request Handlers
 */
export function DELETE (loc: string): DefinitionHandler<any, any>;
export function DELETE (loc: string, ...fn: RequestHandler[]): void;
export namespace DELETE {
  function test(dir: string, body?: {}, headers?: {}): void;
}

/**
 * Declare a master route prefix for this module, or until another namespace is called.
 * 
 * @param prefix - Route which should prepend all other verb definitions in file.
 */
export function NAMESPACE(prefix: string): void;

/**
 * Declare a route prefix for all handlers declared within wrapper. 
 * 
 * @param route - Prefix you wish to apply to all handlers within wrapper.
 * @param wrapper - Declare subroutes here, wrapper is run immediately.
 */
export function ROUTE(route: string, wrapper: () => void): void;
export const USE: ApplicationRequestHandler<Express>; 

export { API, API as server, API as default }
export { ROUTE as NEST }
export { json, urlencoded } from "express";
export * from "./helpers"