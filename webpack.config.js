module.exports = {
    entry: "./app/index.js",
    output: {
        path: "dist",
        publicPath: "",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.png$/, loader: "url-loader?limit=10000" },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};