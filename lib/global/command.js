import { Command } from 'commander/esm.mjs';

import PKG from './package.js';


export const CMD = new Command();

CMD.version(PKG.version);

CMD.option('-cd, --config <dirConfig>', 'config DIR');

CMD.option('-l, --log <dirLog>', 'log DIR');
CMD.option('-lga, --log-lang <logLang>', 'log DIR');
CMD.option('-lgn, --log-name <logName>', 'log name');
CMD.option('-lgl, --log-level <logLevel>', 'log level');


CMD.parse(process.argv);


const O = CMD.opts();

O.CMD = CMD;


export default O;
