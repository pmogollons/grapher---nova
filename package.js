/* global Npm: true */
/* global Package: true */

Package.describe({
  name: "pmogollons:nova",
  version: "1.0.0",
  summary: "Grapher-like query layer on top of nova and meteor",
  git: "https://github.com/cult-of-coders/grapher",
  documentation: "README.md",
});

const npmPackages = {
  "lodash": "4.17.21",
  "mongodb": "4.17.0",
  "@bluelibs/nova": "1.6.0",
};

Package.onUse(function (api) {
  Npm.depends(npmPackages);

  api.versionsFrom(["3.0"]);

  const packages = [
    "typescript",
    "ecmascript",
    "check",
    "mongo",
    "zodern:types",
    "ddp-rate-limiter",
  ];

  api.use(packages);

  api.mainModule("main.client.js", "client");
  api.mainModule("main.server.js", "server");
});

Package.onTest(function (api) {
  api.use("pmogollons:nova");

  Npm.depends({
    ...npmPackages,
    chai: "4.3.4",
  });

  const packages = [
    "random",
    "ecmascript",
    "typescript",
    "mongo",
  ];

  api.use(packages);
  api.use("tracker");

  api.use(["meteortesting:mocha"]);
});
