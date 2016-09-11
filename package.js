var collector = require("collect-require"),
    baseDir   = "src",
    main      = "index.js",
    output    = "dist/jeyson.js";

collector.collect(baseDir).save({
  path    : output,
  main    : main ,
  apiName : "Jeyson",
});
