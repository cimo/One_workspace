module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: ["eslint:recommended", "plugin:vue/essential", "@vue/typescript", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
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
