var exampleSocket = new WebSocket("ws://localhost:7474");

exampleSocket.onopen = function (event) {
  console.log("sending data...");
  exampleSocket.send("Ready, willing and able!");
};

exampleSocket.onmessage = function (event) {
  let e = JSON.parse(event.data);

  $("#value_1").text(e.value_1);
};

$(window).on("beforeunload", function () {
  exampleSocket.close();
});
