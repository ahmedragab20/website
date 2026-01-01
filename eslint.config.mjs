import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginSolid from "eslint-plugin-solid";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";

export default [
    ...eslintPluginAstro.configs.recommended,
    {
        files: ["**/*.astro"],
        languageOptions: {
            parser: eslintPluginAstro.parser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".astro"],
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                jsx: true,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            solid: eslintPluginSolid,
        },
        rules: {
            "solid/jsx-no-duplicate-props": "error",
            "solid/jsx-no-undef": "error",
            "solid/jsx-uses-vars": "error",
            "solid/no-array-handlers": "warn",
            "solid/no-destructure": "warn",
            "solid/no-innerhtml": "warn",
            "solid/no-proxy-apis": "warn",
            "solid/no-react-deps": "error",
            "solid/no-react-specific-props": "error",
            "solid/no-unknown-namespaces": "error",
            "solid/prefer-for": "warn",
            "solid/reactivity": "warn",
            "solid/self-closing-comp": "warn",
            "solid/style-prop": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
    prettierConfig,
    {
        ignores: ["dist/**", "node_modules/**", ".astro/**"],
    },
];
