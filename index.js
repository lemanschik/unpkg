import { output, channel as input } from './registry/router.js';
output.pipeTo(new WritableStream({write(output){ console.log(output) }}))
