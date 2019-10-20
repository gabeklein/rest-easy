import { RequestHandler } from "express";

declare interface RestError {
  code: number;
  message: string;
  error?: string;
}

/** Throw this to send `404 (Not Found)` with `message` to client. */
export function Forbid(message?: string, error?: string): RestError;

/** Throw this to send `404 (Not Found)` with `message` to client. */
export function NotFound(message?: string, error?: string): RestError;

/** Throw this to send `500 (Interal Server Error)` with `message` to client. */
export function Internal(message?: string, error?: string): RestError;

/** Throw this to send `400 (Bad Input)` with `message` to client. */
export function BadInput(message?: string, error?: string): RestError;

/** Throw this to send any http status with `message` to client. */
export function Code(status: number, message?: string, error?: string): RestError;

/**
 * Add headers to enable CORS for any (or specified) origin.
 * 
 * @param allow - Allowed origin, default `*`. 
 * 
 * `e.g. "https://mywebsite.com"`
 */
export function origin(allow?: string): RequestHandler;

/**
 * Expect Authorization header, if not present bail and return `401`.
 * 
 * @param expect - Expected Authorization value.
 * 
 * `e.g. "basic SECRET"`
 */
export function authorize(expect: string): RequestHandler;
