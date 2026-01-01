
let craft = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let craft2 = [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];


let hit_bar = 0;
let hit_spot = [-1, -1];

let running = true;
function loop() {
  if (!running) return;

  let now = performance.now();
  let dt_now = (now - last) / 1000; // seconds since last frame
  last = now;

  if (dt_now > 1/20) dt_now = 1/60;

  if (time1 == 0) dt = dt_now;
  if (time1 > 0 && time1 < 10) dt = dt*0.75 + dt_now*0.25;


  time1 += 1;

  if (start) {
    let n = true;}

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // PLAY MODE
  
  if (stage === "play") {    
    if (mouse.x < 100 && mouse.y > 400 && mouse.y < 500 && mouse.held[0]) {
      stage = "paused";
    }
    render1 = true;

    if (keys["e"]) {
      open_inventory = true;
    }
    if (keys["r"]) {
      open_inventory = false;
    }

    if (!mouse.held[0]) hit_bar = 0;

    let slow = 1;
    let block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
    let block_posy = Math.floor(posy/SIZE) % MAP_SIZE;
    if (land[block_posx][block_posy][2] in collide) {
      slow = collide[land[block_posx][block_posy][2]];
    }
    slow = 1 - slow;    
    let lposy = posy;    
    if (keys["w"]) {
        posy -= 3*slow;
    }
    if (keys["s"]) {
        posy += 3*slow;
    }
    block_posy = Math.floor(posy/SIZE) % MAP_SIZE;
    block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
    let back = false;
    if (!(land[block_posx][block_posy][2] in collide)) {
      back = true;
    }
    if (back) {posy = lposy;} 
    let lposx = posx;    
    if (keys["a"]) {
        posx -= 3*slow;
    }
    if (keys["d"]) {
        posx += 3*slow;
    }    
    block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
    block_posy = Math.floor(posy/SIZE) % MAP_SIZE;    
    back = false;
    if (!(land[block_posx][block_posy][2] in collide)) {
      back = true;
    }
    if (back) {posx = lposx;}

    if (!open_inventory) {

      if (mouse.held[0] && courser == 0) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE) % MAP_SIZE;
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE) % MAP_SIZE;
        if (!(hit_spot[0] == block_posx && hit_spot[1] == block_posy)) {hit_bar = 0;}
        hit_spot[0] = block_posx;
        hit_spot[1] = block_posy;
        if (land[block_posx][block_posy][2] > 0) {
          if (hit_bar >= 100) {
            courser = land[block_posx][block_posy][2];
            land[block_posx][block_posy][2] = 0;
            hit_bar = 0;
            hit_spot = [-1, -1];
          } else {
            hit_bar += 100/hardness[land[block_posx][block_posy][2]];
          }
        }
      }
      if (mouse.held[2] && courser > 0) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE % MAP_SIZE);
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE % MAP_SIZE);
        if (land[block_posx][block_posy][2] == 0) {
          land[block_posx][block_posy][2] = courser;
          courser = 0;
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          if (mouse.x > i*70 + 70 && mouse.x < i*70 + 140 && mouse.y > j*70 + 70 && mouse.y < j*70 + 140) {
            if (mouse.held[0] && courser == 0) {
              courser = inventory[i][j];
              inventory[i][j] = 0;
            }
            if (mouse.held[2] && courser > 0 && inventory[i][j] == 0) {
              inventory[i][j] = courser;
              courser = 0;
            }
          }
        }
      }
    }
    
  }

  if (stage == "paused") render1 = true;


  // MAIN MENU

  if (stage == "menue") {
    
    ctx.fillStyle = "rgb(" + (time1 % 174)/174*255 + "," + (time1 % 152)/152*255 + ","  + (time1 % 197)/197*255 + ")";
    ctx.font = "125px Arial";          // font size and family
    ctx.fillText("Conquest of Power", 150, 200);

    ctx.fillStyle = "rgb(128, 0, 255)";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("By Michael Alexander Kaszynski", 400, 350);

    
    if (550 < mouse.x && mouse.x < 650 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play", 575, 500);
  }


  // RENDER GRAPICS IF REQUIRED
  
  if (render1) {
    for (let u = Math.floor(posx/SIZE) - 20; u < Math.floor(posx/SIZE) + 20; u++) {
      for (let v = Math.floor(posy/SIZE) - 10; v < Math.floor(posy/SIZE) + 10; v++) {
        let i = land[u % MAP_SIZE][v % MAP_SIZE];
        console.log(u)
        color1 = ((i[0] + i[1]) % ((i[0]**2 - i[1]**2 + 0.14) % 1.1))*0.125 + 0.75;
        color1 = 1/2 + color1/2;
        ctx.fillStyle = "rgb(" + colors[i[2]][0]*color1 + "," + colors[i[2]][1]*color1 + "," + colors[i[2]][2]*color1 + ")";
        ctx.fillRect(u*SIZE - posx + 600, v*SIZE - posy + 300, SIZE + 1, SIZE + 1);
      }
    }

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(600 - SIZE/4, 300 - SIZE/4, SIZE/2, SIZE/2);

    if (hit_bar > 0) {
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, 50, 10);

      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, hit_bar/2, 10);
    }

    if (open_inventory) {
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.fillRect(48, 48, 800, 227);

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = "rgb(200, 100, 0)";
        ctx.fillRect(70 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
        if (inventory[i][j] > 0) {
          ctx.fillStyle = "rgb(" + colors[inventory[i][j]][0] + "," + colors[inventory[i][j]][1] + "," + colors[inventory[i][j]][2] + ")";
          ctx.fillRect(70 + i*70, 70 + j*70, SIZE, SIZE);
        }
      }
    }
    ctx.fillStyle = "rgb(200, 100, 0)";
    ctx.fillRect(490 - 5, 140 - 5, SIZE + 10, SIZE + 10);

    ctx.fillStyle = "rgb(128, 128, 128)";
    ctx.fillRect(442, 150, 20, 20);

    if (craft[0] > 0) {
      ctx.fillStyle = "rgb(" + colors[craft[0]][0] + "," + colors[craft[0]][1] + "," +colors[craft[0]][2] + ")";
      ctx.fillRect(490 - 5, 140 - 5, SIZE + 10, SIZE + 10);
    }
    if (craft[1] > 0) {
      ctx.fillStyle = "rgb(" + colors[craft[1]][0] + "," + colors[craft[1]][1] + "," +colors[craft[1]][2] + ")";
      ctx.fillRect(595 - 5, 140 - 5, SIZE + 10, SIZE + 10);
    }
    
    }

    if (courser > 0) {
      ctx.fillStyle = "rgb(" + colors[courser][0] + "," + colors[courser][1] + "," + colors[courser][2] + ")";
      ctx.fillRect(mouse.x - SIZE/2, mouse.y - SIZE/2, SIZE, SIZE);
    }
    
    if (stage == "play") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
      ctx.fillRect(0, 400, 100, 100);
      
      ctx.fillStyle = "black";          // text color
      ctx.font = "15px Arial";          // font size and family
      ctx.fillText("Pause", 25, 450);
    }
  }

  //PAUSED

  if (stage == "paused") {
    if (100 > mouse.x && mouse.y < 400 && mouse.y > 300 && mouse.held[0]) {
      stage = "menue";
      start = true;
    }
    if (550 < mouse.x && mouse.x < 650 && 250 < mouse.y && mouse.y < 350 && mouse.held[0]) {
      stage = "play";
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(0, 300, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Main Menu", 25, 350);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 250, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Unpause", 575, 300);
  }

  render1 = false;

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
