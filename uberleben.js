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

ctx.imageSmoothingEnabled = false;

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
let TIN = 15;
let COPPER = 16;
let WOODEN_AXE = 17;
let STONE_AXE = 18;
let TIN_AXE = 19;
let COPPER_AXE = 20;
let WOODEN_PICKAXE = 21;
let STONE_PICKAXE = 22;
let TIN_PICKAXE = 23;
let COPPER_PICKAXE = 24;
let MEAT = 25;
let COOKED_MEAT = 26;
let WOODEN_SWORD = 27;
let STONE_SWORD = 28;
let TIN_SWORD = 29;
let COPPER_SWORD = 30;


let CHICKEN = 0;
let RABBIT = 1;

let MAP_SIZE = 300;

let hardness = {1: 10, 2: 200, 3: 500, 4: 1000, 5: 200, 7: 600, 8: 550, 9: 100, 10: 250, 11: 1000, 13: 20, 14: 300}

let names = {0: "air", 1: "grass", 2: "log", 3: "stone", 4: "water", 5: "planks", 6: "sticks", 7: "copper ore", 8: "tin ore", 9: "work bench", 10: "furnace", 11: "forge", 12: "flame", 13: "compressed grass", 14: "coal", 15: "tin", 16: "copper", 17: "wooden axe", 18: "stone axe", 19: "tin axe", 20: "copper axe", 21: "wooden pickaxe", 22: "stone pickaxe", 23: "tin pickaxe", 24: "copper pickaxe", 25: "raw meat", 26: "cooked meat", 27: "wooden sword", 28: "stone sword", 29: "tin sword", 30: "copper sword"}

let foods = {25: 10, 26: 25}

const images = ["air.png", "grass.png", "log.png", "stone.png", "water.png", "planks.png", "sticks.png", "copper_ore.png", "tin_ore.png", "workbench.png", "furnace.png", "forge.png", "flame.png", "compressed_grass.png", "coal.png", "tin.png", "copper.png", "wooden_axe.png", "stone_axe.png", "tin_axe.png", "copper_axe.png", "wooden_pickaxe.png", "stone_pickaxe.png", "tin_pickaxe.png", "copper_pickaxe.png", "meat.png", "cooked_meat.png", "wooden_sword.png", "stone_sword.png", "tin_sword.png", "copper_sword.png"].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const animal_imgs = ["chicken.png", "rabbit.png"].map(src => {
  const img2 = new Image();
  img2.src = src;
  return img2;
});

let collide = {0: 0, 1: 0.4, 4: 0.7}

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
      column.push([i, j, WATER, 1]);
    } else if (height > 3) {
      if (Math.random() < 0.02 && height > 3.5) {
        column.push([i, j, COPPER_ORE, 1]);
      } else if (Math.random() < 0.025 && height > 3.5) {
        column.push([i, j, TIN_ORE, 1]);
      } else if (Math.random() < 0.035 && height > 3.7) {
        column.push([i, j, COAL, 1]);
      } else {
        column.push([i, j, STONE, 1]);
      }
    } else if (Math.random() < 0.03) {
      column.push([i, j, LOG, 1]);
    } else if (Math.random() < 0.2) {
      column.push([i, j, GRASS, 1]);
    } else {
      column.push([i, j, AIR, 1]);
    }
  }
  land.push(column);
}

let animals = [];

let posx = 80001000;
let posy = 80001000;

let health = 100;
let hunger = 100;

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
crafts.push([[[0, 0, 0], [TIN_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [TIN, 0, 0], [0, 0, 0]], 200]);
crafts.push([[[0, 0, 0], [COPPER_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [COPPER, 0, 0], [0, 0, 0]], 300]);
crafts.push([[[0, 0, 0], [MEAT, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [COOKED_MEAT, 0, 0], [0, 0, 0]], 400]);

crafts.push([[[PLANKS, STICKS, 0], [PLANKS, PLANKS, 0], [0, 0, 0]], [[WOODEN_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[STONE, STICKS, 0], [STONE, STONE, 0], [0, 0, 0]], [[STONE_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[TIN, STICKS, 0], [TIN, TIN, 0], [0, 0, 0]], [[TIN_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[COPPER, STICKS, 0], [COPPER, COPPER, 0], [0, 0, 0]], [[COPPER_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);

crafts.push([[[0, STICKS, 0], [PLANKS, PLANKS, 0], [0, 0, 0]], [[WOODEN_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [STONE, STONE, 0], [0, 0, 0]], [[STONE_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [TIN, TIN, 0], [0, 0, 0]], [[TIN_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [COPPER, COPPER, 0], [0, 0, 0]], [[COPPER_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);

crafts.push([[[PLANKS, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[WOODEN_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[STONE, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[STONE_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[TIN, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[TIN_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[COPPER, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[COPPER_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);

let woods = [LOG, PLANKS, WORKBENCH];
let stones = [STONE, FURNACE, COAL, TIN_ORE, COPPER_ORE];

let axes = [WOODEN_AXE, STONE_AXE, TIN_AXE, COPPER_AXE];
let pickaxes = [WOODEN_PICKAXE, STONE_PICKAXE, TIN_PICKAXE, COPPER_PICKAXE];
let swords = [WOODEN_SWORD, STONE_SWORD, TIN_SWORD, COPPER_SWORD];

let strengths = [2, 3, 4, 5];

let durrability = [10, 20, 50, 30];

let hit_bar = 0;
let hit_spot = [-1, -1];

let craft_bar = 0;

let block_posx = 0;
let block_posy = 0;

let reach = 200;

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

    hunger -= 0.002;
    if (hunger <= 0) {hunger = 0; health -= 0.1;}
    if (hunger > 100) {hunger = 100;}

    if (Math.random() < 0.003) {
      let animalx = Math.floor(posx/SIZE + (Math.random()*100 - 50));
      let animaly = Math.floor(posy/SIZE + (Math.random()*100 - 50));
      if (land[animalx % MAP_SIZE][animaly % MAP_SIZE][2] == 0 && dis([animalx, animaly], [posx, posy]) > 2000) {
        animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 10, 2, 0, 0, Math.random()]);
      } //                 x pos                      y pos     xvel yvel health speed type agression
    }

    for (let i of animals) {
      if (Math.random() < 0.01) {
        if (Math.random() > 0.5) {
          i[2] = Math.floor(Math.random()*3 - 1)*i[5];
          i[3] = Math.floor(Math.random()*3 - 1)*i[5];
        } else {i[2] = 0; i[3] = 0;}
      }
      if (i[7] == -1 && Math.random() < 0.05) {
        if (posx < i[0]) {i[2] = i[5];} else {i[2] = -i[5];}
        if (posy < i[1]) {i[3] = i[5];} else {i[3] = -i[5];}
      }
      if (i[7] == 1 && Math.random() < 0.05) {
        if (posx < i[0]) {i[2] = -i[5];} else {i[2] = i[5];}
        if (posy < i[1]) {i[3] = -i[5];} else {i[3] = i[5];}
      }
      if (Math.random() < 0.001) {i[7] = 0;}
        

      if (mouse.held[0] && !held && dis([mouse.x - 600, mouse.y - 300], [i[0] - posx, i[1] - posy]) < 25 && dis([600, 300], [mouse.x, mouse.y]) < reach) {
        let power3 = 1;
        if (swords.includes(courser)) {power3 = strengths[swords.indexOf(courser)];}
        i[4] -= power3;
        held = true;
        if (i[6] == 0) {i[7] = -1;}
        if (i[6] == 1) {i[7] = 1;}
        if (swords.includes(courser)) {if (Math.random() < 1/durrability[swords.indexOf(courser)]) {courser = 0;}}
      }
      
      let slow2 = 1;
      block_posx = Math.floor(i[0]/SIZE) % MAP_SIZE;
      block_posy = Math.floor(i[1]/SIZE) % MAP_SIZE;
      if (land[block_posx][block_posy][2] in collide) {
        slow2 = collide[land[block_posx][block_posy][2]];
      }
      slow2 = 1 - slow2;
      
      block_posx = Math.floor(i[0]/SIZE) % MAP_SIZE;
      block_posy = Math.floor((i[1] + i[3]*slow2)/SIZE) % MAP_SIZE;
      if ((land[block_posx][block_posy][2] in collide)) {
        i[1] += i[3]*slow2;
      } else {
        i[2] = Math.floor(Math.random()*3 - 1)*i[5];
        i[3] = Math.floor(Math.random()*3 - 1)*i[5];
      }
      
      block_posx = Math.floor((i[0] + i[2]*slow2)/SIZE) % MAP_SIZE;
      block_posy = Math.floor(i[1]/SIZE) % MAP_SIZE;
      if ((land[block_posx][block_posy][2] in collide)) {
        i[0] += i[2]*slow2;
      } else {
        i[2] = Math.floor(Math.random()*3 - 1)*i[5];
        i[3] = Math.floor(Math.random()*3 - 1)*i[5];
      }
      
      if ((Math.random() < 0.0005 && dis([i[0], i[1]], [posx, posy]) > 2500) || i[4] <= 0) {
        if (i[4] <= 0) {
          let set1 = land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2];
          if (set1 == 0 || set1 == GRASS) {
            land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2] = MEAT;
          }
        }
        let index = animals.indexOf(i);
        if (index !== -1) animals.splice(index, 1);
      }
    }

    if (!keys["e"] && !mouse.held[0]) held = false;

    if (keys["e"] && !held) {
      if (!open_inventory) {open_inventory = true;} else {
        let no_craft = true;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (craft[i][j] > 0) {no_craft = false;}
          }
        }
        if (no_craft) {open_inventory = false;
          craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];
          craft_bar = 0;}
      }
      held = true;
    }
    

    if (!mouse.held[0]) hit_bar = 0;

    let slow = 1;
    block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
    block_posy = Math.floor(posy/SIZE) % MAP_SIZE;
    if (land[block_posx][block_posy][2] in collide) {
      slow = collide[land[block_posx][block_posy][2]];
    }
    slow = 1 - slow;    
    let lposy = posy;    
    if (keys["w"] && !open_inventory) {
        posy -= 3*slow;
    }
    if (keys["s"] && !open_inventory) {
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
    if (keys["a"] && !open_inventory) {
        posx -= 3*slow;
    }
    if (keys["d"] && !open_inventory) {
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
      if (mouse.held[2] && courser == 0 && dis([mouse.x, mouse.y], [600, 300]) < reach) {
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

      if (mouse.held[0] && courser in foods) {
        hunger += foods[courser];
        courser = 0;
      }

      if (mouse.held[0] && dis([mouse.x, mouse.y], [600, 300]) < reach) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE) % MAP_SIZE;
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE) % MAP_SIZE;
        if (!(hit_spot[0] == block_posx && hit_spot[1] == block_posy)) {hit_bar = 0;}
        hit_spot[0] = block_posx;
        hit_spot[1] = block_posy;
        if (land[block_posx][block_posy][2] > 0 && land[block_posx][block_posy][3] > 0) {
          if (hit_bar >= 100) {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 3; j++) {
                if (inventory[i][j] == 0) {
                  inventory[i][j] = land[block_posx][block_posy][2];
                  land[block_posx][block_posy][2] = 0;
                }
              }
            }
            if (pickaxes.includes(courser)) {if (Math.random() < 1/durrability[pickaxes.indexOf(courser)]) {courser = 0;}}
            if (axes.includes(courser)) {if (Math.random() < 1/durrability[axes.indexOf(courser)]) {courser = 0;}}
            hit_bar = 0;
            hit_spot = [-1, -1];
          } else {
            if (land[block_posx][block_posy][2] in hardness) {
              let u2 = false;
              if (stones.includes(land[block_posx][block_posy][2]) && pickaxes.includes(courser)) {
                let power = strengths[pickaxes.indexOf(courser)];
                hit_bar += 100/(hardness[land[block_posx][block_posy][2]]/power);
                u2 = true;
              }
              if (woods.includes(land[block_posx][block_posy][2]) && axes.includes(courser)) {
                let power1 = strengths[axes.indexOf(courser)];
                hit_bar += 100/(hardness[land[block_posx][block_posy][2]]/power1);
                u2 = true;
              }
              if (!u2) {hit_bar += 100/hardness[land[block_posx][block_posy][2]];}
            } else {hit_bar += 50;}
          }
        }
      }
      if (mouse.held[2] && courser > 0 && dis([mouse.x, mouse.y], [600, 300]) < reach) {
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
            if (courser == 0 && !held && mouse.held[0]) {
              courser = inventory[i][j];
              inventory[i][j] = 0;
              held = true;
            }
            if (courser > 0 && inventory[i][j] == 0 && !held && mouse.held[0]) {
              inventory[i][j] = courser;
              courser = 0;
              held = true;
            }
          }
        }
      }
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (mouse.x > i*70 + 490 && mouse.x < i*70 + 560 && mouse.y > j*70 + 70 && mouse.y < j*70 + 140 && craft2[i][j] == 1) {
            if (courser == 0 && !held && mouse.held[0]) {
              courser = craft[i][j];
              craft[i][j] = 0;
              held = true;
            }
            if (courser > 0 && craft[i][j] == 0 && !held && mouse.held[0]) {
              craft[i][j] = courser;
              courser = 0;
              held = true;
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
    ctx.fillText("UBERLEBEN", 250, 200);

    ctx.fillStyle = "rgb(128, 0, 255)";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("By Michael Alexander Kaszynski", 400, 350);
    
    ctx.fillStyle = "white";          // text color
    ctx.font = "12px Arial";          // font size and family
    ctx.fillText("Version 0.5.0", 20, 50);
    
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
        if (i[3] > 0) {
          color1 = (((i[0] + i[1]) % ((i[0]**2 - i[1]**2 + 0.14) % 1.1))*0.125 + 0.75)/2 + 1/2;
          ctx.fillStyle = "rgb(0," + 200*color1 + ", 0)";
          ctx.fillRect(u*SIZE - posx + 600, v*SIZE - posy + 300, SIZE + 1, SIZE + 1);
          const img = images[i[2]];
          ctx.drawImage(img, u*SIZE - posx + 600 - 1, v*SIZE - posy + 300 - 1, SIZE + 2, SIZE + 2);
        } else {
          ctx.fillStyle = "rgb(0, 0, 0)";
          ctx.fillRect(u*SIZE - posx + 600, v*SIZE - posy + 300, SIZE + 1, SIZE + 1);
        }

        let dark = true;
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            if (land[(u + k - 1) % MAP_SIZE][(v + l - 1) % MAP_SIZE][2] == 0 || land[(u + k - 1) % MAP_SIZE][(v + l - 1) % MAP_SIZE][2] == WATER) {
              dark = false;
            }
          }
        }
        if (dark) {i[3] = 0;} else {i[3] = 1;}
      }
    }

    for (let i of animals) {
      const aimg = animal_imgs[i[6]];
      ctx.drawImage(aimg, i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, SIZE, SIZE);
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillRect(i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, i[4]*5, 10);
    }

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(600 - SIZE/4, 300 - SIZE/4, SIZE/2, SIZE/2);

    if (hit_bar > 0) {
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, 50, 10);

      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, hit_bar/2, 10);
    }

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(400, 600, health*4, 10);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(400, 610, hunger*4, 10);

    if (open_inventory) {
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.fillRect(48, 48, 800, 227);

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = "rgb(200, 100, 0)";
        ctx.fillRect(70 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
        if (inventory[i][j] > 0) {
          const img = images[inventory[i][j]];
          ctx.drawImage(img, 70 + i*70, 70 + j*70, SIZE, SIZE);
        }
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (craft2[i][j] == 1) {
          ctx.fillStyle = "rgb(200, 100, 0)";
          ctx.fillRect(490 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
          if (craft[i][j] > 0) {
            const img = images[craft[i][j]];
            ctx.drawImage(img, 490 + i*70, 70 + j*70, SIZE, SIZE);
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
    
    }

    if (courser > 0) {
      const img = images[courser];
      ctx.drawImage(img, mouse.x - SIZE/2, mouse.y - SIZE/2, SIZE, SIZE);
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
