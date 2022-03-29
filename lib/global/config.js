import { resolve } from 'path';

import Poseidon from '@nuogz/poseidon';

import { dirApp } from './dir.js';
import O from './command.js';


const dirConfig = O.config ?? resolve(dirApp, 'config');


const C = new Poseidon(dirConfig);


export default C;
