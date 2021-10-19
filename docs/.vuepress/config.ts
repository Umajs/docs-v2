import { defineUserConfig } from '@vuepress/cli'
import { path, fs, chalk, logger } from '@vuepress/utils'
import YAML from 'yaml'
import dotenv from 'dotenv'
import * as chokidar from 'chokidar'

import type { DefaultThemeOptions, WebpackBundlerOptions } from 'vuepress'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

console.log('Mode:', isProd ? 'Production' : 'development')

/**
 * @description Vuepress2 config
 * @see https://v2.vuepress.vuejs.org/reference/config.html
 */
module.exports = defineUserConfig<DefaultThemeOptions, WebpackBundlerOptions>({
  base: '/v2/',
  dest: path.resolve(__dirname, '../../dist'),
  public: 'public',
  title: 'UMajs',
  description: 'Umajs，an easy-to-use NodeJS framework base on Typescript.',

  bundler:
    process.env.BUNDLER ??
    // use vite in dev, use webpack in prod
    (isProd ? '@vuepress/webpack' : '@vuepress/vite'),
  bundlerConfig: {
    evergreen: false,
  },

  templateDev: path.resolve(__dirname, './templates/index.dev.html'),
  templateSSR: path.resolve(__dirname, './templates/index.ssr.html'),

  theme: path.resolve(__dirname, './theme/'),

  head: [
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,user-scalable=0,viewport-fit=cover',
      },
    ],
    ['meta', { name: 'origin', content: 'referrer' }],
    ['meta', { name: 'renderer', content: 'webkit' }],
    ['meta', { name: 'force-rendering', content: 'webkit' }],
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { name: 'msapplication-titleColor', content: '#ffffff' }],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'lack-translucent',
      },
    ],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'UMajs' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['meta', { name: 'google', content: 'notranslate' }],
    [
      'meta',
      { name: 'twitter:image', content: 'https://github.com/Umajs/Umajs/' },
    ],
    ['meta', { itemprop: 'image', content: 'https://github.com/Umajs/Umajs/' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/favicon.ico',
        color: '#ffffff',
      },
    ],
    [
      'script',
      {
        crossOrigin: 'anonymous',
        src: 'https://polyfill.io/v3/polyfill.min.js?features=%7Ehtml5-elements%2CCSS.supports%2ClocalStorage%2Cdefault%2Ces6%2Ces2015%2Ces2016%2CElement.prototype.scroll%2CElement.prototype.scrollBy%2CglobalThis%2Cfetch%2CURLSearchParams',
      },
    ],
  ],

  // site-level locales config
  locales: {
    /**
     * Chinese locale config
     */
    '/': {
      lang: 'zh-CN',
      title: 'UMajs',
      description: '一个简单易用、扩展灵活，基于TypeScript的Node.js Web框架',
    },

    /**
     * English locale config
     */
    '/en/': {
      lang: 'en-US',
      title: 'UMajs',
      description: 'A simple, flexible, typescript based node.js Web Framework',
    },
    // /**
    //  * Japanese locale config
    //  */
    // '/ja/': {
    //   lang: 'ja-JP',
    //   title: 'UMajs',
    //   description: '一个简单易用、扩展灵活，基于TypeScript的Node.js Web框架',
    // },
  },

  /**
   * @description Vuepress2 theme config
   * @see https://v2.vuepress.vuejs.org/reference/theme-api.html
   */
  themeConfig: {
    repo: 'https://github.com/Umajs/Umajs',
    logo: '/images/UMajsV2.png',
    repoLabel: 'Github',
    docsBranch: 'main',
    docsRepo: 'https://github.com/Umajs/docs',
    docsDir: 'docs',
    editLinkPattern: ':repo/edit/:branch/:path',
    themePlugins: {
      mediumZoom: false,
      // backToTop: false,
      // container: {
      //   tip: false,
      //   warning: false,
      //   danger: false,
      //   details: false,
      // },
    },
    locales: (() => {
      let localeData = {}

      fs.readdirSync(path.resolve(__dirname, './locales')).forEach((val) => {
        localeData = Object.assign(
          localeData,
          YAML.parse(
            fs.readFileSync(path.resolve(__dirname, './locales/' + val), 'utf8')
          )
        )
      })
      return localeData
    })(),
  },
  plugins: [
    /**
     * @description This plugin will import gtag.js for Google Analytics 4.
     * @see https://v2.vuepress.vuejs.org/reference/plugin/google-analytics.html
     */
    [
      '@vuepress/google-analytics',
      {
        // we have multiple deployments, which would use different id
        id: 'G-8YY0BNNYKN',
      },
    ],

    /**
     * @description Provide local search to your documentation site
     * @see https://v2.vuepress.vuejs.org/reference/plugin/search.html
     */
    [
      '@vuepress/plugin-search',
      {
        maxSuggestions: 5,
        hotKeys: ['s', '/'],
        locales: {
          '/en/': {
            placeholder: 'Search',
          },
          '/': {
            placeholder: '搜索',
          },
          '/ja/': {
            placeholder: '検索する',
          },
        },
        // 允许搜索 Frontmatter 中的 `tags`
        getExtraFields: (page: { frontmatter: { tags: any } }) =>
          page.frontmatter.tags ?? [],
      },
    ],

    /**
     * @description Algolia DocSearch
     * @see https://v2.vuepress.vuejs.org/reference/plugin/docsearch.html
     */
    [
      '@vuepress/docsearch',
      false,
      // {
      //   apiKey: '',
      //   indexName: '',
      //   appId: '',
      //   locales: {
      //     '/en/': {
      //       placeholder: 'Search',
      //     },
      //     '/': {
      //       placeholder: '搜索',
      //     },
      //     '/ja/': {
      //       placeholder: '検索する',
      //     },
      //   },
      // },
    ],

    /**
     * @description Register Vue components from component files or directory automatically.
     * @see https://v2.vuepress.vuejs.org/reference/plugin/register-components.html
     */
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],

    /**
     * @description Automatically generate a Sitemap for site
     * @see https://vuepress-theme-hope.github.io/sitemap
     */
    [
      'sitemap2',
      {
        hostname: 'https://umajs.github.io/',
        exclude: [],
      },
    ],

    /**
     * @description PWA support
     * @see https://vuepress-theme-hope.github.io/pwa
     */
    ['vuepress-plugin-pwa2'],

    /**
     * @description Automatic generation of detailed feed files
     * @see https://vuepress-theme-hope.github.io/feed
     */
    [
      'feed2',
      {
        hostname: 'https://umajs.github.io/',
      },
    ],

    /**
     * @description Inject the `<meta>` tag to enhance the search engine optimization of the site
     * @see https://vuepress-theme-hope.github.io/seo
     */
    [
      'seo2',
      {
        author: 'wuba',
        restrictions: '3+',
        // seo: () => {
        //   return {
        //     'twitter:card': 'summary',
        //   }
        // },
        //   customMeta: (
        //     meta: [Record<'content' | 'name' | 'charset' | 'http-equiv', string>]
        //   ) => {
        //   },
      },
    ],

    /**
     * @description  use more syntax in your Markdown files.
     * @see https://vuepress-theme-hope.github.io/md-enhance/guide/
     */
    // [
    //   'md-enhance',
    //   {
    //     enableAll: true,
    //     tex: {
    //       strict: 'ignore',
    //     },
    //     presentation: {
    //       plugins: [
    //         'highlight',
    //         'math',
    //         'search',
    //         'notes',
    //         'zoom',
    //         'anything',
    //         'audio',
    //         'chalkboard',
    //       ],
    //     },
    //   },
    // ],

    /**
     * @description This plugin will provide a table-of-contents (TOC) component
     * @see https://v2.vuepress.vuejs.org/reference/plugin/toc.html
     */
    ['@vuepress/plugin-toc'],

    /**
     * @description This plugin will enable syntax highlighting for markdown code fence with Shiki
     * @see https://v2.vuepress.vuejs.org/reference/plugin/shiki.html
     */
    [
      '@vuepress/plugin-shiki',
      // only enable shiki plugin in production mode
      isProd
        ? {
            /**
             * @description shiki theme preview
             * @see https://vscodethemes.com/
             */
            theme: 'github-dark',
          }
        : false,
    ],

    /**
     * @description Add a debug component to your site. The component will only take effect in development mode
     * @see https://v2.vuepress.vuejs.org/reference/plugin/debug.html
     */
    ['@vuepress/plugin-debug'],
  ],
  onWatched: (_, watchers, restart) => {
    const watcher = chokidar.watch('locales/*.yml', {
      cwd: __dirname,
      ignoreInitial: true,
    })
    watcher.on('change', async (file) => {
      logger.info(`file ${chalk.magenta(file)} is modified`)
      await restart()
    })
    watchers.push(watcher)
  },
})
