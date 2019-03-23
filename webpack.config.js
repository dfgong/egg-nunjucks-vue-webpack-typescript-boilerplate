const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    framework: 'html',
    entry: 'app/web/@(page|layout)/**/*.ts',
    buildPath: 'public',
    buildDir: '../app/view',
    module: {
        rules: [
          {
            test: /\.html$/,
            use: [
              { loader: 'html-loader' }
            ]
          },
        //   {
        //     test: /\.js$/,
        //      exclude: /node_modules/, 
        //      loader: "babel-loader"
        //     },
          {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
        ]
      },
    loaders: {
        scss: true
    },
    plugins: [
        {
            html: {
                minify: false
            }
        },
        {
            env: 'prod',
            name: new CleanWebpackPlugin('app/view')
        }
    ]
}