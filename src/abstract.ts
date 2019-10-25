import { RequestHandler } from 'express';

import { Internal, RestError } from './errors';

const SerializeError = Internal("Resource returned data which could not be serialized", "serialize_error")

export function abstract(handler: RequestHandler): RequestHandler {
  return async (request, response, next) => {
    try {
      const exec = handler(request as any, response, next) as any;
      let output = exec instanceof Promise ? await exec : exec;

      try { 
        respond(200, output);
      }
      catch(err){
        throw SerializeError;
      }
    }
    catch(err){
      if(typeof err == "function")
        err = err();

      if(err instanceof RestError)
        respond(500, {
          statusCode: err.statusCode,
          error: err.shortCode,
          message: err.message
        });

      else {
        console.error(err);
        respond(500, {});
      }
    }

    function respond(status: number, content: any){
      if(response.headersSent)
        return

      if(content === undefined)
        content = { ok: true };
      else if(typeof content !== "object")
        content = { response: content };
      
      content.statusCode = status;
      response.status(status).json(content)
    }
  }
}

export const handle404: RequestHandler = 
  (q, r) => r.status(404).json({
    message: `Cannot ${q.method} ${q.url}`
  })
