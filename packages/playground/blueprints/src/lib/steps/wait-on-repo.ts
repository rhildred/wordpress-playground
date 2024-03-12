import { StepHandler } from '.';

/**
 * @private
 */
export interface WaitOnRepoStep {
	step: 'waitOnRepo';
	repo: string;
}

/**
 * Waits for a repository to be instantiated with opfs
 *
 * @param playground The playground client.
 * @param repo The repository we are waiting for.
 */
export const waitOnRepo: StepHandler<WaitOnRepoStep> = async (
	playground,
	{ repo },
	progress
) => {
	progress?.tracker.setCaption(
		progress?.initialCaption || `Fetching repository ${repo}`
	);
	const sSentinelName = new URL(repo).pathname.replace(/\//g, '_');
	while (true) {
		let res = await playground.request({
			url: `/${sSentinelName}_nodb.txt`,
		});
		if (res.httpStatusCode == 404) {
			return;
		}
		res = await playground.request({ url: `/${sSentinelName}_db.txt` });
		if (res.httpStatusCode == 404) {
			await playground.request({
				url: '/wp-admin/install.php?step=2',
				method: 'POST',
				body: {
					language: 'en',
					prefix: 'wp_',
					weblog_title: 'My WordPress Website',
					user_name: 'admin',
					admin_password: 'password',
					// The installation wizard demands typing the same password twice
					admin_password2: 'password',
					Submit: 'Install WordPress',
					pw_weak: '1',
					admin_email: 'admin@localhost.com',
				},
			});
			return;
		}
	}
};
