import { toastStore } from '@skeletonlabs/skeleton';

export function toast(message: string, token = 'surface') {
	toastStore.trigger({ message, background: `variant-filled-${token}` });
}

