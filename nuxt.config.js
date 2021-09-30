export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTIC_ID,
    debug: false
  },
  head: {
    title: 'คิวพร้อม.com',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },

      { property: "og:title", content: "คิวพร้อม.com" },
      { property: "og:description", content: "จองคิวออนไลน์" },
      { property: "og:image", content: "https://i.ibb.co/TbwThsb/Transparent.png" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
        rel: "stylesheet",
        integrity: "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC",
        crossorigin: "anonymous"
      },
    ],
    script: [
      { src: 'https://static.line-scdn.net/liff/edge/2.1/sdk.js' },
    ]
  },
  target: 'static',

  env: {
    isDebug: process.env.DEBUG || false
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/app.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/gtm'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/gtm',
    '@nuxtjs/dotenv',
  ],
  gtm: {
    enabled: true, /* see below */
    id: process.env.GOOGLE_TAG_MANAGER_ID
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    https: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
