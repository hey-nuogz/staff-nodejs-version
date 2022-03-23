import './lib/init.js';

import { publicEncrypt } from 'crypto';

import Axios from 'axios';

import C from './lib/global/config.js';
import G from './lib/global/log.js';
import PKG from './lib/global/package.js';


if(!~~C.interval || ~~C.interval < 1000) { throw Error('间隔无效或小于一秒'); }


const tell = async push => {
	try {
		const { data: result } = await Axios.post(`http://${C.target.host}:${C.target.port}/api/tell/push`, {
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
	const versionsNew = [];

	for(const major of Object.keys(C.version)) {
		const url = `https://nodejs.org/dist/latest-v${major}.x/`;

		const { data: result } = await Axios.get(url, { responseType: 'text' });

		const version = result.match(RegExp(`href="node-v(${major}\\.\\d+\\.\\d+)\\.pkg"`))?.[1];


		if(version && !C.version[major].includes(version)) {
			versionsNew.unshift(version);

			tell({
				title: `Node.js 出新版本啦！`,
				body: `v${version}`,
				data: url,
				tag: `${PKG.name} v${major}`
			});

			C.__edit('version', versions => versions[major].unshift(version));

			G.info('主线', '监视Node.js版本', `✔ 发现新~[版本]~{v${version}}`);
		}
	}

	if(versionsNew.length) {
		G.info('主线', '监视Node.js版本', `✔ 发现新~[版本]`, versionsNew.map(version => `~{v${version}}`));
	}
	else {
		G.info('主线', '监视Node.js版本', `○ 暂未新~[版本]`);
	}
};



run();
setInterval(run, C.interval);
