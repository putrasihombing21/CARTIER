import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('.preview-build',{recursive:true});
await build({entryPoints:['tests/commerce.test.ts'],outfile:'.preview-build/commerce.test.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
const result=spawnSync(process.execPath,['--test','.preview-build/commerce.test.mjs'],{stdio:'inherit'});
process.exitCode=result.status??1;
