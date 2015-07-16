var express = require("express");
var glob = require("glob");
var app = express();
var port = 8080;

app.use(express.static("bin"));
app.use(express.static("files"));

app.route("/api/files")
  .get(function(req, res) {
    glob("**/*.wav", {cwd: "files"}, function(err, files) {
      if(err) {
        console.log("glob failed: " + err);
        res.status(400).text(err.toString());
      } else {
        res.json(files);
      }
    });
  });

app.listen(port, function() {
  console.log("Listening on port " + port);
});