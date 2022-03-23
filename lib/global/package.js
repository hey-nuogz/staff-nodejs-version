import { readJSONSync } from '../fs-extra.js';


const PKG = readJSONSync('package.json', 'utf8');


export default PKG;