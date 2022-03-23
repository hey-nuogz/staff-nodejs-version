import Hades from '@nuogz/hades';

import { resolve } from 'path';

import { dirApp } from './dir.js';
import PKG from './package.js';
import O from './command.js';
import C from './config.js';


const env = process.env;

const name = O.logName ?? env.HADES_NAME ?? C.log?.name ?? PKG.name;
const dirLog = O.log ?? env.HADES_DIR ?? resolve(dirApp, 'log');
const lang = O.logLang ?? env.HADES_LANG ?? C.log?.lang ?? 'en-us';
const level = O.logLevel ?? env.HADES_LEVEL ?? C.log?.level ?? 'info';
const option = C.log ?? {};


env.OUTPUT_FORMAT = 'hades';
env.OUTPUT_LOCALE = lang.replace(/_/g, '-');







const G = new Hades(name, level, dirLog, option);


export default G;