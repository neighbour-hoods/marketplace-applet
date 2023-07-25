// CustomElementRegistry polyfill for Webkit/Safari in Tauri
import '@webcomponents/scoped-custom-element-registry'

// register external Lit components
import { AgentProfileCheck } from '@vf-ui/core-components'
import { AgentProfileManage } from '@vf-ui/core-components'

customElements.define('agent-profile-check', AgentProfileCheck)
customElements.define('agent-profile-manage', AgentProfileManage)

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
	}
});

export default app;
