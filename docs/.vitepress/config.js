import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'BetterAnimations',
  description: 'Discord Client Mod for Animations',
  cleanUrls: true,
  themeConfig: {
    logo: '/assets/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Usage', link: '/usage/customization', activeMatch: '/usage/' },
      { text: 'Create', link: '/create/introduction', activeMatch: '/create/' },
      { text: 'Reference', link: '/reference/pack', activeMatch: '/reference/' }
    ],

    sidebar: {
      '/usage/': [
        {
          text: 'Customization',
          items: [
            { text: 'Basics', link: '/usage/customization' },
            { text: 'Modules', link: '/usage/modules' },
            { text: 'Animation Settings', link: '/usage/animation-settings' },
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
      ],
      '/create/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/create/introduction' },
            { text: 'Quick Start', link: '/create/quick-start' }
          ]
        },
        {
          text: 'Essentials',
          items: [
            { text: 'Anime', link: '/create/anime' },
            { text: 'Injects', link: '/create/injects' },
            { text: 'Settings', link: '/create/settings' },
            { text: 'Layout', link: '/create/layout' },
            { text: 'Lifecycle', link: '/create/lifecycle' },
            { text: 'Intersection', link: '/create/intersection' },
            { text: 'Debug Mode', link: '/create/debug-mode' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Overridables', link: '/create/overridables' },
            { text: 'Accordions', link: '/create/accordions' },
            { text: 'Snippets', link: '/create/snippets' },
            { text: 'Extending Animations', link: '/create/extending-animations' },
            { text: 'Modal Backdrop', link: '/create/modal-backdrop' }
          ]
        },
        {
          text: 'Publish',
          items: [
            { text: 'Publishing to Catalog', link: '/create/publish' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Definitions',
          items: [
            { text: 'Pack', link: '/reference/pack' },
            { text: 'Animation', link: '/reference/animation' },
            { text: 'Snippet', link: '/reference/snippet' }
          ]
        },
        {
          text: 'Injects',
          items: [
            { text: 'General', link: '/reference/injects/general' },
            { text: 'Settings', link: '/reference/injects/settings' },
            { text: 'Anime', link: '/reference/injects/anime' },
            { text: 'Operators', link: '/reference/injects/operators' },
            { text: 'Math', link: '/reference/injects/math' },
            { text: 'Accordion', link: '/reference/injects/accordion' },
            { text: 'Snippets', link: '/reference/injects/snippets' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/arg0NNY/BetterAnimations' }
    ]
  }
})
