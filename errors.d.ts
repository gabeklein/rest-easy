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