const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: "./dist",
    publicPath: "/",
    configureWebpack: {
        mode: "development"
    },
    devServer: {
        host: "0.0.0.0",
        port: 30000,
        https: false,
        open: false,
        hot: true
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: "@import '@/assets/scss/helper.scss';"
            }
        }
    }
});
