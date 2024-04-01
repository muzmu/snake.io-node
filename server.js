const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')

tc=30
ongoing_game = 0;

const readFile = f => new Promise((resolve,reject) =>
  fs.readFile(f, (e,d) => e?reject(e):resolve(d)))


const server = http.createServer(async (request, response) =>
    response.end(await readFile(request.url.substr(1))))
const io = socketio(server)

count = 0;
player_list = []
snake_list = []
starting_pos={}
players_id = {}

fx = Math.floor(Math.random()*tc);
fy = Math.floor(Math.random()*tc);
starting_pos[(fx,fy)]=12345

io.sockets.on('connection', socket => {
	if(!ongoing_game){
		count ++;
		players_id[socket] = count
		socket.emit("id",count)
		console.log("A client connected")
		player_list.push(socket)

		px = Math.floor(Math.random()*tc);
	    py = Math.floor(Math.random()*tc);
	    while(starting_pos[(px,py)]){
	    	px = Math.floor(Math.random()*tc);
	   		py = Math.floor(Math.random()*tc);
	    }
	    starting_pos[(px,py)]=players_id[socket]
		socket.emit("start",1,px,py)

		socket.on('start_game',data=>{


			if(ongoing_game != 1){
				player_list.map(player => player.emit("food",fx,fy,data))
				player_list.map(one_player => one_player.emit("start",3,0,0))
				ongoing_game=1
			}


			socket.on('eaten' ,data => {
	        ax = Math.floor(Math.random()*tc);
	        ay = Math.floor(Math.random()*tc);
			player_list.map(player => player.emit("food",ax,ay,data))
	    	})

		    socket.on("move", (id,data) => {
		        // console.log("Player moved")
				player_list.map(player => {
		            if(player != socket){
		                player.emit("moved",id,data)}
		        })

		    })

		    socket.on("killed", id => {

				player_list = player_list.filter(item => item !== socket)
		        setTimeout(()=>{
                     player_list.map(one_player => one_player.emit("kill",id))
                },50)
		        if(player_list.length==1  && ongoing_game==1){


		             setTimeout(()=>{
                     player_list.map(one_player => one_player.emit('start',5,0,0))
                     },800);
					ongoing_game=0;
					count=0;

				}

		    })

		})




	}else{
		socket.emit("start",2,0,0)
	}


	socket.on('disconnect', () => {
		player_list = player_list.filter(item => item !== socket)
		player_list.map(one_player => one_player.emit("kill",players_id[socket]))
		if(player_list.length==1 && ongoing_game==1){
            player_list.map(one_player => one_player.emit('start',5,0,0))
			ongoing_game=0;
			count=0;

		}
		console.log('a client disconnected')})
})


server.listen(8000,"10.130.61.154" , () => console.log('Listening'))
