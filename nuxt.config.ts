import { defineNuxtConfig } from "nuxt/config";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import eslintPlugin from "vite-plugin-eslint";

export default defineNuxtConfig({
  css: ["@/assets/scss/main.scss", "ant-design-vue/dist/antd.css"],
  srcDir: "src/",
  modules: [
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-icons",
    "nuxt-icon",
  ],
  build: {
    transpile: [/echarts/],
  },
  app: {
    head: {
      title: "Logo | Admin",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },
  vite: {
    plugins: [
      eslintPlugin(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            resolveIcons: true,
          }),
        ],
      }),
    ],
    css: {
      devSourcemap: true,
    },
    ssr: {
      noExternal: [
        "moment",
        "compute-scroll-into-view",
        "ant-design-vue",
        "@ant-design/icons-vue",
      ],
    },
  },
  tailwindcss: {
    cssPath: "~/assets/scss/tailwind.scss",
  },
});
