/* Importação das imagens originais fornecidas pelo cliente para o deploy.
 * O download é executado no build: a página usa arquivos locais estáticos,
 * nunca links do Canva que expiram. */
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {join} from 'node:path'
const out = join(process.cwd(),'public','img')
await mkdir(out,{recursive:true})
const files=[
 {path:'rogerio-retrato.jpg',source:"https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2F6e46aaa0-78ec-496a-be1e-b49659f4cb90/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAEBGG3ydHZgLBXo9tKdNcmnzuDgVf_HVek7VOUTP3HkE&exp=1793325728&osig=AAAAAAAAAAAAAAAAAAAAADI3oHbhvat1FB8HHz1fh_mBlm9ub6RPo3j7A0-iFStV&signer=media-rpc&token=AAIAAU0AJDZlNDZhYWEwLTc4ZWMtNDk2YS1iZTFlLWI0OTY1OWY0Y2I5MAAAAAABoYqLAQBdctkM0S4N47GLbR5YsMC2NABueCCHhnewGuEmFq1E2Q&x-canva-quality=thumbnail"},
 {path:'rogerio-logo.png',source:"https://media.canva.com/v2/image-resize/format:PNG/height:134/quality:100/uri:ifs%3A%2F%2FM%2F07fcff57-4417-4d07-86d0-3ba84555505b/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAHXOm89bFfrXPqEeXWfyqxTe2oAUtkJuos9DrDVZJk8U&exp=1793323116&osig=AAAAAAAAAAAAAAAAAAAAAF8PbyH9TO9hRfKE8Nz_6yrapB12ImY4S-Zf16WMTTfo&signer=media-rpc&token=AAIAAU0AJDA3ZmNmZjU3LTQ0MTctNGQwNy04NmQwLTNiYTg0NTU1NTA1YgAAAAABoYpjJeAU2P4b1uDRGOxhDeGXS7XZXRfRs5IK11-qi-HYu34xeQ&x-canva-quality=thumbnail"},
]
async function getImage(url){
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000)
 try {
  const response=await fetch(url,{signal:controller.signal})
  if(!response.ok||!(response.headers.get('content-type')||'').startsWith('image/')) throw new Error('Imagem indisponível: '+response.status)
  const buf=Buffer.from(await response.arrayBuffer())
  if(buf.length<1000)throw new Error('Arquivo incompleto')
  return buf
 } finally {clearTimeout(timeout)}
}
for(const file of files){
 const dest=join(out,file.path)
 try{const existing=await readFile(dest);if(existing.length>1000){console.log('Imagem existente:',file.path);continue}}catch{}
 let bytes
 try {bytes=await getImage(file.source)}catch(err){
   console.warn('Fonte temporária indisponível para '+file.path+', tentando imagem publicada.')
   bytes=await getImage('https://rogeriodeopersonal.vercel.app/img/'+file.path)
 }
 await writeFile(dest,bytes)
 console.log('Imagem incorporada ao build:',file.path,bytes.length,'bytes')
}
