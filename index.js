import { output, channel: input } from './registry/router.js';
output.pipeTo(new WriteableStream({write(output){ console.log(output) }}))
