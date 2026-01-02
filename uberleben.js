const canvas = document.createElement("canvas");
canvas.width = 1400;
canvas.height = 700;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scale = window.devicePixelRatio || 1;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px" + 100;
  canvas.width = w * scale;
  canvas.height = h * scale + 100;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

let AIR = 0;
let GRASS = 1;
let LOG = 2;
let STONE = 3;
let WATER = 4;
let PLANKS = 5;
let STICKS = 6;
let COPPER_ORE = 7;
let TIN_ORE = 8;
let WORKBENCH = 9;
let FURNACE = 10;
let FORGE = 11;
let FLAME = 12;
let COMPRESSED_GRASS = 13;
let COAL = 14;

let MAP_SIZE = 300;

let colors = {0: [0, 200, 0], 1: [0, 150, 0], 2: [100, 64, 0], 3: [128, 128, 128], 4: [0, 0, 255], 5: [200, 128, 0], 6: [150, 50, 0], 7: [200, 150, 75], 8: [175, 175, 150], 9: [150, 100, 0], 10: [100, 100, 100], 11: [60, 60, 60], 12: [255, 128, 0], 13: [0, 100, 0], 14: [0, 0, 0]}

let hardness = {1: 10, 2: 100, 3: 500, 4: 1000, 5: 100, 6: 20, 7: 600, 8: 550, 9: 50, 10: 250, 11: 1000, 12:1, 13:20, 14: 300}

let names = {0: "air", 1: "grass", 2: "log", 3: "stone", 4: "water", 5: "planks", 6: "stick", 7: "copper ore", 8: "tin ore", 9: "work bench", 10: "furnace", 11: "forge", 12: "flames", 13: "compressed grass", 14: "coal"}

let collide = {0: 0, 1: 0.4, 4: 0.7, 12: 0.85}

let SIZE = 40;

let seed = [];
for (let i = 0; i < 20; i++) {
  seed.push(
        [
          (Math.random() ** 2 * 30 + 2) / 4,
            Math.random() * 100,
            Math.random() * 100,
        ]
  );
}

land = []
for (let i = 0; i < MAP_SIZE; i++) {

  let column = [];
  for (let j = 0; j < MAP_SIZE; j++) {
    let height = 0
    for (let k of seed) {
      height += Math.sin(((i/5 - 30) * Math.sin(k[2]) + (j/5 - 15) * Math.cos(k[2])) / k[0] + k[1]);
    }
    let height2 = 0
    for (let k of seed) {
      height2 += Math.sin(((i/10 + 100000 - 30) * Math.sin(k[2]) + (j/10 - 15) * Math.cos(k[2])) / k[0] + k[1]);
    }
    if (-0.5 < height2 && height2 < 0.5) {
      column.push([i, j, WATER]);
    } else if (height > 3) {
      if (Math.random() < 0.02) {
        column.push([i, j, COPPER_ORE]);
      } else if (Math.random() < 0.025) {
        column.push([i, j, TIN_ORE]);
      } else if (Math.random() < 0.035) {
        column.push([i, j, COAL]);
      } else {
        column.push([i, j, STONE]);
      }
    } else if (Math.random() < 0.03) {
      column.push([i, j, LOG]);
    } else if (Math.random() < 0.2) {
      column.push([i, j, GRASS]);
    } else {
      column.push([i, j, AIR]);
    }
  }
  land.push(column);
}

let posx = 80001000;
let posy = 80001000;

//resize();
//window.addEventListener("resize", resize);

let last = performance.now();

let render1 = false;

let open_inventory = false;

let keys = {};
let mouse = {x: 0, y: 0, held: [false, false, false]};

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function only_positive(numb) {
  if (numb >= 0) {
    return numb;
  } else {
    return 0;
  }
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

canvas.addEventListener("contextmenu", e => e.preventDefault());

function draw_circle(x, y, radius, color1) {
  ctx.fillStyle = color1;        // color
  ctx.beginPath();              // start a new path
  ctx.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("touchstart", e => {
  let t = e.touches[0];
  mouse.x = t.clientX - canvas.getBoundingClientRect().left;
  mouse.y = t.clientY - canvas.getBoundingClientRect().top;
  mouse.held[0] = true;
  e.preventDefault();
});

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("touchmove", e => {
  let touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
  e.preventDefault();
});

canvas.addEventListener("touchend", e => {
  mouse.held[0] = false;
  e.preventDefault();
});

canvas.addEventListener("mousedown", e => mouse.held[e.button] = true);
canvas.addEventListener("mouseup", e => mouse.held[e.button] = false);

let dt = 0.016;

let start = true;

let time1 = 0;

let stage = "menue";

let held = false;

let courser = 0;
let inventory = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let craft = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

let craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];

function same(recipy, craft1) {
  let same1 = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (recipy[i][j] != craft1[i][j]) same1 = false;
      console.log(i, j);
    }
  }
  return same1;
}

crafts = [];
crafts.push([[[LOG, 0, 0], [0, 0, 0], [0, 0, 0]], [[PLANKS, 0, 0], [PLANKS, 0, 0], [0, 0, 0]], 30]);
crafts.push([[[PLANKS, PLANKS, 0], [0, 0, 0], [0, 0, 0]], [[STICKS, STICKS, 0], [STICKS, STICKS, 0], [0, 0, 0]], 30]);
crafts.push([[[PLANKS, 0, 0], [0, 0, 0], [0, 0, 0]], [[WORKBENCH, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[STONE, STONE, 0], [STONE, STONE, 0], [0, 0, 0]], [[FURNACE, 0, 0], [0, 0, 0], [0, 0, 0]], 200]);
crafts.push([[[GRASS, GRASS, 0], [GRASS, GRASS, 0], [0, 0, 0]], [[COMPRESSED_GRASS, 0, 0], [0, 0, 0], [0, 0, 0]], 30]);
crafts.push([[[0, 0, 0], [PLANKS, 0, PLANKS], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[0, 0, 0], [COMPRESSED_GRASS, 0, COMPRESSED_GRASS], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[0, 0, 0], [0, 0, COAL], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, FLAME], [0, 0, 0]], 50]);

let hit_bar = 0;
let hit_spot = [-1, -1];

let craft_bar = 0;

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

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // PLAY MODE
  
  if (stage === "play") {
    if (mouse.x < 100 && mouse.y > 400 && mouse.y < 500 && mouse.held[0]) {
      stage = "paused";
    }
    render1 = true;

    if (!keys["e"] && !mouse.held[0]) held = false;

    if (keys["e"] && !held) {
      if (!open_inventory) {open_inventory = true;} else {
        let no_craft = true;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (craft[i][j] > 0) {no_craft = false;}
          }
        }
        if (no_craft) open_inventory = false;
        craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];
        craft_bar = 0;
      }
      held = true;
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
      if (mouse.held[2] && courser == 0) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE) % MAP_SIZE;
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE) % MAP_SIZE;
        if (land[block_posx][block_posy][2] == WORKBENCH) {
          open_inventory = true;
          craft2 = [[1, 1, 0], [1, 1, 0], [0, 0, 0]];
        }
        if (land[block_posx][block_posy][2] == FURNACE) {
          open_inventory = true;
          craft2 = [[0, 0, 0], [1, 0, 1], [0, 0, 0]];
        }
        if (land[block_posx][block_posy][2] == FORGE) {
          open_inventory = true;
          craft2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
        }
      }

      if (mouse.held[0]) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE) % MAP_SIZE;
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE) % MAP_SIZE;
        if (!(hit_spot[0] == block_posx && hit_spot[1] == block_posy)) {hit_bar = 0;}
        hit_spot[0] = block_posx;
        hit_spot[1] = block_posy;
        if (land[block_posx][block_posy][2] > 0) {
          if (hit_bar >= 100) {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 3; j++) {
                if (inventory[i][j] == 0) {
                  inventory[i][j] = land[block_posx][block_posy][2];
                  land[block_posx][block_posy][2] = 0;
                }
              }
            }
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
        let cur_type = courser;
        if (land[block_posx][block_posy][2] == 0) {
          land[block_posx][block_posy][2] = courser;
          courser = 0;
          let found1 = true;
          for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
              if (inventory[i][j] == cur_type && found1) {
                inventory[i][j] = 0;
                courser = cur_type;
                found1 = false;
              }
            }
          }
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
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (mouse.x > i*70 + 490 && mouse.x < i*70 + 560 && mouse.y > j*70 + 70 && mouse.y < j*70 + 140 && craft2[i][j] == 1) {
            if (mouse.held[0] && courser == 0) {
              courser = craft[i][j];
              craft[i][j] = 0;
            }
            if (mouse.held[2] && courser > 0 && craft[i][j] == 0) {
              craft[i][j] = courser;
              courser = 0;
            }
          }
        }
      }

      if (keys["c"]) {
        let s = true;
        for (let m of crafts) {
          if (same(m[0], craft)) {
            if (craft_bar >= 100) {
              craft_bar = 0;
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                  craft[i][j] = m[1][i][j];
                }
              }
            } else {
              craft_bar += 100/m[2];
            }
          } else {s = false;}
        }
        if (s) craft_bar = 0;
      } else {craft_bar = 0;}
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
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (craft2[i][j] == 1) {
          ctx.fillStyle = "rgb(200, 100, 0)";
          ctx.fillRect(490 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
          if (craft[i][j] > 0) {
            ctx.fillStyle = "rgb(" + colors[craft[i][j]][0] + "," + colors[craft[i][j]][1] + "," + colors[craft[i][j]][2] + ")";
            ctx.fillRect(490 + i*70, 70 + j*70, SIZE, SIZE);
          }
        }
      }
    }

    if (craft_bar > 0) {
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(430, 150, 50, 10);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(430, 150, craft_bar/2, 10);
    }

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
