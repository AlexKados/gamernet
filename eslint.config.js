import js from "@eslint/js"
import vue from "eslint-plugin-vue"
import globals from "globals"
import prettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "dev-dist/**",
      "sw.js",
      "sw*.js",
      "workbox-*.js",
      "**/workbox-*.js",
    ],
  },

  js.configs.recommended,
  ...vue.configs["flat/recommended"],

  {
    files: ["**/*.{js,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "warn",

      "vue/multi-word-component-names": "off",
    },
  },
]
