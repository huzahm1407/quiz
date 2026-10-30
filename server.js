import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {interpretWithAI} from './assistant.js';
const root=fileURLToPath(new URL('./public',import.meta.url));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json'};
let aiBusy=false;
const server=http.createServer(async(req,res)=>{
const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/assistant'){
  if(req.method==='GET'){send(200,{configured:!!(process.env.QUIZ_AI_API_KEY||process.env.OPENAI_API_KEY)});return;}
  if(req.method!=='POST'){send(405,{error:'Method not allowed'});return;}
  if(req.headers['sec-fetch-site']==='cross-site'||req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){send(403,{error:'Same-origin requests only'});return;}
  if(!req.headers['content-type']?.startsWith('application/json')){send(415,{error:'JSON required'});return;}
  let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>4096){send(413,{error:'Command too long'});return;}}
  let input;try{input=JSON.parse(body);}catch{send(400,{error:'Invalid JSON'});return;}
  if(typeof input.command!=='string'||!input.command.trim()||input.command.length>1000||!['multiple','tenable','quickfire','higher','riddles'].includes(input.mode)){send(400,{error:'Invalid command'});return;}
  if(aiBusy){send(429,{error:'Please wait for the previous AI command.'});return;}
  aiBusy=true;try{send(200,{action:await interpretWithAI(input.command,input.mode)});}catch(err){send(err.status||502,{error:err.status?err.message:'AI request timed out or could not connect. Use the built-in commands.'});}finally{aiBusy=false;}return;
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const pathname=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);
}catch{if(!res.headersSent){res.writeHead(404);res.end('Not found');}}
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Quiz Command running on port '+(process.env.PORT||3000)));
