// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeFlexoki from 'starlight-theme-flexoki'
import expressiveCode from 'astro-expressive-code';
// https://astro.build/config
export default defineConfig({
    integrations: [expressiveCode(),starlight({
        plugins: [starlightThemeFlexoki({accentColor: "purple"})],
	
        title: 'CrossQuest',
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/CrossQuestBS' }],
        sidebar: [
            {
                label: 'Introduction',
                autogenerate: { directory: 'introduction' },
            },
            {
                label: 'Technical',
                autogenerate: { directory: 'tech' },
            },
            {
                label: 'CrossAccord',
                autogenerate: { directory: 'crossaccord' },
            },
            {
                label: 'CLI',
                autogenerate: { directory: 'cli' },
            },
        ],
		})],
});