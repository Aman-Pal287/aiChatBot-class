require("dotenv").config();

const app = require("./src/app");

const { createServer } = require("http");

const generateResponse = require("./src/services/ai.service");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const chatHistory = [
  // {
  //   role: "user",
  //   parts: [{ text: "who was the pm of india in 2019?" }],
  // },
  // {
  //   role: "model",
  //   parts: [{ text: "The Prime Minister of India in 2019 was Narendra Modi." }],
  // },
];

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://localhost:5173", // Adjust this to your frontend URL
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  /* ai-message */
  socket.on("ai-message", async (data) => {
    console.log("Ai message: ", data);
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });
    const response = await generateResponse(chatHistory);

    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    });

    console.log("Ai response: ", response);

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
