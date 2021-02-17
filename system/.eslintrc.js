module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "eslint:recommended", "@vue/typescript", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        curly: "error",
        "no-empty-function": "off",
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
                jsxBracketSameLine: false,
                jsxSingleQuote: false,
                printWidth: 220,
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
                "@typescript-eslint/no-unused-vars": [2, { args: "none" }]
            }
        }
    ]
};
