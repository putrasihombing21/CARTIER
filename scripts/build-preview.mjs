import {build} from 'esbuild';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const files=await readdir('dist/client/assets');
const styles=files.filter(file=>file.endsWith('.css'));
if(!styles.length)throw new Error('Run npm run build before generating the review file.');
let css=(await Promise.all(styles.map(file=>readFile(path.join('dist/client/assets',file),'utf8')))).join('\n');
const mimes={'.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff'};
const dataUrl=async file=>`data:${mimes[path.extname(file)]??'application/octet-stream'};base64,${(await readFile(file)).toString('base64')}`;
for(const match of [...css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)]){
 const url=match[1];if(url.startsWith('data:'))continue;
 const local=url.startsWith('/assets/')?path.join('dist/client',url):path.join('dist/client/assets',url);
 css=css.replaceAll(url,await dataUrl(local));
}
const result=await build({stdin:{contents:"import React from 'react';import {createRoot} from 'react-dom/client';import BrandExperience from './components/brand/brand-experience';createRoot(document.getElementById('root')).render(<BrandExperience offline />);",loader:'tsx',resolveDir:root},bundle:true,write:false,format:'iife',platform:'browser',minify:true,target:'es2022',define:{'process.env.NODE_ENV':'"production"'},tsconfig:'tsconfig.json'});
let script=result.outputFiles[0].text;
for(const file of await readdir('public/assets')){
 const url=`/assets/${file}`;
 if(script.includes(url))script=script.replaceAll(url,await dataUrl(path.join('public/assets',file)));
}
script=script.replace(/<\/script/gi,'<\\/script');
const icon=await dataUrl('public/favicon.svg');
const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>CARTIER — Website Preview</title><link rel="icon" href="${icon}"><style>${css}</style></head><body><div id="root"></div><noscript>Enable JavaScript to explore the CARTIER interactive website preview.</noscript><script>${script}</script></body></html>`;
await mkdir('review',{recursive:true});await writeFile('review/cartier-preview.html',html);
console.log(`Created review/cartier-preview.html (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB). All imagery, fonts and code are embedded. No server or payment connection is required.`);
