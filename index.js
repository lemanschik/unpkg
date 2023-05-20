import { output, channel as input } from './registry/router.js';
output.pipeTo(new WriteableStream({write(output){ console.log(output) }}))
