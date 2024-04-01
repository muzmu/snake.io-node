const socket = io();

alive =1;
game_on = 0;


function call_me() {
    canv=document.getElementById("root");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    setInterval(!alive || game,1000/15);
}

my_id = null
px=py=10; //player position
gs=30
tc=30; //grid size
ax=ay=15; //goal
xv=yv=0; //velocities
trail=[];
tail = 1;
i_moved = 0

all_trails ={}


socket.on("id", data=> {
    my_id = data;
})

socket.on("moved", (i,data) => {
    all_trails[i] = data;
    console.log("move_came")
//    ctx.fillStyle = "yellow"
//    all_trails[i].ptrail.map(one_piece=> ctx.fillRect(one_piece.x*gs,one_piece.y*tc,gs-15,gs-15))
})
socket.on("kill", id => {
    try{
        delete all_trails[id];
    }
    catch(err){
        console.log("Already dead");
    }
})

socket.on("food",(x,y,id) => {
    ax=x;
    ay=y;
    try{
    all_trails[id].ptail++;
    }
    catch(e){
    }
})


function game() {

    if(alive){
    px+=xv;
    py+=yv;
    if(px<0) {
        socket.emit("killed",my_id);
        px= tc-1;
        alive =0
    }
    if(px>tc) {
        px= 0;
        socket.emit("killed",my_id);
        alive =0
    }
    if(py<0) {
        py= tc-1;
        socket.emit("killed",my_id);
        alive =0
    }
    if(py>tc) {
        py= 0;
        socket.emit("killed",my_id);
        alive=0
    }
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="lime";
    for(var i=0;i<trail.length;i++) {
      ctx.fillRect(trail[i].x*gs,trail[i].y*tc,gs-15,gs-15);
        if(trail[i].x==px && trail[i].y==py && (xv || yv)) {
            socket.emit("killed",my_id);
            alive =0;
        }
    }

    all_keys = Object.keys(all_trails);
    try{
    all_keys.map(one_key => {
        all_trails[one_key].ptrail.map(one_trail => {
            if(one_trail.x ==px && one_trail.y==py){
                socket.emit("killed",my_id)
                    alive = 0;
            }

        })

    })}
    catch(err){
        console.log(err)

    }
 //   all_trails.map(one_trail => {
 //       one_trail.map(one_piece=> ctx.fillRect(one_piece.x*gs,one_piece.y*tc,gs-15,gs-15))
   // })
    if(alive){

    trail.push({x:px,y:py});
    while(trail.length>tail) {
    trail.shift();
    }
    if(i_moved){
        socket.emit("move",my_id,{pid:my_id, ptrail:trail ,pxv:xv, pyv:yv ,ppx:px, ppy:py, ptail:tail})
        i_moved = 0;

    }

    all_keys.map(one_key => make_snake(all_trails[one_key]))


    if(ax==px && ay==py) {
        tail++;
   //     ax=Math.floor(Math.random()*tc);
   //     ay=Math.floor(Math.random()*tc);
        socket.emit("eaten",my_id)
    }

//    socket.emit("position" ,my_id, trail)
    ctx.fillStyle="red";
    ctx.fillRect(ax*gs,ay*tc,gs-15,gs-15);
    }
    }
}
function keyPush(evt) {

    switch(evt.keyCode) {
        case 37: //left
            if(xv != 0.5){
                xv=-0.5;yv=0;
                i_moved = 1;
            }
            break;
        case 38: //up
            if(yv != 0.5){
                xv=0;yv=-0.5;

                i_moved = 1;
            }
            break;
        case 39: //right
            if(xv != -0.5){
                xv=0.5;yv=0;

                i_moved = 1;
            }
            break;
        case 40: //down
            if(yv != -0.5){
                xv=0;yv=0.5;

                i_moved = 1;
            }
            break;
    }
}

function make_snake(dic){

    dic.ppx+=dic.pxv;
    dic.ppy+=dic.pyv;


    ctx.fillStyle="blue";
    for(var i=0;i<dic.ptrail.length;i++) {
      ctx.fillRect(dic.ptrail[i].x*gs,dic.ptrail[i].y*tc,gs-15,gs-15);
    }


    dic.ptrail.push({x:dic.ppx,y:dic.ppy});
    while(dic.ptrail.length>dic.ptail) {
        dic.ptrail.shift();
    }

}


call_me()






















