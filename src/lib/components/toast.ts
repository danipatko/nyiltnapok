import { writable, derived, type Readable } from 'svelte/store';

function createNotificationStore() {
	const _notifications = writable<Map<string, string>>(new Map());

	function send(id: string, msg: string) {
		_notifications.update((state) => {
			state.set(id, msg);
			return state;
		});
	}

	function clear(id: string) {
		_notifications.update((state) => {
			state.delete(id);
			return state;
		});
	}

	function clearAll() {
		_notifications.update((state) => {
			state.clear();
			return state;
		});
	}

	const notifications = derived(_notifications, ($_notifications, set) => {
		set($_notifications);
	}) as Readable<Map<string, string>>;

	const { subscribe } = notifications;

	return {
		subscribe,
		send,
		clear,
		clearAll,
		default: (id: string, msg: string) => send(id, msg)
	};
}

export const notifications = createNotificationStore();
