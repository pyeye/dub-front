const nodeExternals = require('webpack-node-externals');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'dubbel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
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
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: [
    { src: '~/plugins/api' },
    { src: '~/plugins/icons' },
    { src: '~/plugins/global' },
    { src: '~/plugins/swiper', ssr: false },
    { src: '~/plugins/directives/response', ssr: false },
    { src: '~/plugins/spinner', ssr: false },
  ],
  css: [
    '@/assets/directives/response.scss',
    '@/assets/reset.css',
    'swiper/dist/css/swiper.css',
  ],
  modules: [['nuxt-sass-resources-loader', ['@/assets/variables.scss']]],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient, isServer }) {
      if (isServer) {
        config.externals = [
          nodeExternals({
            // default value for `whitelist` is
            // [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i]
            whitelist: [
              /es6-promise|\.(?!(?:js|json)$).{1,5}$/i,
              /^vue-awesome/,
            ],
          }),
        ];
      }

      if (isDev && isClient) {
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
