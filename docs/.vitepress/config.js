import { defineConfig } from 'vitepress'

const usageSections = [
  {
    text: 'Customization',
    items: [
      { text: 'Basics', link: '/usage/basics' },
      { text: 'Animation Settings', link: '/usage/animation-settings' },
      { text: 'Modules', link: '/usage/modules' },
      { text: 'Packs', link: '/usage/packs' }
    ]
  },
  {
    text: 'Going Deeper',
    items: [
      { text: 'Advanced Mode', link: '/usage/advanced-mode' },
      { text: 'Switch Animations In-depth', link: '/usage/switch-animations' },
      { text: 'Advanced Animation Settings', link: '/usage/advanced-animation-settings' },
      { text: 'Pack Directory', link: '/usage/pack-directory' }
    ]
  }
]

const createSections = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/create/introduction' }
    ]
  },
  {
    text: 'Essentials',
    items: [
      { text: 'Anime', link: '/create/anime' },
      { text: 'Injects', link: '/create/injects' },
      { text: 'Layout', link: '/create/layout' },
      { text: 'Settings', link: '/create/settings' },
      { text: 'Lifecycle', link: '/create/lifecycle' },
      { text: 'Intersection', link: '/create/intersection' },
      { text: 'Peculiarities', link: '/create/peculiarities' },
      { text: 'Debug Mode', link: '/create/debug-mode' }
    ]
  },
  {
    text: 'Advanced',
    items: [
      { text: 'Overridables', link: '/create/overridables' },
      { text: 'Extending Animations', link: '/create/extending-animations' },
      { text: 'Accordions', link: '/create/accordions' },
      { text: 'Snippets', link: '/create/snippets' },
      { text: 'Parsing In-depth', link: '/create/parsing' }
    ]
  },
  {
    text: 'Publish',
    items: [
      { text: 'Publishing to Catalog', link: '/create/publish' }
    ]
  }
]

const referenceSections = [
  {
    text: 'Definitions',
    items: [
      { text: 'Pack', link: '/reference/pack' },
      { text: 'Animation', link: '/reference/animation' },
      { text: 'Meta', link: '/reference/meta' },
      { text: 'Settings', link: '/reference/settings' },
      { text: 'Animate', link: '/reference/animate' },
      { text: 'Anime', link: '/reference/anime' },
      { text: 'Snippet', link: '/reference/snippet' },
      { text: 'Easing', link: '/reference/easing' }
    ]
  },
  {
    text: 'Injects',
    items: [
      { text: 'General', link: '/reference/injects/general' },
      { text: 'Object', link: '/reference/injects/object' },
      { text: 'Array', link: '/reference/injects/array' },
      { text: 'Anime', link: '/reference/injects/anime' },
      { text: 'Settings', link: '/reference/injects/settings' },
      { text: 'Math', link: '/reference/injects/math' },
      { text: 'Operators', link: '/reference/injects/operators' },
      { text: 'Accordions', link: '/reference/injects/accordions' },
      { text: 'Snippets', link: '/reference/injects/snippets' }
    ]
  }
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'BetterAnimations',
  description: 'Discord Animations Client Mod & Framework',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  markdown: {
    headers: true
  },
  sitemap: {
    hostname: 'https://betteranimations.net'
  },

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Usage', activeMatch: '/usage/', items: usageSections },
      { text: 'Create', activeMatch: '/create/', items: createSections },
      { text: 'Reference', activeMatch: '/reference/', items: referenceSections }
    ],

    sidebar: {
      '/usage/': usageSections,
      '/create/': createSections,
      '/reference/': referenceSections
    },

    socialLinks: [
      {
        icon: {
          svg: '<svg viewBox="2 2 20 20" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path></svg>'
        },
        link: 'https://donationalerts.com/r/arg0nny',
        ariaLabel: 'Donate'
      },
      { icon: 'discord', link: 'https://discord.gg/M8DBtcZjXD' },
      { icon: 'github', link: 'https://github.com/arg0NNY/BetterAnimations' },
      { icon: 'betterdiscord', link: 'https://betterdiscord.app/plugin/BetterAnimations' }
    ]
  }
})
