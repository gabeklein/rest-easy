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
        respond(err.statusCode, {
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

      response.status(status)
      
      if(!content)
        return

      if(typeof content == "object"
      && content.toString !== Object.prototype.toString
      && content.toString !== Array.prototype.toString)
        content = content.toString();
        
      else if(typeof content !== "object"){
        content = { response: content };
      }
      
      response.send(content)
    }
  }
}

export const handle404: RequestHandler = 
  (q, r) => r.status(404).json({
    message: `Cannot ${q.method} ${q.url}`
  })
