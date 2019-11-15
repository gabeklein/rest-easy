import request from 'request';
import { printResponse } from './print';

let host: string;

export function declareHost(value: string){
  host = value;
}

export function testHandler(method: string){
  method = method.toUpperCase();

  return function(dir: string, json = {}, headers = {}){
    let qs: any = "";
    dir = dir.replace(/^\/?/, "/");

    if(method == "GET" || method == "DELETE"){
      qs = json;
      json = true;
    }

    if(host)
      request(
        host + dir,
        { method, json, qs, headers },
        printResponse(dir, json)
      )
    else 
      throw new Error(`Cannot invoke "${dir}"`)
  }
}