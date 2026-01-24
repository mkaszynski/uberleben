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

if (localStorage.getItem("worlds") == null) {
  localStorage.setItem("worlds", JSON.stringify([]));
}

let weather = [];
for (let i = 0; i < 10; i++) {
  weather.push(
        [
          Math.random() * 10 + 5,
            Math.random() * 100000 - 50000,
        ]
  );
}

function run_land() {
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
  land = [];
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
        let height3 = 0;
        for (let k of seed) {
          height3 += Math.sin(((i + 10000 - 30) * Math.sin(k[2]) + (j - 15) * Math.cos(k[2])) / k[0] + k[1]);
        }
        let height4 = 0;
        for (let k of seed) {
          height3 += Math.sin(((i/10 - 10000 - 30) * Math.sin(k[2]) + (j/10 - 15) * Math.cos(k[2])) / k[0] + k[1]);
        }
        let leave = 0;
        if (height3 + height4 > 2) {leave = LEAVES;}
        if (-0.5 < height2 && height2 < 0.5) {
          if (height < 3) {
            column.push([i, j, WATER, 0, leave]);
          } else {column.push([i, j, WATER, 0, STONE]);}
        } else if (height > 3) {
          if (Math.random() < 0.02 && height > 3.5) {
            column.push([i, j, COPPER_ORE, 0, STONE]);
          } else if (Math.random() < 0.025 && height > 3.5) {
            column.push([i, j, TIN_ORE, 0, STONE]);
          } else if (Math.random() < 0.035 && height > 3.75) {
            column.push([i, j, COAL, 0, STONE]);
          } else if (Math.random() < 0.01 && height > 4) {
            column.push([i, j, IRON_ORE, 0, STONE]);
          } else if (Math.random() < 0.006 && height > 4.3) {
            column.push([i, j, ALUMINUM_ORE, 0, STONE]);
          } else if (Math.random() < 0.002 && height > 4.3) {
            column.push([i, j, TUNGSTEN_ORE, 0, STONE]);
          } else {
            column.push([i, j, STONE, 0, STONE]);
          }
        } else if (Math.random() < 0.1 && height3 + height4 > 2) {
          column.push([i, j, LOG, 0, leave]);
        } else if (Math.random() < 0.2) {
          column.push([i, j, GRASS, 0, leave]);
        } else {
          column.push([i, j, AIR, 0, leave]);
        }
      }
      land.push(column);
    }
  return land;
}

let worlds = JSON.parse(localStorage.getItem("worlds"));

// WORLD VALUES

// {courser: 0, inventory: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], armor: 0, posx: 80001000, posy: 80001000, health: 100, hunger: 100, chests: {}, time1: 0, land: run_land()};

let world_name = 0;

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
let IRON_ORE = 31;
let ALUMINUM_ORE = 32;
let TUNGSTEN_ORE = 33;
let IRON = 34;
let ALUMINUM = 35;
let TUNGSTEN = 36;
let IRON_SWORD = 37;
let IRON_AXE = 38;
let IRON_PICKAXE = 39;
let ALUMINUM_SWORD = 40;
let ALUMINUM_AXE = 41;
let ALUMINUM_PICKAXE = 42;
let TUNGSTEN_SWORD = 43;
let TUNGSTEN_AXE = 44;
let TUNGSTEN_PICKAXE = 45;
let DOOR = 46;
let OPEN_DOOR = 47;
let FUR = 48;
let FUR_ARMOR = 49;
let TIN_ARMOR = 50;
let COPPER_ARMOR = 51;
let IRON_ARMOR = 52;
let ALUMINUM_ARMOR = 53;
let TUNGSTEN_ARMOR = 54;
let TORCH = 55;
let LEAVES = 56;
let BED = 57;
let CHEST = 58;
let STONE_BRICKS = 59;
let STONE_PATH = 60;
let FLOOR = 61;
let BRIDGE = 62;

let MAP_SIZE = 300;

let hardness = {1: 10, 2: 200, 3: 500, 4: 100, 5: 200, 7: 600, 8: 550, 9: 100, 10: 250, 11: 1000, 13: 20, 14: 300, 31: 750, 32: 750, 33: 2000, 46: 200, 47: 200, 57: 100, 58: 100, 59: 500, 60: 100, 61: 50, 62: 200};

let names = {0: "air", 1: "grass", 2: "log", 3: "stone", 4: "water", 5: "planks", 6: "sticks", 7: "copper ore", 8: "tin ore", 9: "work bench", 10: "furnace", 11: "forge", 12: "flame", 13: "compressed grass", 14: "coal", 15: "tin", 16: "copper", 17: "wooden axe", 18: "stone axe", 19: "tin axe", 20: "copper axe", 21: "wooden pickaxe", 22: "stone pickaxe", 23: "tin pickaxe", 24: "copper pickaxe", 25: "raw meat", 26: "cooked meat", 27: "wooden sword", 28: "stone sword", 29: "tin sword", 30: "copper sword", 31: "iron ore", 32: "aluminum ore", 33: "tungsten ore", 34: "iron", 35: "aluminum", 36: "tungsten", 37: "iron sword", 38: "iron axe", 39: "iron pickaxe", 40: "aluminum sword", 41: "aluminum axe", 42: "aluminum pickaxe", 43: "tungsten sword", 44: "tungsten axe", 45: "tungsten pickaxe", 46: "door", 47: "open door", 48: "fur", 49: "fur armor", 50: "tin armor", 51: "copper armor", 52: "iron armor", 53: "aluminum armor", 54: "tungsten armor", 55: "torch", 56: "leaves", 57: "bed", 58: "chest", 59: "stone bricks", 60: "stone path", 61: "floor", 62: "bridge"};

let foods = {25: 10, 26: 25};

let glow = {10: 6, 55: 14}; 

const images = ["air.png", "grass.png", "log.png", "stone.png", "water.png", "planks.png", "sticks.png", "copper_ore.png", "tin_ore.png", "workbench.png", "furnace.png", "forge.png", "flame.png", "compressed_grass.png", "coal.png", "tin.png", "copper.png", "wooden_axe.png", "stone_axe.png", "tin_axe.png", "copper_axe.png", "wooden_pickaxe.png", "stone_pickaxe.png", "tin_pickaxe.png", "copper_pickaxe.png", "meat.png", "cooked_meat.png", "wooden_sword.png", "stone_sword.png", "tin_sword.png", "copper_sword.png", "iron_ore.png", "aluminum_ore.png", "tungsten_ore.png", "iron.png", "aluminum.png", "tungsten.png", "iron_sword.png", "iron_axe.png", "iron_pickaxe.png", "aluminum_sword.png", "aluminum_axe.png", "aluminum_pickaxe.png", "tungsten_sword.png", "tungsten_axe.png", "tungsten_pickaxe.png", "door.png", "open_door.png", "fur.png", "fur_armor.png", "tin_armor.png", "copper_armor.png", "iron_armor.png", "aluminum_armor.png", "tungsten_armor.png", "torch.png", "leaves.png", "bed.png", "chest.png", "stone_bricks.png", "stone_path.png", "floor.png", "bridge.png"].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const animal_imgs = ["chicken.png", "rabbit.png", "fox.png", "deer.png", "wolf.png", "bear.png"].map(src => {
  const img2 = new Image();
  img2.src = src;
  return img2;
});

const place_armor = ["place_armor.png", "drop.png"].map(src => {
  const img3 = new Image();
  img3.src = src;
  return img3;
});

let dark_blocks = [LOG, STONE, PLANKS, COPPER_ORE, TIN_ORE, WORKBENCH, FORGE, COMPRESSED_GRASS, IRON_ORE, ALUMINUM_ORE, TUNGSTEN_ORE, COAL, LEAVES, CHEST];

let collide = {0: 0, 1: 0.4, 4: 0.7, 47: 0, 55: 0, 57: 0.5, 60: -0.3, 61: -0.3, 62: -0.3}

let SIZE = 40;

let land = [];

let animals = [];

let rain = [];

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

let start = false;

let time1 = 0;

let stage = "menue";

let held = false;

let open_chest = false;

let chest_open = "";


// Set this stuff
let courser = 0;

let inventory = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

let armor = 0;

let posx = 80001000;
let posy = 80001000;

let health = 100;
let hunger = 100;

let chests = {};

// Don't store this stuff

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
crafts.push([[[PLANKS, PLANKS, 0], [PLANKS, STICKS, 0], [0, 0, 0]], [[DOOR, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[FLAME, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[TORCH, 0, 0], [TORCH, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[PLANKS, 0, 0], [0, 0, 0], [0, 0, 0]], [[WORKBENCH, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[PLANKS, PLANKS, 0], [PLANKS, PLANKS, 0], [0, 0, 0]], [[CHEST, 0, 0], [0, 0, 0], [0, 0, 0]], 200]);
crafts.push([[[PLANKS, 0, 0], [0, PLANKS, 0], [0, 0, 0]], [[BRIDGE, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[STICKS, STICKS, 0], [STICKS, STICKS, 0], [0, 0, 0]], [[FLOOR, FLOOR, 0], [FLOOR, FLOOR, 0], [0, 0, 0]], 50]);
crafts.push([[[STONE, STONE, 0], [0, 0, 0], [0, 0, 0]], [[STONE_BRICKS, STONE_BRICKS, 0], [0, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[STONE_BRICKS, STONE_BRICKS, 0], [0, 0, 0], [0, 0, 0]], [[STONE_PATH, STONE_PATH, 0], [STONE_PATH, STONE_PATH, 0], [0, 0, 0]], 50]);
crafts.push([[[STONE, STONE, 0], [STONE, STONE, 0], [0, 0, 0]], [[FURNACE, 0, 0], [0, 0, 0], [0, 0, 0]], 200]);
crafts.push([[[GRASS, GRASS, 0], [GRASS, GRASS, 0], [0, 0, 0]], [[COMPRESSED_GRASS, 0, 0], [0, 0, 0], [0, 0, 0]], 30]);
crafts.push([[[COMPRESSED_GRASS, PLANKS, 0], [COMPRESSED_GRASS, PLANKS, 0], [0, 0, 0]], [[BED, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[0, 0, 0], [PLANKS, 0, PLANKS], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[0, 0, 0], [COMPRESSED_GRASS, 0, COMPRESSED_GRASS], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, 0], [0, 0, 0]], 50]);
crafts.push([[[0, 0, 0], [0, 0, COAL], [0, 0, 0]], [[0, 0, 0], [FLAME, 0, FLAME], [0, 0, 0]], 50]);
crafts.push([[[0, 0, 0], [TIN_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [TIN, 0, 0], [0, 0, 0]], 200]);
crafts.push([[[0, 0, 0], [COPPER_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [COPPER, 0, 0], [0, 0, 0]], 300]);
crafts.push([[[0, 0, 0], [IRON_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [IRON, 0, 0], [0, 0, 0]], 600]);
crafts.push([[[0, 0, 0], [ALUMINUM_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [ALUMINUM, 0, 0], [0, 0, 0]], 1000]);
crafts.push([[[0, 0, 0], [TUNGSTEN_ORE, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [TUNGSTEN, 0, 0], [0, 0, 0]], 1500]);
crafts.push([[[0, 0, 0], [MEAT, 0, FLAME], [0, 0, 0]], [[0, 0, 0], [COOKED_MEAT, 0, 0], [0, 0, 0]], 400]);

crafts.push([[[PLANKS, STICKS, 0], [PLANKS, PLANKS, 0], [0, 0, 0]], [[WOODEN_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[STONE, STICKS, 0], [STONE, STONE, 0], [0, 0, 0]], [[STONE_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[TIN, STICKS, 0], [TIN, TIN, 0], [0, 0, 0]], [[TIN_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[COPPER, STICKS, 0], [COPPER, COPPER, 0], [0, 0, 0]], [[COPPER_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[IRON, STICKS, 0], [IRON, IRON, 0], [0, 0, 0]], [[IRON_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[ALUMINUM, STICKS, 0], [ALUMINUM, ALUMINUM, 0], [0, 0, 0]], [[ALUMINUM_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[TUNGSTEN, STICKS, 0], [TUNGSTEN, TUNGSTEN, 0], [0, 0, 0]], [[TUNGSTEN_PICKAXE, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);

crafts.push([[[0, STICKS, 0], [PLANKS, PLANKS, 0], [0, 0, 0]], [[WOODEN_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [STONE, STONE, 0], [0, 0, 0]], [[STONE_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [TIN, TIN, 0], [0, 0, 0]], [[TIN_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [COPPER, COPPER, 0], [0, 0, 0]], [[COPPER_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [IRON, IRON, 0], [0, 0, 0]], [[IRON_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[0, STICKS, 0], [ALUMINUM, ALUMINUM, 0], [0, 0, 0]], [[ALUMINUM_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[0, STICKS, 0], [TUNGSTEN, TUNGSTEN, 0], [0, 0, 0]], [[TUNGSTEN_AXE, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);

crafts.push([[[PLANKS, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[WOODEN_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[STONE, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[STONE_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[TIN, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[TIN_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[COPPER, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[COPPER_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[IRON, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[IRON_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 150]);
crafts.push([[[ALUMINUM, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[ALUMINUM_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 100]);
crafts.push([[[TUNGSTEN, STICKS, 0], [0, 0, 0], [0, 0, 0]], [[TUNGSTEN_SWORD, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);
crafts.push([[[FURNACE, TUNGSTEN, 0], [TUNGSTEN, WORKBENCH, 0], [0, 0, 0]], [[FORGE, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);
crafts.push([[[FUR, FUR, 0], [FUR, FUR, 0], [0, 0, 0]], [[FUR_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 300]);
crafts.push([[[TIN, TIN, 0], [TIN, TIN, 0], [0, 0, 0]], [[TIN_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);
crafts.push([[[COPPER, COPPER, 0], [COPPER, COPPER, 0], [0, 0, 0]], [[COPPER_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 400]);
crafts.push([[[0, IRON, 0], [IRON, 0, IRON], [0, IRON, 0]], [[IRON_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 500]);
crafts.push([[[0, ALUMINUM, 0], [ALUMINUM, 0, ALUMINUM], [0, ALUMINUM, 0]], [[ALUMINUM_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 400])
crafts.push([[[0, TUNGSTEN, 0], [TUNGSTEN, 0, TUNGSTEN], [0, TUNGSTEN, 0]], [[TUNGSTEN_ARMOR, 0, 0], [0, 0, 0], [0, 0, 0]], 1000])

let woods = [LOG, PLANKS, WORKBENCH, DOOR, OPEN_DOOR, BED, CHEST, FLOOR, BRIDGE];
let stones = [STONE, FURNACE, COAL, TIN_ORE, COPPER_ORE, IRON_ORE, ALUMINUM_ORE, TUNGSTEN_ORE, STONE_BRICKS, STONE_PATH];

let axes = [WOODEN_AXE, STONE_AXE, TIN_AXE, COPPER_AXE, IRON_AXE, ALUMINUM_AXE, TUNGSTEN_AXE];
let pickaxes = [WOODEN_PICKAXE, STONE_PICKAXE, TIN_PICKAXE, COPPER_PICKAXE, IRON_PICKAXE, ALUMINUM_PICKAXE, TUNGSTEN_PICKAXE];
let swords = [WOODEN_SWORD, STONE_SWORD, TIN_SWORD, COPPER_SWORD, IRON_SWORD, ALUMINUM_SWORD, TUNGSTEN_SWORD];
let armors = [AIR, FUR_ARMOR, TIN_ARMOR, COPPER_ARMOR, IRON_ARMOR, ALUMINUM_ARMOR, TUNGSTEN_ARMOR];

let strengths = [2, 3, 4, 5, 8, 6, 12];

let durrability = [20, 40, 110, 90, 200, 110, 600];

let weights = [0.95, 0.85, 0.8, 0.75, 0.65, 0.95, 0.5];

let protections = [1, 0.75, 0.6, 0.5, 0.3, 0.35, 0.2];

let danger = 1;

let hit_bar = 0;
let hit_spot = [-1, -1];

let craft_bar = 0;

let block_posx = 0;
let block_posy = 0;

let reach = 200;

let craft_scroll = 0;

let mouse_tips = [];

let day = 0;

let o1 = 0;

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
  
  day = Math.floor(Math.sin(time1/40000*Math.PI*2)*20 + 15/2);

  if (day < 3) day = 3;
  if (day > 15) day = 15;
  

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // PLAY MODE
  
  if (stage === "play") {
    if (mouse.x < 100 && mouse.y > 500 && mouse.y < 600 && mouse.held[0]) {
      stage = "paused";
    }
    render1 = true;

    block_posx = Math.floor(posx/SIZE);
    block_posy = Math.floor(posy/SIZE);

    let height1 = 0;
    for (let i of weather) {
      height1 += Math.sin((i[1] + time1)/i[0]/200);
    }
    if (height1 > 2) {
      rain.push([(block_posx + Math.random()*30 - 15)*SIZE, (block_posy + Math.random()*30 - 15)*SIZE]);
      day -= 1;
    }

    if (rain.length > 100 || (height1 < 2 && rain.length > 0)) {
      rain.splice(Math.floor(Math.random()*rain.length), 1);
    }

    for (let i of rain) {
      i[1] += 15;
      if (i[1] > posy + 1000) {
        i[1] = posy - 1000;
      }
    }

    mouse_tips = [];

    if (open_inventory) {
      if (keys["w"]) {craft_scroll -= 20;}
      if (keys["s"]) {craft_scroll += 20;}
      if (craft_scroll < 0) {craft_scroll = 0;}
    }

    hunger -= 0.001*danger;
    if (hunger <= 0) {hunger = 0; health -= 0.02*danger;}
    if (hunger > 100) {hunger = 100;}

    if (health < 100) {hunger -= 0.002; health += 0.004;}
    if (health > 100) {health = 100;}

    if (health <= 0) {stage = "menue";start = false;}

    if (danger == 0) {health = 100; hunger = 100;}

    let danger_power = 1;
    if (danger == 0) {danger_power = 0.01;}
    if (danger == 2) {danger_power = 3;}

    if (Math.random() < 0.004) {
      let animalx = Math.floor(posx/SIZE + (Math.random()*100 - 50));
      let animaly = Math.floor(posy/SIZE + (Math.random()*100 - 50));
      if (land[animalx % MAP_SIZE][animaly % MAP_SIZE][2] == 0 && dis([animalx*SIZE, animaly*SIZE], [posx, posy]) > 700) {
        let an_rand = Math.random()
        if (an_rand < 0.3) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 12, 2, 0, 0, 0, 0, 12]);
        //             0   x pos                1     y pos  2  xvel 3 yvel 4 health 5 speed 6 type 7 agression 8 an_type 9 max health
        } else if (an_rand < 0.6) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 6, 4, 0, 0, 1, 0, 6]);
        } else if (an_rand < 0.75) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 12, 4, 1, 0, 2, 5, 12]);
        } else if (an_rand < 0.90) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 24, 2, 1, 0, 3, 7, 24]);
        } else if (an_rand < 0.95) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 24, 4, 2, 0, 4, 13, 24]);
        } else if (an_rand < 1) {
          animals.push([animalx*SIZE + SIZE/2, animaly*SIZE + SIZE/2, 0, 0, 48, 3, 2, 0, 5, 17, 48]);
        }
      }
    }

    for (let i of animals) {
      if (Math.random() < 0.01) {
        if (Math.random() > 0.5) {
          i[2] = Math.floor(Math.random()*3 - 1)*i[5];
          i[3] = Math.floor(Math.random()*3 - 1)*i[5];
        } else {i[2] = 0; i[3] = 0;}
      }
      if (i[7] == -1 && Math.random() < 0.1) {
        if (posx < i[0]) {i[2] = i[5];} else {i[2] = -i[5];}
        if (posy < i[1]) {i[3] = i[5];} else {i[3] = -i[5];}
      }
      if (i[7] == 1 && Math.random() < 0.05) {
        if (posx < i[0]) {i[2] = -i[5];} else {i[2] = i[5];}
        if (posy < i[1]) {i[3] = -i[5];} else {i[3] = i[5];}
        if (dis([posx, posy], [i[0], i[1]]) < 50 && Math.random() > 0.05) {
          health -= i[9]*protections[armors.indexOf(armor)]*danger;
          if (Math.random() < 1/durrability[armors.indexOf(armor)]) {armor = 0;}
        }
      }
      if (dis([posx, posy], [i[0], i[1]]) < 300 && i[6] == 2) {
        i[7] = 1;
      }
      if (Math.random() < 0.001) {i[7] = 0;}


      if (mouse.held[2] && !held && dis([mouse.x - 600, mouse.y - 300], [i[0] - posx, i[1] - posy]) < 25 && dis([600, 300], [mouse.x, mouse.y]) < reach) {
        let power3 = 1;
        if (swords.includes(courser)) {power3 = strengths[swords.indexOf(courser)];}
        if (danger == 2) {power3 *= 1/3;}
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
      if (land[block_posx][block_posy][2] in collide) {
        i[1] += i[3]*slow2;
      } else {
        i[2] = Math.floor(Math.random()*3 - 1)*i[5];
        i[3] = Math.floor(Math.random()*3 - 1)*i[5];
      }
      
      block_posx = Math.floor((i[0] + i[2]*slow2)/SIZE) % MAP_SIZE;
      block_posy = Math.floor(i[1]/SIZE) % MAP_SIZE;
      if (land[block_posx][block_posy][2] in collide) {
        i[0] += i[2]*slow2;
      } else {
        i[2] = Math.floor(Math.random()*3 - 1)*i[5];
        i[3] = Math.floor(Math.random()*3 - 1)*i[5];
      }
      
      if ((Math.random() < 0.0001 && dis([i[0], i[1]], [posx, posy]) > 1000) || i[4] <= 0) {
        if (i[4] <= 0) {
          let set1 = land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2];
          if (set1 == 0 || set1 == GRASS) {
            if (i[6] == 0) {
              land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2] = MEAT;
            } else if (i[6] == 1) {
              if (Math.random() > 0.5) {
                land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2] = MEAT;
              } else {
                land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2] = FUR;
              }
            } else {land[Math.floor(i[0]/SIZE) % MAP_SIZE][Math.floor(i[1]/SIZE) % MAP_SIZE][2] = FUR;}
          }
        }
        let index = animals.indexOf(i);
        if (index !== -1) animals.splice(index, 1);
      }
    }

    if (!keys["e"] && !mouse.held[0] && !mouse.held[2]) held = false;

    if (keys["e"] && !held) {
      if (!open_inventory) {open_inventory = true;} else {
        let no_craft = true;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (craft[i][j] > 0) {no_craft = false;}
          }
        }
        if (no_craft && !open_chest) {open_inventory = false;
          craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];
          craft_bar = 0;
        }
        if (open_chest) {
          for (let f = 0; f < 3; f++) {
            for (let g = 0; g < 3; g++) {
              chests[chest_open][f][g] = craft[f][g];
            }
          }
          open_inventory = false;
          open_chest = false;
          chest_open = "";
          craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];
          craft = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        }
      }
      held = true;
    }
    

    if (!mouse.held[2]) hit_bar = 0;

    let slow = 1;
    block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
    block_posy = Math.floor(posy/SIZE) % MAP_SIZE;
    if (land[block_posx][block_posy][2] in collide) {
      slow = collide[land[block_posx][block_posy][2]];
    }
    if (land[block_posx][block_posy][2] == BED && day < 10) {
      time1 += 100;
    }
    slow = 1 - slow;
    if (swords.includes(courser)) {slow *= weights[swords.indexOf(courser)]/2 + 1/2;}
    if (axes.includes(courser)) {slow *= weights[axes.indexOf(courser)]/2 + 1/2;}
    if (pickaxes.includes(courser)) {slow *= weights[pickaxes.indexOf(courser)]/2 + 1/2;}
    slow *= weights[armors.indexOf(armor)];

    if (danger == 0) {slow = 3;}
    
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
    if (!(land[block_posx][block_posy][2] in collide) && danger > 0) {
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
    if (!(land[block_posx][block_posy][2] in collide) && danger > 0) {
      back = true;
    }
    if (back) {posx = lposx;}

    if (!open_inventory) {
      if (mouse.held[0] && dis([mouse.x, mouse.y], [600, 300]) < reach) {
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
        if (land[block_posx][block_posy][2] == CHEST) {
          held = true;
          open_inventory = true;
          craft2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
          open_chest = true;
          chest_open = block_posx + " " + block_posy;
          for (let f = 0; f < 3; f++) {
            for (let g = 0; g < 3; g++) {
              craft[f][g] = chests[chest_open][f][g];
            }
          }
        }
        if (land[block_posx][block_posy][2] == DOOR && !held) {
          land[block_posx][block_posy][2] = OPEN_DOOR;
          held = true;
        } else if (land[block_posx][block_posy][2] == OPEN_DOOR && !held) {
          land[block_posx][block_posy][2] = DOOR;
          held = true;
        }
      }

      if (mouse.held[0] && courser in foods) {
        hunger += foods[courser];
        courser = 0;
      }

      if (mouse.held[2] && dis([mouse.x, mouse.y], [600, 300]) < reach) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE) % MAP_SIZE;
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE) % MAP_SIZE;
        if (!(hit_spot[0] == block_posx && hit_spot[1] == block_posy)) {hit_bar = 0;}
        hit_spot[0] = block_posx;
        hit_spot[1] = block_posy;
        if (land[block_posx][block_posy][2] > 0 && land[block_posx][block_posy][3] > 0) {
          if (hit_bar >= 100) {
            if (courser > 0) {
              for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                  if (inventory[i][j] == 0) {
                    if (land[block_posx][block_posy][2] != WATER && land[block_posx][block_posy][2] != BRIDGE) {
                    if (land[block_posx][block_posy][2] != CHEST) {
                      inventory[i][j] = land[block_posx][block_posy][2];
                      land[block_posx][block_posy][2] = 0;
                    } else {
                      let empty = true;
                      for (let f = 0; f < 3; f++) {
                        for (let g = 0; g < 3; g++) {
                          if (chests[block_posx + " " + block_posy][f][g] > 0) {
                            empty = false;
                          }
                        }
                      }
                      if (empty) {
                        delete chests[block_posx + " " + block_posy];
                        inventory[i][j] = land[block_posx][block_posy][2];
                        land[block_posx][block_posy][2] = 0;
                      }
                    }
                    } else {
                      if (land[block_posx][block_posy][2] == BRIDGE) {
                        land[block_posx][block_posy][2] = WATER;
                        inventory[i][j] = BRIDGE;
                      }
                    }
                  }
                }
              }
            } else {
              if (land[block_posx][block_posy][2] != WATER && land[block_posx][block_posy][2] != BRIDGE) {
              if (land[block_posx][block_posy][2] != CHEST) {
                courser = land[block_posx][block_posy][2];land[block_posx][block_posy][2] = 0;
              } else {
                let empty = true;
                for (let f = 0; f < 3; f++) {
                  for (let g = 0; g < 3; g++) {
                    if (chests[block_posx + " " + block_posy][f][g] > 0) {
                      empty = false;
                    }
                  }
                }
                if (empty) {
                  delete chests[block_posx + " " + block_posy];
                  courser = land[block_posx][block_posy][2];
                  land[block_posx][block_posy][2] = 0;
                }
              }
              } else {
                if (land[block_posx][block_posy][2] == BRIDGE) {
                  land[block_posx][block_posy][2] = WATER;
                  courser = BRIDGE;
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
                hit_bar += 100/(hardness[land[block_posx][block_posy][2]]/power*danger_power);
                u2 = true;
              }
              if (woods.includes(land[block_posx][block_posy][2]) && axes.includes(courser)) {
                let power1 = strengths[axes.indexOf(courser)];
                hit_bar += 100/(hardness[land[block_posx][block_posy][2]]/power1*danger_power);
                u2 = true;
              }
              if (!u2) {hit_bar += 100/hardness[land[block_posx][block_posy][2]]/danger_power;}
            } else {hit_bar += 50;}
          }
        }
      }
      if (mouse.held[0] && courser > 0 && dis([mouse.x, mouse.y], [600, 300]) < reach) {
        block_posx = Math.floor((posx - 600 + mouse.x)/SIZE % MAP_SIZE);
        block_posy = Math.floor((posy - 300 + mouse.y)/SIZE % MAP_SIZE);
        let cur_type = courser;
        if (land[block_posx][block_posy][2] == 0 && courser != BRIDGE) {
          land[block_posx][block_posy][2] = courser;
          if (courser == CHEST) {
            chests[block_posx + " " + block_posy] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
          }
          courser = 0;
          let found1 = true;
          for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
              if (inventory[i][j] == cur_type && found1) {
                inventory[i][j] = 0;
                courser = cur_type;
                found1 = false;
              }
            }
          }
        } else if (land[block_posx][block_posy][2] == WATER && courser == BRIDGE) {
          land[block_posx][block_posy][2] = courser;
          courser = 0;
          let found2 = true;
          for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
              if (inventory[i][j] == cur_type && found2) {
                inventory[i][j] = 0;
                courser = cur_type;
                found2 = false;
              }
            }
          }
        }
      }
    } else {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
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
            if (courser > 0 && inventory[i][j] > 0 && !held && mouse.held[0]) {
              o1 = courser;
              courser = inventory[i][j];
              inventory[i][j] = o1;
              held = true;
            }
            if (mouse.held[2]) {
              if (!armors.includes(inventory[i][j]) || armor > 0) {
                let m3 = false;
                for (let s = 0; s < 3; s++) {
                  for (let m = 0; m < 3; m++) {
                    if (craft2[s][m] == 1 && craft[s][m] == 0 && !m3) {
                      m3 = true;
                      craft[s][m] = inventory[i][j];
                      inventory[i][j] = 0;
                    }
                  }
                }
              } else {
                armor = inventory[i][j];
                inventory[i][j] = 0;
              }
            }
          }
        }
      }
      if (mouse.x > 560 && mouse.x < 630 && mouse.y > 300 && mouse.y < 370) {
        if (courser == 0 && armor > 0 && !held && mouse.held[0]) {
          courser = armor;
          armor = 0;
          held = true;
        }
        if (courser > 0 && armor == 0 && armors.includes(courser) && !held && mouse.held[0]) {
          armor = courser;
          courser = 0;
          held = true;
        }
        if (courser > 0 && armor > 0 && !held && mouse.held[0] && armors.includes(courser)) {
          o1 = courser;
          courser = armor;
          armor = o1;
          held = true;
        }
        if (armor > 0 && mouse.held[2]) {
          let m4 = false;
          for (let s = 0; s < 6; s++) {
            for (let m = 0; m < 6; m++) {
              if (inventory[s][m] == 0 && !m4) {
                m4 = true;
                inventory[s][m] = armor;
                armor = 0;
              }
            }
          }
        }
      }
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (mouse.x > i*70 + 560 && mouse.x < i*70 + 630 && mouse.y > j*70 + 70 && mouse.y < j*70 + 140 && craft2[i][j] == 1) {
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
            if (courser > 0 && craft[i][j] > 0 && !held && mouse.held[0]) {
              o1 = courser;
              courser = craft[i][j];
              craft[i][j] = o1;
              held = true;
            }
            if (mouse.held[2]) {
              let m3 = false;
              for (let s = 0; s < 6; s++) {
                for (let m = 0; m < 6; m++) {
                  if (inventory[s][m] == 0 && !m3) {
                    m3 = true;
                    inventory[s][m] = craft[i][j];
                    craft[i][j] = 0;
                  }
                }
              }
            }
          }
        }
      }

      if (keys["c"] && !open_chest) {
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
              craft_bar += 100/m[2]/danger_power;
            }
          } else {s = false;}
        }
        if (s) craft_bar = 0;
      } else {craft_bar = 0;}
    }
    
  }

  if (stage == "paused") render1 = true;


  // MAIN MENUE

  if (stage == "menue") {
    
    ctx.fillStyle = "rgb(" + (time1 % 174)/174*255 + "," + (time1 % 152)/152*255 + ","  + (time1 % 197)/197*255 + ")";
    ctx.font = "125px Arial";          // font size and family
    ctx.fillText("UBERLEBEN", 250, 200);

    ctx.fillStyle = "rgb(128, 0, 255)";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("By Michael Alexander Kaszynski", 400, 325);
    
    ctx.fillStyle = "white";          // text color
    ctx.font = "12px Arial";          // font size and family
    ctx.fillText("Version 1.1.6", 20, 50);

    
    if (550 < mouse.x && mouse.x < 650 && 350 < mouse.y && mouse.y < 450 && mouse.held[0]) {
      stage = "new world";
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 350, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("New world", 565, 400);

    if (worlds.length > 0) {
      for (let i = 0; i < worlds.length; i++) {
        let boxx = (i*100) % 700 + 200;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
        ctx.fillRect(boxx, 550, 75, 75);

        ctx.fillStyle = "black";          // text color
        ctx.font = "15px Arial";          // font size and family
        ctx.fillText("World " + i, boxx, 575);
        ctx.font = "12px Arial";
        if (worlds[i].danger == 0) {
          ctx.fillText("Creative", boxx, 600);
        }
        if (worlds[i].danger == 1) {
          ctx.fillText("Survival", boxx, 600);
        }
        if (worlds[i].danger == 2) {
          ctx.fillText("Death Mode", boxx, 600);
        }

        if (mouse.x > boxx && mouse.x < boxx + 75 && mouse.y > 550 && mouse.y < 625 && mouse.held[0]) {
          stage = "play";
          courser = worlds[i].courser;

          time1 = worlds[i].time1;

          inventory = worlds[i].inventory;

          armor = worlds[i].armor;

          posx = worlds[i].posx;
          posy = worlds[i].posy;

          health = worlds[i].health;
          hunger = worlds[i].hunger;

          chests = worlds[i].chests;
          land = worlds[i].land;

          danger = worlds[i].danger;

          world_name = i;

          if (!("animals" in worlds[i])) {worlds[i].animals = [];}
          animals = worlds[i].animals;
        }

      }
    }
  }

  // OPEN NEW WORLD

  if (stage == "new world") {

    ctx.fillStyle = "white";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("Select your world type:", 300, 200);

    
    if (550 < mouse.x && mouse.x < 650 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "menue";
      worlds.push({courser: 0, inventory: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], armor: 0, posx: 80001000, posy: 80001000, health: 100, hunger: 100, chests: {}, time1: 0, land: run_land(), danger: 1, animals: []});
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Survival", 575, 500);
    

    if (400 < mouse.x && mouse.x < 500 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "menue";
      worlds.push({courser: 0, inventory: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], armor: 0, posx: 80001000, posy: 80001000, health: 100, hunger: 100, chests: {}, time1: 0, land: run_land(), danger: 2, animals: []});
      localStorage.setItem("worlds", JSON.stringify(worlds))
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(400, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Death Mode", 410, 500);
    

    if (700 < mouse.x && mouse.x < 800 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "menue";
      worlds.push({courser: 0, inventory: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], armor: 0, posx: 80001000, posy: 80001000, health: 100, hunger: 100, chests: {}, time1: 0, land: run_land(), danger: 0, animals: []});
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(700, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Creative", 725, 500);
  }


  // RENDER GRAPICS IF REQUIRED
  
  if (render1) {
    for (let u = Math.floor(posx/SIZE) - 30; u < Math.floor(posx/SIZE) + 30; u++) {
      for (let v = Math.floor(posy/SIZE) - 20; v < Math.floor(posy/SIZE) + 20; v++) {
        let i = land[u % MAP_SIZE][v % MAP_SIZE];
        
        color1 = (((i[0] + i[1]) % ((i[0]**2 - i[1]**2 + 0.14) % 1.1))*0.125 + 0.75)/2 + 1/2;
        ctx.fillStyle = "rgb(0," + 200*color1 + ", 0)";
        ctx.fillRect(Math.floor(u*SIZE - posx + 600), Math.floor(v*SIZE - posy + 300), SIZE, SIZE);
        
        if (i[4] > 0) {
          const img5 = images[i[4]];
          ctx.drawImage(img5, Math.floor(u*SIZE - posx + 600), Math.floor(v*SIZE - posy + 300), SIZE, SIZE);
          if (i[4] == STONE) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(Math.floor(u*SIZE - posx + 600), Math.floor(v*SIZE - posy + 300), SIZE, SIZE);
          }
        }
        
        const img = images[i[2]];
        ctx.drawImage(img, Math.floor(u*SIZE - posx + 600), Math.floor(v*SIZE - posy + 300), SIZE, SIZE);

        ctx.fillStyle = "rgba(0, 0, 0, " + (15 - i[3])/15 + ")";
        ctx.fillRect(Math.floor(u*SIZE - posx + 600), Math.floor(v*SIZE - posy + 300), SIZE, SIZE);

        block_posx = Math.floor(posx/SIZE) % MAP_SIZE;
        block_posy = Math.floor(posy/SIZE) % MAP_SIZE;

        if (i[2] in glow) {if (i[3] < glow[i[2]]) {i[3] = glow[i[2]];}}
        if (courser in glow) {if (i[3] < glow[courser] && i[0] == block_posx && i[1] == block_posy) {i[3] = glow[courser];}}
        
        let suround = true;
        let dark = 0;
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            if (dis([k, l], [1, 1]) < 1.1) {
              let k3 = land[(u + k - 1) % MAP_SIZE][(v + l - 1) % MAP_SIZE];
              if (!dark_blocks.includes(k3[2])) {
                if (k3[3] - 1 > dark) {dark = k3[3] - 1;}
                suround = false;
              }
            }
          }
        }
        i[3] = dark;
        if (!dark_blocks.includes(i[2]) && !dark_blocks.includes(i[4]) && day > i[3]) {i[3] = day;}
        if (suround) {i[3] = 0;}
        if (danger == 0 && !(land[block_posx][block_posy][2] in collide)) {i[3] = 15;}
      }
    }

    for (let i of rain) {
      block_posx = Math.floor(i[0]/SIZE) % MAP_SIZE;
      block_posy = Math.floor(i[1]/SIZE) % MAP_SIZE;
      ctx.filter = "brightness(" + land[block_posx][block_posy][3]/15 + ")";
      if (land[block_posx][block_posy][4] == 0) {
        const rimg = place_armor[1];
        ctx.drawImage(rimg, i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, SIZE, SIZE);
      }
      ctx.filter = "none";
    }

    for (let i of animals) {
      block_posx = Math.floor(i[0]/SIZE) % MAP_SIZE;
      block_posy = Math.floor(i[1]/SIZE) % MAP_SIZE;
      ctx.filter = "brightness(" + land[block_posx][block_posy][3]/15 + ")";
      const aimg = animal_imgs[i[8]];
      ctx.drawImage(aimg, i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, SIZE, SIZE);
      if (i[4] < i[10]) {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, 50, 10);
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(i[0] - posx + 600 - SIZE/2, i[1] - posy + 300 - SIZE/2, i[4]/i[10]*50, 10);
      }
      ctx.filter = "none";
    }

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(600 - SIZE/4, 300 - SIZE/4, SIZE/2, SIZE/2);

    if (hit_bar > 0 && danger > 0) {
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, 50, 10);

      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillRect(mouse.x - 25, mouse.y - 25, hit_bar/2, 10);
    }

    ctx.fillStyle = "rgb(128, 128, 128)";
    ctx.fillRect(400, 600, 400, 20);

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(400, 600, health*4, 10);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(400, 610, hunger*4, 10);

    if (open_inventory) {
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.fillRect(48, 48, 1000, 437);

    for (let k = 0; k < crafts.length; k++) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (-20 < (j*70 - craft_scroll*2 + k*250 - 5)/2 && (j*70 - craft_scroll*2 + k*250 - 5)/2 < 390) {
            ctx.fillStyle = "rgb(200, 100, 0)";
            ctx.fillRect(770 + (i*70 - 5)/2, 70 + (j*70 - craft_scroll*2 + k*250 - 5)/2, SIZE/2 + 5, SIZE/2 + 5);
            const img = images[crafts[k][0][i][j]];
            ctx.drawImage(img, 770 + i*70/2, 70 + (j*70 - craft_scroll*2 + k*250)/2, SIZE/2, SIZE/2);

            mouse_tips.push([770 + i*70/2 + SIZE/4, 70 + (j*70 - craft_scroll*2 + k*250)/2 + SIZE/4, crafts[k][0][i][j], true]);

            ctx.fillStyle = "rgb(200, 100, 0)";
            ctx.fillRect(920 + (i*70 - 5)/2, 70 + (j*70 - craft_scroll*2 + k*250 - 5)/2, SIZE/2 + 5, SIZE/2 + 5);
            const img2 = images[crafts[k][1][i][j]];
            ctx.drawImage(img2, 920 + i*70/2, 70 + (j*70 - craft_scroll*2 + k*250)/2, SIZE/2, SIZE/2);

            mouse_tips.push([920 + i*70/2 + SIZE/4, 70 + (j*70 - craft_scroll*2 + k*250)/2 + SIZE/4, crafts[k][1][i][j], true]);
          }
        }
      }
    }

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        ctx.fillStyle = "rgb(200, 100, 0)";
        ctx.fillRect(70 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
        if (inventory[i][j] > 0) {
          const img = images[inventory[i][j]];
          ctx.drawImage(img, 70 + i*70, 70 + j*70, SIZE, SIZE);
          mouse_tips.push([70 + i*70 + SIZE/2, 70 + j*70 + SIZE/2, inventory[i][j], false]);
        }
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (craft2[i][j] == 1) {
          ctx.fillStyle = "rgb(200, 100, 0)";
          ctx.fillRect(560 + i*70 - 5, 70 + j*70 - 5, SIZE + 10, SIZE + 10);
          if (craft[i][j] > 0) {
            const img = images[craft[i][j]];
            ctx.drawImage(img, 560 + i*70, 70 + j*70, SIZE, SIZE);
            mouse_tips.push([560 + i*70 + SIZE/2, 70 + j*70 + SIZE/2, craft[i][j], false]);
          }
        }
      }
    }

    ctx.fillStyle = "rgb(200, 100, 0)";
    ctx.fillRect(560 - 5, 300 - 5, SIZE + 10, SIZE + 10);
    if (armor == 0) {
      const img = place_armor[0];
      ctx.drawImage(img, 560, 300, SIZE, SIZE);
    }
    const img = images[armor];
    ctx.drawImage(img, 560, 300, SIZE, SIZE);
      mouse_tips.push([560 + SIZE/2, 300 + SIZE/2, armor, false]);

    if (craft_bar > 0) {
      ctx.fillStyle = "rgb(128, 128, 128)";
      ctx.fillRect(500, 150, 50, 10);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(500, 150, craft_bar/2, 10);
    }
    }

    if (courser > 0) {
      const img = images[courser];
      ctx.drawImage(img, mouse.x - SIZE/2, mouse.y - SIZE/2, SIZE, SIZE);
    }

    let str_m = 0;
    let get2 = false;
    for (let i of mouse_tips) {
      if (dis([mouse.x, mouse.y], [i[0], i[1]]) < SIZE/2 && i[2] > 0) {
        str_m = i[2];
        if (i[3]) {get2 = true;}
      }
    }
    if (str_m > 0) {
        ctx.fillStyle = "black";          // text color
        ctx.font = "30px Arial";          // font size and family
        ctx.fillText(names[str_m], mouse.x, mouse.y);
    }
    if (mouse.held[0] && courser == 0 && str_m > 0 && danger == 0 && get2) {
      courser = str_m;
    }
    
    
    if (stage == "play") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
      ctx.fillRect(0, 500, 100, 100);
      
      ctx.fillStyle = "black";          // text color
      ctx.font = "15px Arial";          // font size and family
      ctx.fillText("Pause", 25, 550);
    }
  }

  //PAUSED

  if (stage == "paused") {
    if (100 > mouse.x && mouse.y < 400 && mouse.y > 300 && mouse.held[0]) {
      stage = "menue";
      
      worlds[world_name].courser = courser;

      worlds[world_name].time1 = time1;

      worlds[world_name].inventory = inventory;

      worlds[world_name].armor = armor;

      worlds[world_name].posx = posx;
      worlds[world_name].posy = posy;

      worlds[world_name].health = health;
      worlds[world_name].hunger = hunger;

      worlds[world_name].chests = chests;
      worlds[world_name].land = land;

      worlds[world_name].danger = danger;

      worlds[world_name].animals = animals;

      localStorage.setItem("worlds", JSON.stringify(worlds));
    }
    if (550 < mouse.x && mouse.x < 650 && 250 < mouse.y && mouse.y < 350 && mouse.held[0]) {
      stage = "play";
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(0, 300, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Save & Quit", 10, 350);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 250, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Unpause", 575, 300);
  }

    if (start) {
    courser = 0;

    inventory = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
    craft = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    craft2 = [[1, 0, 0], [1, 0, 0], [0, 0, 0]];

    armor = 0;

    posx = 80001000;
    posy = 80001000;

    health = 100;
    hunger = 100;

    start = false;

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

    chests = {};

    land = run_land();
  }
  

  render1 = false;

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
