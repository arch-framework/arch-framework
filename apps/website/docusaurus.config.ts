import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'Arch Framework',
    favicon: 'img/favicon.ico',

    url: 'https://archjs.io',
    baseUrl: '/',
    organizationName: 'arch-framework',
    projectName: 'arch-framework',
    trailingSlash: false,

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ru'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                },
                blog: {
                    showReadingTime: true,
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        metadata: [{name: 'robots', content: 'noindex'}],
        colorMode: {
            defaultMode: 'light',
            disableSwitch: true,
        },
        navbar: {
            title: 'Arch Framework',
            logo: {
                alt: 'Arch Framework Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Documentations',
                },
            ],
        },
        footer: {
            style: 'light',
            copyright: `Powered by the Artyom Kayun ©${new Date().getFullYear()}. Code licensed under an <a href="/license" title="License text"> MIT License </a>`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
