import { defineConfig } from "vite";
import { svelte } from '@sveltejs/vite-plugin-svelte';
// import { viteStaticCopy } from "vite-plugin-static-copy";
// import { VitePluginFonts } from 'vite-plugin-fonts'

const components = [
  "dialog",
  "dropdown",
  "menu",
  "menu-item",
  "checkbox",
  "divider",
  "menu-label",
  "option",
  "select",
  "tooltip",
  "card",
  "icon-button",
  "button",
  "icon",
  "alert",
  "input",
  "spinner",
  "avatar",
  "skeleton",
];
const exclude = components.map(
  (c) => `@shoelace-style/shoelace/dist/components/${c}/${c}.js`
);

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    deps: {
      inline: [/@neighbourhoods/, /@scoped-elements\/shoelace/]
    }
  },
  define: {
    'process.env': process.env,
  },
  plugins: [
    svelte(),
    // checker({
    //   typescript: true,
    //   eslint: {
    //     lintCommand: "eslint --ext .ts,.html src",
    //   },
    // }),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: "node_modules/@shoelace-style/shoelace/dist/assets",
    //       dest: "shoelace",
    //     }
    //   ],
    // }),
  ],
});
