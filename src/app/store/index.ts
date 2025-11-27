import AppearanceStoreModule from '@webitel/ui-sdk/src/modules/Appearance/store/AppearanceStoreModule';
import { createStore } from 'vuex';

const appearance = new AppearanceStoreModule().getModule();

export default createStore({
  modules: {
    appearance,
  }
});
