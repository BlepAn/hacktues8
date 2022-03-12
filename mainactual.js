let myX = 780, myY = 430, myW = 25, myH = 50;
let direction = [2];
let ironrockX = 440, ironrockY = 50;
let fuelX = 188, fuelY = 141;
let pickaxeX = 910, pickaxeY = 560;
let plan1X = 500, plan1Y = 560;
let plan2X = 1052, plan2Y = 117;

let touchiron = false, gotiron = false;
let touchfuel = false, gotfuel = false;
let touchplan1 = false, gotplan1 = false;
let touchplan2 = false, gotplan2 = false;
let touchpickaxe = false, gotpickaxe = false;
let touchrocket = false;
let finish = true;

let fuel = 0; pick = 0, plan = 0, iron = 0;

let final = false, rocketgo = false;



function update() {

   //basic movements

   direction = ["0", "0"];


   if (isKeyPressed[87]) {
      myY -= 2;
      direction[1] = "up";
   }

   if (isKeyPressed[83]) {
      myY += 2;
      direction[1] = "down";
   }

   if (isKeyPressed[68]) {
      myX += 2;
      direction[2] = "right";
   }

   if (isKeyPressed[65]) {
      myX -= 2;
      direction[2] = "left";
   }
   //checking collision 
   if (areColliding(myX, myY, myW, myH, 95, 30, 10, 160)) { 
      if (direction[2] == "left") {
         myX += 2;
      }
      if (direction[2] == "right") {
         myX -= 2;
      }
      if (direction[1] == "up") {
         myY += 2;
      }
      if (direction[1] == "down") {
         myY -= 2;
      }
   }

   if (areColliding(myX, myY, myW, myH, 95, 180, 310, 10)) {
      if (direction[1] == "up") {
         myY += 2;
      }
      if (direction[1] == "down") {
         myY -= 2;
      }
      if (direction[2] == "left") {
         myX += 2;
      }
      if (direction[2] == "right") {
         myX -= 2;
      }
   }

   if (areColliding(myX, myY, myW, myH, 95, 30, 310, 10)) {
      if (direction[1] == "up") {
         myY += 2;
      }
      if (direction[1] == "down") {
         myY -= 2;
      }
      if (direction[2] == "left") {
         myX += 2;
      }
      if (direction[2] == "right") {
         myX -= 2;
      }
   }

   if (areColliding(myX, myY, myW, myH, 395, 30, 10, 75)) {
      if (direction[1] == "up") {
         myY += 2;
      }
      if (direction[1] == "down") {
         myY -= 2;
      }
      if (direction[2] == "left") {
         myX += 2;
      }
      if (direction[2] == "right") {
         myX -= 2;
      }
   }


   //collision between items and char
   if (areColliding(myX, myY, myW, myH, plan1X, plan1Y, 20, 20)) {
      touchplan1 = true;
   } else touchplan1 = false

   if (areColliding(myX, myY, myW, myH, plan2X, plan2Y, 20, 20)) {
      touchplan2 = true;
   } else touchplan2 = false

   if (areColliding(myX, myY, myW, myH, fuelX, fuelY, 20, 20)) {
      touchfuel = true;
   } else touchfuel = false;

   if (areColliding(myX, myY, myW, myH, pickaxeX, pickaxeY, 20, 20)) {
      touchpickaxe = true;
   } else touchpickaxe = false;

   if (areColliding(myX, myY, myW, myH, ironrockX, ironrockY, 20, 20)) {
      touchiron = true;
   } else touchiron = false;

   if (areColliding(myX, myY, myW, myH, 850, 480, 200, 220)) {
      touchrocket = true;
   } else touchrocket = false;


   //text
   if (gotpickaxe == true) {
      if (plan == 2) {
         alert("I can use this to break the rock! :D");
      }
      gotpickaxe = false;
   }

   if (gotiron == true) {
      if (pick == 0) {
         alert("Oh, it's just a rock...");
      } else if (pick == 1) {
         alert("I can fix the rocket with this iron!");
      }
      gotiron = false;
   }

   if (gotfuel == true) {
      alert("What's fuel doing here? Oh well, it's useful");
      gotfuel = false;
   }

   if (gotplan1 == true || gotplan2 == true) {
      if (plan == 1) {
         alert("A part of the plan!");
         gotplan1 = false;
         gotplan2 = false;
      }
      if (plan == 2) {
         alert("I have the whole plan now! I should check out the rocket for instruments");
         gotplan1 = false;
         gotplan2 = false;
      }
   }
   if (fuel == 1 && iron == 1 && plan == 2 && finish == true) {
      alert("I have everything I need! I can go home now.");
      finish = false;
   }
   if(rocketgo== true){
    /// dai muuuuuu nai tvato endinga nz opravqi se :)




    //// ZABELEZHI GO UWU OWO ÚoÙ ÙWÚ 
   }


   //BORDERS

   if (myX >= 1600) {
      myX -= 2;
   }
   if (myX <= 0) {
      myX += 2;
   }
   if (myY >= 800) {
      myY -= 2;
   }
   if (myY <= 0) {
      myY += 2;
   }


}

function draw() {


   drawImage(mars, 0, 0, 1640, 940);
   drawImage(room, 95, 40, 300, 140);
   drawImage(astronaut, myX, myY, myW, myH);


   //1housedrawing
   context.fillStyle = 'black';
   context.fillRect(95, 30, 10, 160); //left
   context.fillStyle = 'black';
   context.fillRect(95, 180, 310, 10); //bottom
   context.fillStyle = 'black';
   context.fillRect(95, 30, 310, 10); // top
   context.fillStyle = 'black';
   context.fillRect(395, 30, 10, 75); //right

   //parts!
   drawImage(rockwithiron, ironrockX, ironrockY, 70, 50);
   drawImage(fueltank, fuelX, fuelY, 25, 30);
   drawImage(backgroundfuel, 220, 155, 40, 25);
   drawImage(fakepart[3], pickaxeX, pickaxeY, 50, 50)
   drawImage(rocket, 850, 480, 200, 220);
   drawImage(fakepart[2], plan1X, plan1Y, 30, 30);
   drawImage(fakepart[2], plan2X, plan2Y, 30, 30);

}

function keyup(key) {
   console.log("Pressed", key);
   if (key == 69) {
      if (touchpickaxe == true) {
         gotpickaxe = true;
         if (plan == 2) {
            pickaxeX = -1000000;
            pickaxeY = -1000000;
            pick++;
         }
      }
      if (touchiron == true) {
         gotiron = true;
         if (pick == 1) {
            ironrockX = -1000000;
            ironrockY = -1000000;
            iron++;
         }
      }
      if (touchfuel == true) {
         gotfuel = true;
         fuelX = -1000000;
         fuelY = -1000000;
         fuel++;
      }
      if (touchplan1 == true) {
         gotplan1 = true;
         plan1X = -1000000;
         plan1Y = -1000000;
         plan++;
      }
      if (touchplan2 == true) {
         gotplan2 = true;
         plan2X = -100000;
         plan2Y = -100000;
         plan++;
      }
      if(touchrocket == true ){
         rocketgo = true;
      }
   }
}

function mouseup() {
   console.log("Mouse clicked at", mouseX, mouseY);
}


