import { output, channel as input } from './registry/router.js';
output().pipeTo(new WritableStream({write(output){ console.log(output) }}))

caches.open(scope).then(cache => 
(cache.match(new Request(`registry/index.html`)) || 
 cache.match(new Request(`registry/`))) || [
   cache.put(new Request(`registry/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
   cache.put(new Request(`registry/`),new Response({ body: new Blob([document], { type: 'text/html' }) }))
]).catch(console.error);
