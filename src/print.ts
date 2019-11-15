import { RequestCallback } from "request";
import prettyjson from "prettyjson";

export function print(object: {}){
  console.log(
    prettyjson
      .render(object)
      .replace(/\n/g, "\n  ")
      .concat("\n")
  )
}

export function printResponse(
  endpoint: string, 
  query: any
): RequestCallback {

  return (err, response, body) => {
    if(err){
      console.error(err);
      return
    }

    const { statusCode, statusMessage } = response;

    if(typeof body === "object")
      body = prettyjson.render(body).replace(/\n/g, "\n  ");
  
    if(statusCode >= 300){
      if(/\n/.test(body))
        body = `\n  ${body}`
      console.error(`\n${statusCode}: ${body || statusMessage}`);
    }
    else 
      console.log(
        `\nREQUEST: "${endpoint}"\n `,
        query && prettyjson.render(query).replace(/\n/g, "\n  ").concat("\n"),
        `\nRESPONSE: ${statusCode}\n `,
        body
      );
  }
}