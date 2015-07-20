var config = require("./config");
var _ = require("lodash");
var fs = require("fs");
var express = require("express");
var glob = require("glob");
var app = express();

var port = config.port;
var audioFileDir = config.audioFileDir;
var extentions = config.extentions;

var templateString = [
  "<!doctype html>",
  "<html>",
  "<head></head>",
  "<body>",
  "<script type='text/javascript'>",
    "window.__DATA = {{data}};",
  "</script>",
  "<script src='app.js' type='text/javascript'></script>",
  "</body>",
  "</html>"
].join("\n");

app.route("/")
  .get(function(req, res) {
    getFiles().then(
      function(files) {
        res.send(template({files: files}));
      },
      function(err) {
        res.status(400).send(err);
      }
    );
  });

app.use(express.static("bin"));
app.use(express.static("files"));

function template(options) {
  return templateString.replace("{{data}}", JSON.stringify(options, null, 4));
}

function getFiles() {
  return new Promise(function(resolve, reject) {
    glob("**/*.?("+extentions.join("|")+")", {cwd: audioFileDir}, function(err, files) {
      if(err) {
        reject(err);
      } else {
        resolve(files.map(function(path) {
          return {
            path: path,
            name: last(path.split("/"))
          };
        }));
      }
    });
  });
}

app.route("app.js")
  .get(function(req, res) {
    fs.createReadStream("bin/app.js").pipe(res);
  });

app.route("/api/files")
  .get(function(req, res) {
    getFiles().then(
      function(files) {
        res.json(files);
      }, 
      function(err) {
        res.status(400).send(err);
      }
    );
  });

app.listen(port, function() {
  console.log("Listening on port " + port);
});

function last(arr) { return arr[arr.length - 1]; }