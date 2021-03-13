module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: ["eslint:recommended", "plugin:vue/essential", "@vue/typescript", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        curly: ["error"],
        "object-curly-spacing": "off",
        "sort-imports": "off",
        "no-unused-vars": "off",
        "no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "prettier/prettier": [
            "error",
            {
                arrowParens: "always",
                bracketSpacing: true,
                embeddedLanguageFormatting: "auto",
                htmlWhitespaceSensitivity: "css",
                insertPragma: false,
                jsxBracketSameLine: false,
                jsxSingleQuote: false,
                printWidth: 300,
                proseWrap: "preserve",
                quoteProps: "as-needed",
                requirePragma: false,
                semi: true,
                singleQuote: false,
                tabWidth: 4,
                trailingComma: "none",
                useTabs: false,
                vueIndentScriptAndStyle: true
            }
        ]
    },
    overrides: [
        {
            files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
            env: {
                jest: true
            }
        },
        {
            files: ["*.vue"],
            rules: {
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": [2, { args: "none" }]
            }
        }
    ]
};
