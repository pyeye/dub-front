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
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:500,700|Open+Sans:400,600&amp;subset=cyrillic-ext',
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
    { src: '~/plugins/directives/response', ssr: false },
    { src: '~/plugins/spinner', ssr: false },
  ],

  /*
  ** Global CSS
  */
  css: ['@/assets/directives/response.scss', '@/assets/reset.css', '@/assets/transitions.css'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    ['nuxt-sass-resources-loader', ['@/assets/variables.scss']],
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
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
