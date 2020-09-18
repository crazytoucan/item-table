const fusebox = require("fuse-box").fusebox;
fusebox({
  entry: "src/__example__/index.ts",
  target: "browser",
  devServer: true,
  webIndex: true,
  hmr: {
    reload : true,
    hardReloadScripts: true,
  },
}).runDev();
