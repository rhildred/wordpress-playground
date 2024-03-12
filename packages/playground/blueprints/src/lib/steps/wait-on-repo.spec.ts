import { NodePHP } from '@php-wasm/node';
import {
	RecommendedPHPVersion,
	getWordPressModule,
} from '@wp-playground/wordpress';
import { waitOnRepo } from './wait-on-repo';
import { unzip } from './unzip';

describe('Blueprint step wait on repo', () => {
	let php: NodePHP;
	beforeEach(async () => {
		php = await NodePHP.load(RecommendedPHPVersion, {
			requestHandler: {
				documentRoot: '/wordpress',
			},
		});
	});

	it('wait on repo that requires installation', async () => {
		await unzip(php, {
			zipFile: await getWordPressModule(),
			extractToPath: '/wordpress',
		});
		await php.writeFile(
			'/wordpress/_rhildred_wp-test_nodb.txt',
			'Rich was here'
		);
		await waitOnRepo(php, { repo: 'https://github.com/rhildred/wp-test' });
		expect(
			await php.fileExists('/wordpress/wp-content/database/.ht.sqlite')
		).toBe(true);
	});
	it('wait on repo that already has a database', async () => {
		await unzip(php, {
			zipFile: await getWordPressModule(),
			extractToPath: '/wordpress',
		});
		await waitOnRepo(php, { repo: 'https://github.com/rhildred/wp-test' });
		expect(
			await php.fileExists('/wordpress/_rhildred_wp-test_nodb.txt')
		).toBe(false);
	});
});
