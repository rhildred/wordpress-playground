import { trash } from '@wordpress/icons';
import { usePlaygroundContext } from '../playground-viewport/context';
import { MenuItem } from '@wordpress/components';
import { StorageType } from '../../types';

type Props = { onClose: () => void; storage: StorageType };
const opfsStorages: StorageType[] = [
	'browser',
	'device',
	'opfs-browser',
	'opfs-host',
];
export function ResetSiteMenuItem({ onClose, storage }: Props) {
	const { playground } = usePlaygroundContext();
	return (
		<MenuItem
			icon={trash}
			iconPosition="left"
			aria-label="Resets the current playground site and starts a new one."
			onClick={async () => {
				if (
					!window.confirm(
						'This will wipe out all data and start a new site. Do you want to proceed?'
					)
				) {
					onClose();
					return;
				}
				if (opfsStorages.includes(storage)) {
					await playground?.resetVirtualOpfs();
				}
				window.location.reload();
				onClose();
			}}
		>
			Reset site
		</MenuItem>
	);
}