import type {
	CallAccount,
	Identity,
} from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/account_pb';
import type {
	AccessToken,
	TokenRequest,
} from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/auth_pb';
import type { ChatAccount } from '@buf/webitel_portal.community_timostamm-protobuf-ts/data/messages_pb';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { AppConfig } from '../../../types/config';
import { PortalAPI } from '../api/portal';

export const useAuthStore = defineStore('auth', () => {
	const config = inject<AppConfig>('$config')!;

	const route = useRoute();

	const userinfo = ref<AccessToken>();

	const xPortalDevice = ref<string>(uuidv4());

	const meetingId = computed<string>(() => route.params.meetingId! as string);

	const accessToken = computed<string | null>(
		() => userinfo.value?.accessToken ?? null,
	);

	const callAccount = computed<CallAccount | null>(
		() => userinfo.value?.call ?? null,
	);

	const chatAccount = computed<ChatAccount | null>(
		() => userinfo.value?.chat ?? null,
	);

	const initialize = async () => {
		const response: AccessToken = await PortalAPI.postPortalToken(
			{
				url: config.token.endpointUrl,
				headers: {
					'X-Portal-Device': xPortalDevice.value,
				},
			},
			{
				appToken: config.token.appToken,
				identity: {
					iss: config.token.iss,
					sub: uuidv4(),
					name: 'Guest',
				} as Identity,
				grantType: 'identity',
				responseType: [
					'token',
					'user',
					'call',
					'chat',
				],
				meetingId: meetingId.value,
			} as TokenRequest,
		);

		userinfo.value = response;
	};

	return {
		// state
		userinfo,
		xPortalDevice,

		// computed
		meetingId,
		accessToken,
		callAccount,
		chatAccount,

		// actions
		initialize,
	};
});
