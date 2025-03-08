import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["vuetify/lib/styles/main.css", "@mdi/font/css/materialdesignicons.min.css"],
  pages: true,
  ssr: false,
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  experimental: {
    clientNodeCompat: true,
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
});
