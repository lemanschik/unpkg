import { output, channel as input } from './registry/router.js';
output().pipeTo(new WritableStream({write(output){ console.log(output) }}))
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

caches.open(new URL('./registry/',import.meta.url)).then(cache => 
(cache.match(new Request(`registry/index.html`)) || 
 cache.match(new Request(`registry/`))) || [
   cache.put(new Request(`registry/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
   cache.put(new Request(`registry/`),new Response({ body: new Blob([document], { type: 'text/html' }) }))
]).catch(console.error);
