const { CheckerPlugin } = require("awesome-typescript-loader");
const webpack = require("webpack");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV != "production";

const analyzerPlugin = process.env.WEBPACK_ANALYZE ? [new BundleAnalyzerPlugin()] : [];

module.exports = (env = {}, argv) => ({
  mode: argv.mode || isDev ? "development" : "production",
  entry: {
    app: "./src/index.tsx",
    vendor: ["react", "react-dom"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: isDev ? "[name].js" : "[name]-[chunkhash].js",
    chunkFilename: isDev ? "[name].js" : "[name]-[chunkhash].js",
    jsonpScriptType: "module",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: isDev ? "eval-source-map" : "nosources-source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          "cache-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: !argv.watch,
            },
          },
        ],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  plugins: [
    // new CheckerPlugin(),

    new HTMLWebpackPlugin({
      // filename: path.resolve(__dirname, 'index.html'),
      title: "ECStatic",
      chunks: ["vendor", "app"],
      template: "src/index.html.ejs",
      inject: false,
      hash: isDev,
      minify: { html5: true, removeTagWhitespace: true, collapseWhitespace: true },
      liveReload: argv.watch,
    }),
    new LiveReloadPlugin(),

    ...analyzerPlugin,
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true,
        },
        // commons: {
        //   // chunks: "initial",
        //   minChunks: 2,
        //   name: "commons",
        //   // enforce: true,
        // },
      },
    },
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },
});
