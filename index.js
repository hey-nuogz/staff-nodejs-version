import './lib/init.js';

import { publicEncrypt } from 'crypto';

import Axios from 'axios';

import C from './lib/global/config.js';
import G from './lib/global/log.js';
import PKG from './lib/global/package.js';


if(!~~C.interval || ~~C.interval < 1000) { throw Error('间隔无效或小于一秒'); }


const hey = async push => {
	try {
		const { data: result } = await Axios.post(`http://${C.target.host}:${C.target.port}/api/hey/push`, {
			from: publicEncrypt(
				C.publicKey.from,
				Buffer.from(JSON.stringify({ who: C.id, app: PKG.name, }))
			).toString('base64'),

			data: publicEncrypt(
				C.publicKey.data,
				Buffer.from(JSON.stringify(push))
			).toString('base64')
		}, { timeout: 1000 * 30 });


		if(result?.success) {
			G.info('主线', '推送~[通知]', `✔ `);
		}
		else {
			throw Error(result?.message);
		}
	}
	catch(error) {
		G.error('主线', '推送~[通知]', `✖ ${error?.message ?? error}`);
	}
};


const run = async () => {

	for(const major of Object.keys(C.version)) {
		const url = `https://nodejs.org/dist/latest-v${major}.x/`;

		const { data: result } = await Axios.get(url, { responseType: 'text' });

		const version = result.match(RegExp(`href="node-v(${major}\\.\\d+\\.\\d+)\\.pkg"`))?.[1];


		if(version && !C.version[major].includes(version)) {
			hey({
				title: `嘿！Node.js 有新版本啦！`,
				body: `v${version}`,
				data: url,
				tag: `${PKG.name} v${major}`
			});



			C.__edit('version', versions => versions[major].unshift(version));



			G.info('士大夫', `~[node.js] v${major}.x`, `✔ 发现新~[版本]~{v${version}}`);
		}
		else {
			G.info('士大夫', `~[node.js] v${major}.x`, `○ 暂未新~[版本]`);
		}
	}
};



run();
setInterval(run, C.interval);
