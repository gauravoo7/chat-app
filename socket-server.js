var express = require("express");
var mongo=require('./utils/mongo');

var app = express();

var http = require("http");

var server = http.createServer(app);

var io = require("socket.io")(server);

var clientData=[];
io.on("connection", client =>{
    console.log("New client connected...", client.id);
    client.emit("acknowledge", {data : "Connected"});

    client.on("msgToServer", (chatterName, msg) => {
        console.log(chatterName + " says : " + msg);
        client.broadcast.emit("msgToClient", chatterName , msg);
        client.emit("msgToClient", 'Me', msg);
        clientData.push({client: chatterName +" : "+msg});
    })

    client.on("disconnect", ()=>{
        console.log("Client disconnected." + client.id);    
       console.log(clientData);
    })

})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/public/socket-client.html');
})

server.listen(3000, ()=>{
    console.log("Socket server running on port 3000");
})