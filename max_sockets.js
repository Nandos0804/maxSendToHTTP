const express = require("express");
const http = require("http");
const path = require("path");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const Max = require("max-api");

var index = require("./routes/index");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let server = http.createServer(app);

const wss = new WebSocket.Server({ port: 7474 });

wss.on("connection", function connection(ws, req) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.on("close", function stop() {
    Max.removeHandlers("send");
    console.log("Connection closed");

    ws.terminate();
  });

  const sender = function (a, b, c) {
    ws.send(
      JSON.stringify({
        value_1: a,
      })
    );
  };

  // Handle the Max interactions here...
  Max.addHandler("send", (...args) => {
    console.log("send args: " + args);
    if (args.length === 1) {
      sender(args[0]);
    }
  });
});

Max.addHandler(Max.MESSAGE_TYPES.ALL, (handled, ...args) => {
  if (!handled) {
    // Max.post('No client connected.')
    // just consume the message
  }
});

console.log("setting up max handlers");

server.listen(8080, function listening() {
  console.log("Listening on %d", server.address().port);
});
