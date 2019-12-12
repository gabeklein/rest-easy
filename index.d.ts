import express, { RequestHandler as Handler, Express, Request, Response } from 'express';
import { ApplicationRequestHandler } from 'express-serve-static-core';

interface QueryRequest<T> extends Request {
  query: T
}

interface BodiedRequest<B, Q = any> extends Request {
  body: B
  query: Q
}

type Middleware = Handler[];

type HandleQuery<I, O = unknown> =   (req: QueryRequest<I>,     res: Response) => O | Promise<O>;
type HandleBody<B, Q, O = unknown> = (req: BodiedRequest<B, Q>, res: Response) => O | Promise<O>;

type HandleSpecial<I, O = void> = (input: I, req: Request, res: Response) => O | Promise<O>;

type ResultGetter<T> = (result: T, request: Request, response: Response) => any;

interface DefaultApp {
  declared: string[];
}

interface SpecialRegister<H, O> {
  <T>(dir: string, fn: H): void;
  <T>(dir: string): (fn: H) => void
}

interface DefinitionHandler<H> {
  (fn: H): void;
  (m1: Handler, fn: H): void
  (m1: Handler, m2: Handler, fn: H): void
  (m1: Handler, m2: Handler, m3: Handler, fn: H): void
}

interface VERB {
  test(dir: string, query?: {}, headers?: {}): void;
}

interface CUSTOM_QUERY<I = any, O = any> {
  <T = I>(dir: string, handle: HandleQuery<T, O>): void
  <T = I>(dir: string): (handle: HandleQuery<T, O>) => void
}

interface CUSTOM_BODY<I = any, O = any> {
  <T = I>(dir: string, handle: HandleBody<T, O>): void
  <T = I>(dir: string): (handle: HandleBody<T, O>) => void
}

interface TYPED_QUERY<T2 = any> extends VERB {
  <T, O = unknown>(loc: string): DefinitionHandler<HandleQuery<T, O>>;
  <T, O = unknown>(loc: string, fn: HandleQuery<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, fn: HandleQuery<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, m2: Handler, fn: HandleQuery<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, m2: Handler, m3: Handler, fn: HandleQuery<T, O>): void

  extend<T>(middleware: Handler[]): CUSTOM_QUERY<T>;
}

interface TYPED_BODY<T2 = any> extends VERB {
  <T, O = unknown>(loc: string): DefinitionHandler<HandleBody<T, O>>;
  <T, O = unknown>(loc: string, fn: HandleBody<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, fn: HandleBody<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, m2: Handler, fn: HandleBody<T, O>): void
  <T, O = unknown>(loc: string, m1: Handler, m2: Handler, m3: Handler, fn: HandleBody<T, O>): void

  extend<T>(middleware: Handler[]): CUSTOM_BODY<T>;
}

/**
 * Declare a master route prefix for this module, or until another namespace is called.
 * 
 * @param prefix - Route which should prepend all other verb definitions in file.
 */
export function NAMESPACE(prefix: string): void;

declare const API: Express & DefaultApp;

/** Register a GET request with your App. */
declare const GET: TYPED_QUERY;
/** Register a POST request with your App. */
declare const POST: TYPED_BODY;
/** Register a PUT request with your App. */
declare const PUT: TYPED_BODY;
/** Register a PATCH request with your exported App. */
declare const PATCH: TYPED_BODY;
/** Register a DELETE request with your exported App. */
declare const DELETE: TYPED_QUERY;

/**
 * Declare a route prefix for all handlers declared within wrapper. 
 * 
 * @param route - Prefix you wish to apply to all handlers within wrapper.
 * @param wrapper - Declare subroutes here, wrapper is run immediately.
 */
export function ROUTE(route: string, wrapper: () => void): void;

export const USE: ApplicationRequestHandler<Express>; 

export { GET, POST, PUT, PATCH, DELETE }
export { API, API as server, API as default }
export { ROUTE as NEST }
export { json, urlencoded } from "express";
export * from "./helpers"