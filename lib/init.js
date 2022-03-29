import './global/dir.js';
import PKG from './global/package.js';
import './global/command.js';
import './global/config.js';
import G from './global/log.js';


process.title = PKG.name;
process.on('unhandledRejection', (error, promise) => { G.fatal('进程', '未处理的拒绝', error); });
