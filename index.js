import { output, channel as input } from './registry/router.js';
output().pipeTo(new WritableStream({write(output){ console.log(output) }}))

caches.open(scope).then(cache => 
(cache.match(new Request(`${scope}/index.html`)) || 
 cache.match(new Request(`${scope}/`))) || [
   cache.put(new Request(`${scope}/index.html`),new Response({ body: new Blob([document], { type: 'text/html' }) })),
   cache.put(new Request(scope),new Response({ body: new Blob([document], { type: 'text/html' }) }))
]).catch(console.error);
