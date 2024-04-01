const socket = io();

window.onload=function() {
    canv=document.getElementById("root");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    setInterval(game,1000/12);
}
px=py=10; //player position
gs=30
tc=30; //grid size
ax=ay=15; //goal
xv=yv=0; //velocities
trail=[];
tail = 1;
function game() {
    px+=xv;
    py+=yv;
    if(px<0) {
        px= tc-1;
    }
    if(px>tc-1) {
        px= 0;
    }
    if(py<0) {
        py= tc-1;
    }
    if(py>tc-1) {
        py= 0;
    }
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="lime";
    for(var i=0;i<trail.length;i++) {
      ctx.fillRect(trail[i].x*gs,trail[i].y*tc,gs-15,gs-15);
        if(trail[i].x==px && trail[i].y==py) {
            tail = 1;
        }
    }
    trail.push({x:px,y:py});
    while(trail.length>tail) {
    trail.shift();
    }

    if(ax==px && ay==py) {
        tail++;
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
    }
    ctx.fillStyle="red";
    ctx.fillRect(ax*gs,ay*tc,gs-15,gs-15);
}
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37: //left
            if(xv != 0.5){
                xv=-0.5;yv=0;
            }
            break;
        case 38: //up
            if(yv != 0.5){
                xv=0;yv=-0.5;
            }
            break;
        case 39: //right
            if(xv != -0.5){
                xv=0.5;yv=0;
            }
            break;
        case 40: //down
            if(yv != -0.5){
                xv=0;yv=0.5;
            }
            break;
    }
}
