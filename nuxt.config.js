const pkg = require('./package');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          // eslint-disable-next-line max-len
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Open+Sans:wght@300;400;700&display=swap',
      },
    ],
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fc0', height: '5px' },

  plugins: [
    { src: '~/plugins/api' },
    { src: '~/plugins/auth' },
    { src: '~/plugins/global' },
    { src: '~/plugins/swiper' },
    { src: '~/plugins/directives/response', mode: 'client' },
    { src: '~/plugins/spinner', mode: 'client' },
  ],

  /*
  ** Global CSS
  */
  css: ['@/assets/directives/response', '@/assets/reset', '@/assets/transitions'],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/style-resources'],

  styleResources: {
    scss: ['~assets/variables.scss'],
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
