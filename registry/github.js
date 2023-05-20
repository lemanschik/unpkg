const hasScope = (name) => name.startsWith('@');

// https://github.com/lemanschik/lemanschik/archive/refs/heads/main.tar.gz
const getTarballUrlByRef
const hasVersion = (name) => name.lastIndexOf('@');
const replaceVersion = (name) => `${hasVersion(name)?name.slice(0,hasVersion(name)):name}`;

const getVersionByTag = async (name,tagName='latest') => (await new Response({ body: 
`${(await (await fetch(`https://r/${name}`)).body.pipeThrough(
new TextDecoderStream()).getReader().read()).value.split(',"versions":{',1)[0]}}`,
}).json())['dist-tags'][tagName];

const getTarballUrlByTag = async ([scope,name=''],tagName)=>`${scope}${name?`/${name}`:''}/-/${
name||scope}-${await getVersionByTag(`${scope}${name?`/${name}`:''}`,tagName)}.tgz`;

const packageName = async (name,tagName='latest') => await getTarballUrlByTag(
replaceVersion(name).split('/'));
