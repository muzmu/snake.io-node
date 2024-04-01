const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')

const readFile = f => new Promise((resolve,reject) =>
  fs.readFile(f, (e,d) => e?reject(e):resolve(d)))


const server = http.createServer(async (request, response) =>
    response.end(await readFile(request.url.substr(1))))

const io = socketio(server)





	io.sockets.on('connection', socket => {
		console.log("A client connected")
		socket.on('connected' ,data => {
			console.log("ok")

  	})


	socket.on('disconnect', () => console.log('a client disconnected'))
})



server.listen(8000 , () => console.log('Listening'))
