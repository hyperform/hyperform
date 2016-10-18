SystemJS.config({
  transpiler: "plugin-babel",
  packages: {
    "hyperform": {
      "main": "hyperform.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "core-js": "npm:core-js@1.2.7",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.16",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha"
  },
  packages: {}
});
