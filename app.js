var express = require("express");
var app = express();
var serv = require("http").Server(app);

app.use("/static", express.static(__dirname + "/build/static"));
app.get("/*",function(req, res){
	res.sendFile(__dirname + "/build/index.html");
});

console.log("Listening on 3001")
serv.listen(3001, "0.0.0.0");
