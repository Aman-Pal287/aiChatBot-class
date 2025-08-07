require("dotenv").config();

const app = require("./src/app");

const { createServer } = require("http");

const generateContent = require("./src/services/ai.service");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("ai-message", async (data) => {
    const response = await generateContent(data);
    console.log("AI response : ", response);

    socket.emit("ai-reply", response);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log("server is running on port 3000");
});

//!------------

/*
* in chat chiizo ko rat lo
! io= server
! socket = single user


! on = event listen karna
!emit = event ko fire karna


built-in event : connection, disconnect, error, message, etc.
custom event : ai-message, ai-reply, etc.
*/
