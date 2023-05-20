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

export const output = (!globalThis.window) ? new ReadableStream({start(){}}) : (ComponentManager={}) => 
Object.assign(ComponentManager,{ async boot(c) {
  // Boot
  if ("serviceWorker" in navigator) {

  } else {
    // The current browser doesn't support service workers.
    // Perhaps it is too old or we are not in a Secure Context.
  }
  
  // For NodeJS Backward Compatability AwesomeOS has no concept of a Process!.
  ComponentManager.process = `ÀwesomeOS`;
  ComponentManager.version = await GitHash;
  ComponentManager.fs = {};
  ComponentManager.net = {};
  ComponentManager.serviceWorker = globalThis.window.navigator.serviceWorker;
  ComponentManager.protocol = new TransformStream({transform: 
  (controller,func) => controller.enqueue(new Function(func)(ComponentManager))});
  ComponentManager.peer = new RTCPeerConnection();
  ComponentManager.channel = channel;
  
  await ComponentManager.serviceWorker.register(import.meta.url,
  { type: 'module', updateViaCache: 'all', scope}).then((reg) => {
    // serviceWorker.state 
    document.querySelector("#service-worker") && (document.querySelector("#service-worker").textContent = `${['installing','active','waiting'].find(
    status=>reg[status])} and is controller: ${serviceWorker.active === serviceWorker.controller}`);
    
    serviceWorker.addEventListener("statechange", (e) => {
      // logState(e.target.state);
    });
  
    reg.update() 
  },(error) => {
  // Something went wrong during registration. The service-worker.js file
  // might be unavailable or contain a syntax error.
  });
  
  console.log("Status:", ComponentManager.serviceWorker.installing, ComponentManager.serviceWorker.controller)
  
  if (ComponentManager.serviceWorker.controller && ComponentManager.serviceWorker.installing) {
    console.log('New content is available; please refresh.');
    window.history.pushState = function () {
      window.history.pushState.apply(window.history, arguments);
      ComponentManager.serviceWorker.installing?.postMessage({ method: "skipWaiting", params: [] });
    };
  };
  c.enqueue(ComponentManager);
  // Upgrades of the System on next Reboot if needed
  // Can Reboot in Background and Switch over with Zero Downtime.

}}) && new ReadableStream({
  start: (c) => ComponentManager.boot(c),
}).pipeThrough(new TransformStream({ 
    // FIFO Main System.
    transform: (ComponentManager,c)=>{
      console.log(ComponentManager);
      ComponentManager.serviceWorker.onmessage = (msg) => c.enqueue(msg);
      ComponentManager.serviceWorker.startMessages(); // Does Inital Deployment for Offline Scenarios also handels Programatical
      // here your code runs this.startUI() for example
      channel.onmessage = (msg)=>c.enqueue(msg);
      c.enqueue(`System Booted ${ComponentManager.process}`)
    },
    startUI: () => {},
}));
  //.pipeTo(new WritableStream({write(data){console.log(data)}});

if (!globalThis.window) {
const serviceWorker = globalThis;
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
    channel.postMessage({ method: "window.refresh", params: [] })
  },
}; 

serviceWorker.oninstall = (event) => event.waitUntil(methods.skipWaiting())
serviceWorker.onactivate = (event) => event.waitUntil(methods["clients.claim"]())
serviceWorker.onmessage = ({data: { id, method, params = [] }}) => {
  methods[method](...params); // skipWaiting clients.claim()
};

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


 caches.open(scope).then(async cache => 
(await cache.match(new Request(`${scope}/index.html`)) || 
 await cache.match(new Request(`${scope}/`))) || [
   await cache.put(new Request(`${scope}/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
   await cache.put(new Request(scope),new Response({ body: new Blob([document], { type: 'text/html' }) }))
]);

serviceWorker.onfetch = async (event) => {
	console.log('fetch', event.request.url)
	return event.waitUntil(
		await caches.match(event.request.url) || 
		await caches.match(event.request.url,{ignoreSearch:true}) || fetch(event.request.url).then(
  			r => `${r.status}`.startsWith('2') ? r : new Response({ 
			status: 404, body: new Blob([`Request: ${event.request.url} Not Found.`], { type: 'text/html' 
		}) }) ));
}
/** The Fundamental Concepts */
/**
 * You get a Boot Stream that emits a HigerOrder ComponentManager which can pass down Capabilitys.
 * This is called Capability based Permissions you can find a lot of information on the www
 * After Boot and Init you write to the Final Output Eg Headless, Or Logging, Or UI Or something else.
 * On servers your write target is mostly the logging infra local or remote
 * On Consumer UI Instances its most time the UI it self which has configuration to additional log as needed.
 * On Development Instances you probally did forward the Streams into your IDE Some how or your IDE Even Runs with
 * Escalated Permissions Inside the Main Component Manager for Faster iteration and debugging.
 */
// "compilerOptions": {
//     "target": "esnext",
//     "moduleResolution": "bundler",
//     "customConditions": ["import"],
//     "verbatimModuleSyntax": true,
//     "composite": true,
    
// }

// tsc --build -p ./my-project-dir 
// --declaration
// --emitDeclarationOnly
// --declarationMap
// --sourceMap
// --inlineSourceMap

}
