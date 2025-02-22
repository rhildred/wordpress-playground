import { StepHandler } from '.';
import { writeFile } from './write-file';
import { phpVar } from '@php-wasm/util';

/**
 * @inheritDoc importWxr
 * @example
 *
 * <code>
 * {
 * 		"step": "importWxr",
 * 		"file": {
 * 			"resource": "url",
 * 			"url": "https://your-site.com/starter-content.wxr"
 * 		}
 * }
 * </code>
 */
export interface ImportWxrStep<ResourceType> {
	step: 'importWxr';
	/** The file to import */
	file: ResourceType;
}

/**
 * Imports a WXR file into WordPress.
 *
 * @param playground Playground client.
 * @param file The file to import.
 */
export const importWxr: StepHandler<ImportWxrStep<File>> = async (
	playground,
	{ file },
	progress?
) => {
	progress?.tracker?.setCaption('Importing content');
	await writeFile(playground, {
		path: '/tmp/import.wxr',
		data: file,
	});
	const docroot = await playground.documentRoot;
	await playground.run({
		code: `<?php
		require ${phpVar(docroot)} . '/wp-load.php';
		$admin_id = get_users(array('role' => 'Administrator') )[0];
		$importer = new WXR_Importer( array(
			'fetch_attachments' => true,
			'default_author' => $admin_id
		) );
		$logger = new WP_Importer_Logger_CLI();
		$importer->set_logger( $logger );
		$result = $importer->import( '/tmp/import.wxr' );
		`,
	});
};
