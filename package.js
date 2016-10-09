var collector = require("collect-require"),
    baseDir   = "src",
    main      = "index.js",
    nashornPath    = "dist/jeyson.js",
    browserPath    = "dist/jeyson-browser.js";

collector.collect(baseDir).save({
  buildNashorn    : nashornPath,
  buildBrowser    : browserPath,
  main    : main ,
  apiName : "Jeyson"
});