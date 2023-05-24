globalThis?.window && globalThis?.window.location.protocol !== 'https:' && (globalThis.window.location.protocol = 'https:');
export const serviceWorker = globalThis.window ? globalThis.window.navigator.serviceWorker : globalThis;
const scope = new URL('./',import.meta.url);
// input
export const channel = new BroadcastChannel(`service-worker:${scope}`);
export const concatArrayBuffer = (buffers) => Uint8Array.from(buffers.flatMap((buffer)=>[...new Uint8Array(buffer)]));
export const GitBlobHash = (url) => fetch(url).then((r) => r.arrayBuffer()).then(
async (arrayBuffer) => crypto.subtle.digest("SHA-1", concatArrayBuffer([new TextEncoder().encode(
//`blob ${'Hello, World!\n'.length}\0${'Hello, World!\n'}`
`blob ${arrayBuffer.size}\0`
),arrayBuffer]) ))
.then((arrayBuffer) => Array.from(new Uint8Array(arrayBuffer),(byte) => byte.toString(16).padStart(2, '0')).join(''))

// Interisting observation a Promise does not cache its last result when it gets reused its like using a function.
let GitHash = GitBlobHash(import.meta.url).then((hash)=>(GitHash = Promise.resolve(hash)));

export const output = new ReadableStream({start(c){ channel.onmessage = (msg) => c.enqueue(msg )}})
 
// BootScreen Graphical
const document = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙‍♂️</text></svg>">
<title>Offline</title>
<style>
html, body, div {
width:  100%;
height:  100%;
margin:  0;
padding:  0;
}
body {
font-family: sans-serif;
color: white;
font-size: 100px;
}
body * {
position: relative;
}
#one {
background: rgb(2,0,36);
background: radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(25,25,205,1) 50%, rgba(0,212,255,1) 100%);
display: flex;
justify-content: center;
align-items: center;
}
</style>
</head>
<body>
<div id="one">
	<span>Offline</span>
</div>

</body></html>`;

//caches.open(scope).then(async cache => 
//(await cache.match(new Request(`${scope}/index.html`)) || 
//await cache.match(new Request(`${scope}/`))) || [
//await cache.put(new Request(`${scope}/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
//await cache.put(new Request(scope),new Response({ body: new Blob([document], { type: 'text/html' }) }))
//]);

	
GitHash.then(hash=>console.log("instantiation:",hash)||channel.postMessage({ "instantiating": hash }))
  //console.log("instantiating:", await GitHash);

const methods = { 
  async skipWaiting(){
    console.log("installing:",await GitHash);
    channel.postMessage({ "installing:": await GitHash })
    serviceWorker.skipWaiting();
  }, 
  "clients.claim": async () => {    
    console.log("activating:",await GitHash);
    channel.postMessage({ "activating:": await GitHash })
    serviceWorker.clients.claim();
    const allClients = await serviceWorker.clients.matchAll({
      includeUncontrolled: true,
    });

    const connectedClient = allClients.find(async (cl)=>new URL(cl.url).searchParams.has(await GitHash));
    // connectedClient?.focus();

    // If we didn't find an existing chat window, // open a new one:
    if (!connectedClient) {
      //connectedClient = //await clients.openWindow(scope+'?'+"version="+await versionHexString);
    }
    serviceWorker.postMessage({ data: "(ComponentManager) => window.refresh()", params: [] })
  },
}; 

serviceWorker.oninstall = (event) => event.waitUntil(methods.skipWaiting())
serviceWorker.onactivate = (event) => event.waitUntil(methods["clients.claim"]())

serviceWorker.onmessage = ({data: { id, method, params = [] }}) => {
// Note: we could also use channel it would produce the same result
serviceWorker.postMessage({ id, data: `(ComponentManager) => ({ id: ${id}, data: ${methods[method](...params)}, });` }); 
// skipWaiting clients.claim()
};

serviceWorker.onfetch = async (event) => {
serviceWorker.postMessage({ data: 'fetch', event.request.url) });
return await caches.match(event.request.url) || 
await caches.match(event.request.url,{ignoreSearch:true}) || fetch(event.request.url).then(
r => `${r.status}`.startsWith('2') ? r : new Response({ 
status: 404, body: new Blob([`Request: ${event.request.url} Not Found.`], { type: 'text/html' 
}) }) );
