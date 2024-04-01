const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')

tc=30

const readFile = f => new Promise((resolve,reject) =>
  fs.readFile(f, (e,d) => e?reject(e):resolve(d)))


const server = http.createServer(async (request, response) =>
    response.end(await readFile(request.url.substr(1))))

const io = socketio(server)

count = 0;
player_list = []
snake_list = []


io.sockets.on('connection', socket => {
	count ++;
    console.log("A client connected")
    socket.emit("id",count)
    player_list.push(socket)


	socket.on('eaten' ,data => {
        ax = Math.floor(Math.random()*tc);
        ay = Math.floor(Math.random()*tc);
		player_list.map(player => player.emit("food",ax,ay,data))
    })

    socket.on("move", (id,data) => {
        console.log("Player moved")
		player_list.map(player => {
            if(player != socket){
                player.emit("moved",id,data)}
        })

    })

    socket.on("killed", id => {
        player_list.map(one_player => one_player.emit("kill",id))

    })

//	socket.on('disconnect', () => console.log('a client disconnected'))
})


server.listen(8000,"10.130.61.154" , () => console.log('Listening'))
