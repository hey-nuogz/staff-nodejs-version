import './lib/init.js';

import Axios from 'axios';

import StaffWock from '@hey/hey-staff-wock';

import PKG from './lib/global/package.js';
import C from './lib/global/config.js';
import G from './lib/global/log.js';


if(!C.version) { C.$.edit('version', () => ({})); }


const staff = async hey => {
	for(const major of C.push.majors) {
		if(!C.version[major]) { C.$.edit('version', versionsAll => (versionsAll[major] = []) && void 0); }


		const url = `https://nodejs.org/dist/latest-v${major}.x/`;

		const { data: result } = await Axios.get(url, { responseType: 'text' });


		const version = result.match(RegExp(`href="node-v(${major}\\.\\d+\\.\\d+)\\.pkg"`))?.[1];


		if(version && !C.version[major].includes(version)) {
			C.$.edit('version', versionsAll => versionsAll[major].unshift(version) && void 0);


			G.info('士大夫', `~[node.js] v${major}.x`, `✔ 发现新~[版本]~{v${version}}`);


			hey({
				title: `Node.js 有新版本啦！`,
				body: `v${version}`,
				data: url,
				tag: `v${major}`
			});
		}
		else {
			G.info('士大夫', `~[node.js] v${major}.x`, `○ 暂未新~[版本]`);
		}
	}
};



const wockStaff = new StaffWock(
	C.target,
	PKG.name, C.auth.id,
	C.auth.who, C.auth.token,
	C.push.interval, staff,
	(...params) => G.info('Wock', '信息', ...params),
	(...params) => G.error('Wock', '错误', ...params),
);


wockStaff.add('auth-successful', () => G.info('~[Hey]通讯', '认证', '✔ '));
wockStaff.add('auth-failed', error => G.error('~[Hey]通讯', '认证', `✖ ${error.message ?? error}`));
wockStaff.add('staff-start', () => G.info('~[Hey]通讯', '开始~[工作]', '✔ '));
wockStaff.add('staff-stop', () => G.info('~[Hey]通讯', '停止~[工作]', '✔ '));

wockStaff.add('set-auth', (id, who, token) => C.$.edit('auth', auth => {
	G.info('~[Hey]通讯', '更新~[认证信息]', '✔ ',
		`~[id]~{${id}}`,
		`~[who]~{${who}}`,
		`~[token]~{${token}}`,
	);

	return { id, who, token };
}));


wockStaff.open();
