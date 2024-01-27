let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["烧火棍"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: '烧火棍', power: 5 },
  { name: '匕首', power: 30 },
  { name: '羊角锤', power: 50 },
  { name: '倚天剑', power: 100 }
];
const monsters = [
  {
    name: "史莱姆",
    level: 2,
    health: 15
  },
  {
    name: "巨齿兽",
    level: 8,
    health: 60
  },
  {
    name: "巨龙",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["去商店", "去洞穴", "挑战巨龙"],
    "button functions": [goStore, goCave, fightDragon],
    text: "你现在在城镇广场。你看见一个标志牌写着‘商店‘. "
  },
  {
    name: "store",
    "button text": ["购买10血量(10金币)", "购买武器(30 金币)", "去城镇广场"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "你进入了商店."
  },
  {
    name: "cave",
    "button text": ["挑战史莱姆", "挑战巨齿兽", "去城镇广场"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "你进入了洞穴,你看见了很多怪兽."
  },
  {
    name: "fight",
    "button text": ["攻击", "闪避", "撤退"],
    "button functions": [attack, dodge, goTown],
    text: "你正在挑战一个怪兽."
  },
  {
    name: "kill monster",
    "button text": ["去城镇广场", "去城镇广场", "去城镇广场"],
    "button functions": [goTown, goTown, easterEgg],
    text: '怪物惨叫而亡，你获得了经验值和金币。'
  },
  {
    name: "lose",
    "button text": ["重新开始?", "重新开始?", "重新开始?"],
    "button functions": [restart, restart, restart],
    text: "胜败乃兵家常事也，大侠请重新来过吧 ☠️"
  },
  {
    name: "win",
    "button text": ["重新开始?", "重新开始?", "重新开始?"],
    "button functions": [restart, restart, restart],
    text: "恭喜大侠，你击败了巨龙！！！！ 🎉"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "你发现了一个彩蛋,请选择一个上面的数字,下面将会随机生成10个1~10之间的数字,如果下面的随机数字中有你选择的数字,你将会获得奖励!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "你没有足够的金币来购买血量.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "你现在拥有 " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " 你现在拥有的武器: " + inventory;
    } else {
      text.innerText = "你没有足够的金币来购买武器.";
    }
  } else {
    text.innerText = "你已经拥有最高等级的武器了!";
    button2.innerText = "以15金币来出售你的武器";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "你出售了一个 " + currentWeapon + ".";
    text.innerText += " 你现在拥有的武器是: " + inventory;
  } else {
    text.innerText = "请不要出售你唯一的武器!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = monsters[fighting].name + " 发起了攻击.";
  text.innerText += " 你使用 " + weapons[currentWeapon].name + "攻击了它.";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " 你MISS了!!!!.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " 你的 " + inventory.pop() + " 损坏了.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "你躲闪了来自 " + monsters[fighting].name + "的攻击.";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["烧火棍"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "你选择了 " + guess + ". 下面是随机数字:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "恭喜! 你获得了20金币!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "抱歉! 你损失了10血量!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}