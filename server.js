const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 5000;

const server = express()
  .use("*", function (req, res) {
    res.send("Visit https://github.com/Ritesh-Aggarwal to view source code.");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
