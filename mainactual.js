/*
localStorage.setItem(cell, data); - saves something
localStorage.getItem(cell); - returns whatever was saved
localStorage.removeItem(cell); - remove 1 item
localStorage.clear(); - wipe the whole thing
JSON.stringify(array); - convert variable to string (returns it)
JSON.parse(string); - convert stingified variable back to normal (returns it)
*/
setFullscreen();
let w = canvas.width, h = canvas.height;
let cam = {x: 0, y: 0};
let me = {
    x: w/2 - 25, y: h/2 - 25, size: 50, dx: 0, dy: 0, 
    gold: 0, wood: 0, stone: 0, conveyors:0, traps: 0,
    axe: {durability: 10}, 
    woodenPickaxe: {durability: 0}, 
    stonePickaxe: {durability: 0},
    bow: {durability: 20, charged: false, equipped: false, isFiring: false},
    health: 100,
};
me.bow.arrows = [];
me.bow.arrowLength = me.size*3;
//me.bow.arrows.push({x: me.x + me.size/2, y: me.y + me.size/2});
let str = [], ore = [];
let atMarket = false, buildMode = false;
let conveyorRotation = 'north';
let north = tryToLoad("arrowUp");
let south = tryToLoad("arrowDown");
let east = tryToLoad("arrowRight");
let west = tryToLoad("arrowLeft");
let trap = tryToLoad("spike");
let dmgTimer = 0, trapped = false;
let en = [], spawnTimer = 0, timeOfDay = 0; //using the same time values as Minecraft

//world border
str[0] = {
    type: 'wall',
    x: -100000,
    y: -10000,
    w: 600000,
    h: 50
};
str[1] = {
    type: 'wall',
    x: 10000,
    y: -100000,
    w: 50,
    h: 600000
};
str[2] = {
    type: 'wall',
    x: -100000,
    y: 10000,
    w: 600000,
    h: 50
};
str[3] = {
    type: 'wall',
    x: -10000,
    y: -100000,
    w: 50,
    h: 600000
};
str[4] = {
    type: 'spawner',
    x: -9950,
    y: 9900,
    w: 100,
    h: 100,
};
str[5] = {
    type: 'spawner',
    x: 9950,
    y: 9950,
    w: 100,
    h: 100,
};
str[6] = {
    type: 'spawner',
    x: -9950,
    y: -9950,
    w: 100,
    h: 100,
};
str[7] = {
    type: 'spawner',
    x: 9900,
    y: -9950,
    w: 100,
    h: 100,
};

function spawn(){
    for(let i of str){
        if(i.type == 'spawner'){
            en[en.length] = {
                x: i.x,
                y: i.y,
                health: toolbox.randInt(20, 100),
                dmg: toolbox.randInt(5, 20)
            };
            en[en.length - 1].size = en[en.length - 1].health;
        }
    }
}


function update(){
me.bow.direction = Math.atan2(mouseY - (me.y + me.size/2 - cam.y), mouseX - (me.x + me.size/2 - cam.x));

//arrow movement
for(let i of me.bow.arrows){
    i.x += Math.cos(i.direction)*me.size/2;
    i.y += Math.sin(i.direction)*me.size/2;
}

/*
A = 150*sin(me.bow.direction)
B = 150*cos(me.bow.direction)
(x+B, y+A)
*/

//collision between arrow and enemy
for(let i of en){
    for(let j of me.bow.arrows){
        if(areColliding(
            i.x, i.y, i.size, i.size,
            j.x + (me.bow.arrowLength*Math.cos(j.direction)), j.y + (me.bow.arrowLength*Math.sin(j.direction)), 1, 1)){
            console.log(en.length, me.bow.arrows.length);
            console.log(en, me.bow.arrows);
            en.splice(en.indexOf(i), 1);
            me.bow.arrows.splice(me.bow.arrows.indexOf(j), 1);
            console.log(en.length, me.bow.arrows.length);
            console.log(en, me.bow.arrows);
        }
    }
}

//collision between player and enemy
/*
for(let i of en){
    if(areColliding(i.x, i.y, i.size, i.size, me.x, me.y, me.size, me.size))console.log("pizdec");
}
*/

if(trapped)dmgTimer++;
spawnTimer++;
timeOfDay++;
if(dmgTimer > 50)dmgTimer = 0;
if(timeOfDay >= 24000)timeOfDay = 0;
if(spawnTimer == 1000){
    if(timeOfDay > 12000)spawn();
    spawnTimer = 0;
}

//player movement (with acceleration)
if(isKeyPressed[key_w] && me.dy > -4)me.dy -= 0.1;
if(isKeyPressed[key_s] && me.dy < 4)me.dy += 0.1;
if(isKeyPressed[key_a] && me.dx > -4)me.dx -= 0.1;
if(isKeyPressed[key_d] && me.dx < 4)me.dx += 0.1;
if(!isKeyPressed[key_w] && !isKeyPressed[key_s])me.dy -= me.dy/50;
if(!isKeyPressed[key_a] && !isKeyPressed[key_d])me.dx -= me.dx/50;

toolbox.recordPosition(me.x, me.y);

me.x += me.dx;
me.y += me.dy;

cam.x += (me.x - w/2 - cam.x)/20;
cam.y += (me.y - h/2 - cam.y)/20;

//enemy movement
for(let i of en){
    i.x += (me.x - i.x)/500;
    i.y += (me.y - i.y)/500;
}

/*
if(areColliding(me.x, me.y, me.size, me.size, str[0].x, str[0].y, str[0].w, str[0].h))me.y += 10;
if(areColliding(me.x, me.y, me.size, me.size, str[1].x, str[1].y, str[1].w, str[1].h))me.x -= 10;
if(areColliding(me.x, me.y, me.size, me.size, str[2].x, str[2].y, str[2].w, str[2].h))me.y -= 10;
if(areColliding(me.x, me.y, me.size, me.size, str[3].x, str[3].y, str[3].w, str[3].h))me.x += 10;
*/
for(let i of str){
    if(areColliding(me.x, me.y, me.size, me.size, i.x, i.y, i.w, i.h)){
        switch(i.type){
            case 'wall':
                me.dx -= 2*me.dx;
                me.dy -= 2*me.dy;
                break;
            case 'conveyor':
                switch(i.facing){
                    case 'north':
                        me.x = i.x;
                        me.dx = 0;
                        me.dy = -8;
                        break;
                    case 'south':
                        me.x = i.x;
                        me.dx = 0;
                        me.dy = 8;
                        break;
                    case 'east':
                        me.y = i.y;
                        me.dx = 8;
                        me.dy = 0;
                        break;
                    case 'west':
                        me.y = i.y;
                        me.dx = -8;
                        me.dy = 0;
                        break;
                }
                break;
            case 'trap':
                trapped = true;
                if(dmgTimer == 50){
                    me.health -= 10;
                    dmgTimer = 0;
                    trapped = false;
                }
                break;
        }
    }
}

for(let i of ore){
    if(areColliding(me.x, me.y, me.size, me.size, i.x, i.y, 100, 100) && i.type != undefined){
        me.dx -= 2*me.dx;
        me.dy -= 2*me.dy;
    }
}

if(areColliding(me.x, me.y, me.size, me.size, 3500, 3500, 500, 500))atMarket = true;
else atMarket = false;
}

function draw(){
//background
if(timeOfDay < 12000)context.fillStyle = '#B22222';
if(timeOfDay > 12000)context.fillStyle = '#800000';
context.fillRect(0, 0, w, h);

//ores
for(let i of ore){
    switch(i.type){
        case 'wood':
            context.fillStyle = '#935116';
            break;
        case 'stone':
            context.fillStyle = 'grey';
            break;
        case 'gold':
            context.fillStyle = 'yellow';
            break;
        case undefined:
            context.fillStyle = 'green';
            break;
    }
    context.fillRect(i.x - cam.x, i.y - cam.y, 100, 100);
}

//structures
for(let i of str){
    switch(i.type){
        case 'wall':
            context.fillStyle = 'red';
            context.fillRect(i.x - cam.x, i.y - cam.y, i.w, i.h);
            break;
        case 'conveyor':
            context.fillStyle = 'red';
            context.fillRect(i.x - cam.x, i.y - cam.y, i.w, i.h);
            switch(i.facing){
                case 'north':
                    drawImage(north, i.x - cam.x, i.y - cam.y, i.w, i.h);
                    break;
                case 'south':
                    drawImage(south, i.x - cam.x, i.y - cam.y, i.w, i.h);
                    break;
                case 'east':
                    drawImage(east, i.x - cam.x, i.y - cam.y, i.w, i.h);
                    break;
                case 'west':
                    drawImage(west, i.x - cam.x, i.y - cam.y, i.w, i.h);
                    break;
            }
            break;
        case 'trap':
            drawImage(trap, i.x - cam.x, i.y - cam.y, i.w, i.h);
            break;
        case 'spawner':
            context.fillStyle = 'purple';
            context.fillRect(i.x - cam.x, i.y - cam.y, i.w, i.h);
            break;
    }
}

//transparent building helpline
if(buildMode){
    context.fillStyle = 'red';
    context.globalAlpha = 0.7;
    context.fillRect(me.x - cam.x - 75, me.y - cam.y - 75, 50, 50);
    context.globalAlpha = 1;
}

//market
context.fillStyle = 'black';
context.fillRect(3500 - cam.x, 3500 - cam.y, 500, 500);
context.fillStyle = 'orange';
context.font = '150px Liebe Ist Für Alle Da';
context.fillText('MARKET', 3500 - cam.x, 3800 - cam.y, 500);

//enemies
context.fillStyle = 'purple';
for(let i of en){
    context.fillRect(i.x - cam.x, i.y - cam.y, i.size, i.size);
}

//player
context.fillStyle = 'blue';
context.fillRect(me.x - cam.x, me.y - cam.y, me.size, me.size);

//player's bow and arrows
if(me.bow.equipped){
    context.beginPath();
    context.arc(
        me.x + me.size/2 - cam.x, 
        me.y + me.size/2 - cam.y, 
        me.size*2, 
        me.bow.direction - Math.PI/4, 
        Math.PI/4 + me.bow.direction
    );
    context.lineWidth = 5;
    context.strokeStyle = '#935116';
    if(!me.bow.charged)context.closePath();
    else{
        context.lineTo(me.x + me.size/2 - cam.x, me.y + me.size/2 - cam.y);
        context.closePath();
    }
    context.stroke();
    if(me.bow.charged){
        context.beginPath();
        context.moveTo(me.x + me.size/2 - cam.x, me.y + me.size/2 - cam.y);
        context.lineTo(
            me.x + me.size/2 + Math.cos(me.bow.direction)*me.bow.arrowLength - cam.x, 
            me.y + me.size/2 + Math.sin(me.bow.direction)*me.bow.arrowLength - cam.y
        );
        context.stroke();
    }
    for(let i of me.bow.arrows){
        context.beginPath();
        context.moveTo(i.x - cam.x, i.y - cam.y);
        context.lineTo(i.x + Math.cos(i.direction)*me.bow.arrowLength - cam.x, i.y + Math.sin(i.direction)*me.bow.arrowLength - cam.y);
        context.stroke();
    }
}

//text
context.fillStyle = 'orange';
context.font = '50px Liebe Ist Für Alle Da';
context.fillText('Wood: ', 100, 50);
context.fillText(me.wood, 250, 50);
context.fillText('Stone: ', 100, 110);
context.fillText(me.stone, 250, 110);
context.fillText('Gold: ', 100, 170);
context.fillText(me.gold, 250, 170);
context.fillText('Axe Durability: ', w - 700, 50);
context.fillText(me.axe.durability, w - 115, 50);
context.fillText('Wooden Pickaxe Durability: ', w - 700, 110);
context.fillText(me.woodenPickaxe.durability, w - 100, 110);
context.fillText('Stone Pickaxe Durability: ', w - 700, 170);
context.fillText(me.stonePickaxe.durability, w - 100, 170);

//game over
if(me.health <= 0){
    pauseUpdate();
    context.fillStyle = '#ff0000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, w, h);
    context.fillStyle = 'white';
    context.font = '200px Liebe Ist Für Alle Da';
    context.fillText('GAME OVER', w/2 - 450, h/2, 900);
}
}

function keydown(key){

    //mining
    for(let i in ore){
        if(areColliding(me.x, me.y, me.size, me.size, ore[i].x - 50, ore[i].y - 50, 200, 200)){
            if(key == 49 && me.axe.durability > 0 && ore[i].type == 'wood'&& me.bow.equipped == false){
                me.wood++;
                me.axe.durability--;
                ore.splice(i, 1);
            }
            if(key == 50 && me.woodenPickaxe.durability > 0 && ore[i].type == 'stone' && me.bow.equipped == false){
                me.stone++;
                me.woodenPickaxe.durability--;
                ore.splice(i, 1);
            }
            if(key == 50 && me.stonePickaxe.durability > 0 && ore[i].type == 'stone' && me.bow.equipped == false){
                me.stone++;
                me.stonePickaxe.durability--;
                ore.splice(i, 1);
            }
            if(key == 51 && me.stonePickaxe.durability > 1 && ore[i].type == 'gold' && me.bow.equipped == false){
                me.gold++;
                me.stonePickaxe.durability -= 2;
                ore.splice(i, 1);
            }
        }
    }

    //crafting
    if(key == 49 && isKeyPressed[18] && me.wood >= 2 && me.stone >= 3){
        me.wood -= 2;
        me.stone -= 3;
        me.axe.durability += 10;
    }
    if(key == 50 && isKeyPressed[18] && me.wood >= 5){
        me.wood -= 5;
        me.woodenPickaxe.durability += 10;
    }
    if(key == 51 && isKeyPressed[18] && me.wood >= 2 && me.stone >= 4){
        me.wood -= 2;
        me.stone -= 5;
        me.stonePickaxe.durability += 10;
    }
    if(key == 52 && me.stone >= 1 && !isKeyPressed[18]){
        me.stone--;
        str[j] = {
            type: 'wall',
            x: me.x - 75,
            y: me.y - 75,
            w: 50,
            h: 50
        };
        j++;
    }

    //purchasing
    if(atMarket && key == 49 /* 1 */ && me.gold == 1){
        me.gold--;
        me.conveyors++;
    }
    if(atMarket && key == 50 /* 2 */ && me.gold == 2){
        me.gold -= 2;
        me.traps++;
    }

    //placing conveyors
    if(!atMarket && key == 8 /* Backspace */ && me.conveyors > 0){
        me.conveyors--;
        str[str.length] = {
            type: 'conveyor',
            facing: conveyorRotation,
            x: me.x - 75,
            y: me.y - 75,
            w: 50,
            h: 50
        };
    }

    //placing traps
    if(!atMarket && key == 52 /* 4 */ && isKeyPressed[18] /* Alt */ && me.traps > 0){
        me.traps--;
        str[str.length] = {
            type: 'trap',
            x: me.x - 75,
            y: me.y - 75,
            w: 50,
            h: 50
        };
    }
    //transparent building helpline
    if(key == 13 /* Enter */)buildMode = !buildMode;

    //conveyor rotation
    if(key == 37/* Left */)conveyorRotation = 'west';
    if(key == 38/* Up */)conveyorRotation = 'north';
    if(key == 39/* Right */)conveyorRotation = 'east';
    if(key == 40/* Down */)conveyorRotation = 'south';

    //save and load game
    if(key == 36 /* Home */){
        let save = prompt('Choose save name:');
        toolbox.save(me, save + 'me');
        toolbox.save(str, save + 'str');
        toolbox.save(ore, save +'ore');
    }
    if(key == 35 /* End */){
        let restore = prompt('Select save to load from:');
        me = toolbox.restore(restore + 'me');
        str = toolbox.restore(restore + 'str');
        ore = toolbox.restore(restore + 'ore');
    }

    //equip/unequip bow
    if(key == 53 /* 5 */)me.bow.equipped = !me.bow.equipped;
}

function mousedown(){
me.bow.charged = true;
me.bow.arrows.x = me.x + me.size/2;
me.bow.arrows.y = me.y + me.size/2;
}

function mouseup(){
me.bow.charged = false;
if(me.bow.equipped)me.bow.arrows.push({x: me.x + me.size/2, y: me.y + me.size/2, direction: me.bow.direction});
}
