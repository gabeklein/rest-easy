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
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function GET <T={}, O=any> (loc: string, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: Handle<T, O>): void
export function GET <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: Handle<T, O>): void

/**
 * Register a POST request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function POST <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function POST <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void

/**
 * Register a PUT request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function PUT <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function PUT <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void

/**
 * Register a PATCH request with your exported App.
 * 
 * @param loc - Resource url
 * @param m - Middleware (any Express RequestHandler)
 * @param fn - Handler
 */
export function PATCH <T={}, O=any> (loc: string, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, fn: HandleBody<T, O>): void
export function PATCH <T={}, O=any> (loc: string, m1: RequestHandler, m2: RequestHandler, m3: RequestHandler, fn: HandleBody<T, O>): void

/**
 * Register a DELETE request with your exported App.
 * 
 * @param loc - Resource url
 * @param fn - Request Handlers
 */
export function DELETE (loc: string, ...fn: RequestHandler[]): void;

export const USE: ApplicationRequestHandler<Express>; 

export { API, API as server, API as default }
export { json, urlencoded } from "express";
export * from "./helpers"