module.exports = {
    output: {
        libraryTarget: 'commonjs2',
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.png$/, loader: "url-loader?limit=10000" },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};