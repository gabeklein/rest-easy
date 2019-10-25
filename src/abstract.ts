import { RequestHandler } from 'express';

import { Internal, RestError } from './errors';

const SerializeError = Internal("Resource returned data which could not be serialized")

export function abstract(handler: RequestHandler): RequestHandler {
  return async (request, response, next) => {
    try {
      const exec = handler(request as any, response, next) as any;
      let output = exec instanceof Promise
        ? await exec : exec;

      if(output && typeof output !== "string")
        try {
          response.send(
            JSON.stringify(output)
          )
        }
        catch(err){
          throw SerializeError;
        }

      else {
        const expectsJSON = 
          request.headers["content-type"] === "application/json"

        response.send(
          expectsJSON
            ? { response: output || "ok" }
            : output || ""
        )
      }
    }
    catch(err){
      if(typeof err == "function")
        err = err();

      if(err instanceof RestError)
        response.status(err.statusCode).json({
          code: err.statusCode,
          error: err.shortCode,
          message: err.message
        });

      else {
        console.error(err);
        response.status(500).send({
          ok: false
        });
      }
    }
  }
}