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

declare const API: Express;

/**
 * Register a GET request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Handler body
 */
export function GET<T extends Object = any, O = any>
  (loc: string, fn: Handle<T, O>): void;

/**
 * Register a POST request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Handler body
 */
export function POST<T extends Object = any, O = any>
  (loc: string, fn: HandleBody<T, O>): void;

/**
 * Register a PUT request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Handler body
 */
export function PUT<T extends Object = any, O = any>
  (loc: string, fn: HandleBody<T, O>): void;

/**
 * Register a PATCH request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Handler body
 */
export function PATCH<T extends Object = any, O = any>
  (loc: string, fn: HandleBody<T, O>): void;

/**
 * Register a DELETE request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Handler body
 */
export function DELETE<T extends Object = any, O = any>
  (loc: string, fn: Handle<T, O>): void;

export const USE: ApplicationRequestHandler<Express>; 

export { API, API as server, API as default }
export * from "./helpers"