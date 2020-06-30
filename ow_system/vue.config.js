module.exports = {
    publicPath: "",
    configureWebpack: {
        mode: "development"
    },
    devServer: {
        host: "0.0.0.0",
        port: 8181,
        https: true,
        open: false,
        hot: true,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};