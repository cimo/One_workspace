module.exports = {
    publicPath: "",
    configureWebpack: {
        mode: "development"
    },
    devServer: {
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};