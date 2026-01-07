import { isUnsupportedUserAgent } from '../../../../mainScene/modules/error-blocks/scripts/isUnsupportedUserAgent';

/**
 * @author: dlohvinov
 *
 * @see [WTEL-8574](https://webitel.atlassian.net/browse/WTEL-8574)
 */
export const shouldRequestPermissions = (): boolean => {
	return isUnsupportedUserAgent() ? false : true;
};
