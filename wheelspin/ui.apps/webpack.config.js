const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    // Shadcn button bundle
    "shadcn-button":
      "./src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-shadcn-button/js/index.js",
    // Spin wheel bundle
    "spin-wheel":
      "./src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-spin-wheel/js/index.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]-bundle.js",
    library: {
      name: "[name]",
      type: "umd",
    },
    globalObject: "this",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      // Button component aliases
      "@/lib/utils": path.resolve(
        __dirname,
        "src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-shadcn-button/js/lib/utils.ts"
      ),
      "@/components/ui": path.resolve(
        __dirname,
        "src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-shadcn-button/js/components/ui"
      ),
      // Spin wheel component aliases
      "@/spin-wheel/lib/utils": path.resolve(
        __dirname,
        "src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-spin-wheel/js/lib/utils.ts"
      ),
      "@/spin-wheel/components/ui": path.resolve(
        __dirname,
        "src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-spin-wheel/js/components/ui"
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
};
