module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: ["eslint:recommended", "@vue/typescript/recommended", "plugin:vue/vue3-essential", "plugin:prettier/recommended"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "object-curly-spacing": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "prettier/prettier": [
            "error",
            {
                arrowParens: "always",
                bracketSpacing: true,
                embeddedLanguageFormatting: "auto",
                htmlWhitespaceSensitivity: "css",
                insertPragma: false,
                printWidth: 300,
                proseWrap: "preserve",
                quoteProps: "as-needed",
                requirePragma: false,
                semi: true,
                singleQuote: false,
                tabWidth: 4,
                trailingComma: "none",
                useTabs: false,
                vueIndentScriptAndStyle: true,
                endOfLine: "auto"
            }
        ]
    }
};
