let myX = 790, myY = 420;
let houseX=210, houseY=70;
let npcX =900, npcY=200;

function update() {

                 //basic movements
 if(isKeyPressed[87]){
    myY-=4;
 }
 if(isKeyPressed[83]){
    myY+=4;
 }
 if(isKeyPressed[68]){
    myX+=4;
 }
 if(isKeyPressed[65]){
    myX-=4;
 }
}

function draw() {
    drawImage(backStars, 0, 0, 1640, 940);
    drawImage(femaleAction, myX, myY, 60, 80);
    drawImage(buildingTile[0], houseX, houseY, 100, 120);
    drawImage(heroStand,npcX,npcY,60,80);
}

function keyup(key) {
    console.log("Pressed", key);
}

function mouseup() {
    console.log("Mouse clicked at", mouseX, mouseY);
}
