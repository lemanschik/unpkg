// This implements a sharedSync Context that can be used with async methods 
const location = globalThis.location || globalThis?.window.location;
location && (location.protocol !== 'https:' 
|| !location.protocol.indexOf('extension')) && 
(location.protocol = 'https:');
const browser = (globalThis.chrome || globalThis.browser);
const scope = new URL('./',import.meta.url);
const name = `ÀwesomeOS`;


// Runs first on initital cold Boot but after ComponentManager.serviceWorker on warm boot.
// input
export const channel = new BroadcastChannel(`components:${scope}`);

export const concatArrayBuffer = (buffers) => Uint8Array.from(buffers.flatMap((buffer)=>[...new Uint8Array(buffer)]));
export const GitBlobHash = (url) => fetch(url).then((r) => r.arrayBuffer()).then(
async (arrayBuffer) => crypto.subtle.digest("SHA-1", concatArrayBuffer([new TextEncoder().encode(
//`blob ${'Hello, World!\n'.length}\0${'Hello, World!\n'}`
`blob ${arrayBuffer.size}\0`
),arrayBuffer]) ))
.then((arrayBuffer) => Array.from(new Uint8Array(arrayBuffer),(byte) => byte.toString(16).padStart(2, '0')).join(''))

// Interisting observation a Promise does not cache its last result when it gets reused its like using a function.
let GitHash = GitBlobHash(import.meta.url).then((hash)=>(GitHash = Promise.resolve(hash)));

// use this to inject a ECMAScript Proxy for watch. 
const getComponentManager = (watch) => 
Object.assign(ComponentManager,{ async boot(c) {
  c.enqueue(watch && watch(ComponentManager) || ComponentManager);
  // Upgrades of the System on next Reboot if needed
  // Can Reboot in Background and Switch over with Zero Downtime.
}}) && new ReadableStream({
  start: (c) => ComponentManager.boot(c),
});

export const SystemComponents = new TransformStream({ 
    // FIFO Main System.
    transform: (ComponentManager,c)=>{
      // For NodeJS Backward Compatability AwesomeOS has no concept of a Process!.
      ComponentManager.process = { type: 'module', credentials: 'same-origin', name };
      ComponentManager.version = await GitHash;
      ComponentManager.fs = navigator.storage;
      ComponentManager.net = { 
        local: new RTCPeerConnection(),
        tcp: nagvigator.TCPSocket,
        udp: nagvigator.UDPSocket,
      };
      ComponentManager.serviceWorker = globalThis.navigator.serviceWorker;
      // The componentManager Message Protocol Indicator is the following:
      // globalThis === window and ComponentManager is the first fatArrowFunction Parameter
      // you should return a Promise that uses a timeout to not block the system.
      ComponentManager.protocol = new TransformStream({ async transform(functionBody,controller) {
      try {
        controller.enqueue( 
        functionBody.startsWith('(ComponentManager')
        ? await new Function(`return ${functionBody}`)(ComponentManager) 
        : functionBody 
        );
      } catch (err) {
        c.enqueue({ stderr: `${err} ${err.message||''} ${err.stack||''}` })  
      }
      }});
      
      ComponentManager.channel = channel;
      ComponentManager.sharedWorker = new SharedWorker(import.meta.url, ComponentManager.process);

      console.log("Status:", `${ComponentManager.process} instantion done.`)
      console.log({ ComponentManager });
      
      // Does Inital Deployment for Offline Scenarios also handels Programatical
      // here your code runs this.startUI() for example
      // if it does not do so it will simple return the system output.
      // Audio and Video Processing also goes in here. 
      new ReadableStream({ start(output){
        const onmessage = ({ data }) => output.enqueue(data);
        ComponentManager.serviceWorker.onmessage = onmessage;
        ComponentManager.serviceWorker.startMessages(); 
        ComponentManager.sharedWorker.onmessage = onmessage;
        channel.onmessage = onmessage;  
      }}).pipeThrough(ComponentManager.protocol).pipeTo(
        new WritableStream({write(output){channel.postMessage(output); c.enqueue(output)}})
      );
      // MOTD
      c.enqueue({ stdout: `System Booted ${ComponentManager.process.name}` })
    },
    startUI() => {},
});

export const awesomeBuildInModules = [SystemComponents];

export const output = (!globalThis.window) 
? new ReadableStream({start(output){ channel.onmessage = msg => output.enqueue(msg); }}) 
: awesomeBuildInModules.reduce((stream,module,_id) =>
(stream = stream.pipeThrough(module)),
getComponentManager());
  //.pipeTo(new WritableStream({write(data){console.log(data)}});

if (!globalThis.window && globalThis.name === name) {
  const serviceWorker = new BroadcastChannel(`service-worker:${scope}`);
  // Handels messaging between contexts and components. Is the globalSource of turth.
  // for the given origin and scope inside of an instance or browser session.
  const sharedWorker = globalThis;
} else if (!globalThis.window && globalThis.name !== name) {
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

caches.open(scope).then(async cache => 
(await cache.match(new Request(`${scope}/index.html`)) || 
 await cache.match(new Request(`${scope}/`))) || [
   await cache.put(new Request(`${scope}/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
   await cache.put(new Request(scope),new Response({ body: new Blob([document], { type: 'text/html' }) }))
]);

serviceWorker.onfetch = async (event) => {
	serviceWorker.postMessage({ data: 'fetch', event.request.url) });
	return await caches.match(event.request.url) || 
		await caches.match(event.request.url,{ignoreSearch:true}) || fetch(event.request.url).then(
  			r => `${r.status}`.startsWith('2') ? r : new Response({ 
			status: 404, body: new Blob([`Request: ${event.request.url} Not Found.`], { type: 'text/html' 
		}) }) );
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
