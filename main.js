/*=====================================================================================
									 Helper functions
=======================================================================================*/
const storage = localStorage; // Shortcut

const byId = function(id) { // Shortcut
	return document.getElementById(id);
}

function hide(id) {
    byId(id).style.display = "none";
}

function display(id) {
    byId(id).style.display = "block";
    if(id == 'menu') { // Updates values shown on the front screen
    	byId('whichMode').innerHTML = 'MODE: ' + Math.sqrt(tileAmount) + 'x' + Math.sqrt(tileAmount);
    	byId('highscore').innerHTML = 'HIGHSCORE: ' + highscore;
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(sound) {
	const audio = byId(sound);
	audio.currentTime = 0;
	audio.play();
}
/*=====================================================================================
									 Game code
=======================================================================================*/
const colorSequence = ['#00afbf', '#22c7d6', '#00ccb8', '#14d9c5', '#14d9c5', '#2285d6', '#a322d6', '#cd56fc', '#e299ff', '#ff99eb', '#f56786', '#f73962', '#f73939', '#00afbf', '#22c7d6', '#00ccb8', '#14d9c5', '#3ff731', '#12ff00'];
var colorSequencePos = 0;
setInterval(function() { // Gradually chaning the background color
  document.body.style.backgroundColor = colorSequence[colorSequencePos];

  const x = document.getElementsByClassName('btn');
  for (let i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = colorSequence[colorSequencePos]; // Changes every button
  }
  if(tilesTapped >= 10) { // Only changes color to this if the text is white, to improve visibility
  	byId('color').style.backgroundColor = 'white';
  } else {
  	byId('color').style.backgroundColor = colorSequence[colorSequencePos];
  }
  byId('gameOver').style.backgroundColor = colorSequence[colorSequencePos];
  byId('bar').style.backgroundColor = colorSequence[colorSequencePos+4];
  colorSequencePos++;
  if(colorSequencePos == colorSequence.length) {colorSequencePos = 0;}
}, 2000);

var colorsEnglish = ['blue', 'red', 'green', 'orange', 'yellow', 'pink', 'purple'];
var baseColors = ['blue', 'red', 'green', 'orange', 'yellow', 'pink', 'purple'];
var colorCodes = ['#00AFEF', '#DE0000', '#00C300', '#FF6700', '#FFF100', '#FF00FF', '#68006A'];
var iterations = 0;
var sizes = [1, 4, 9, 16, 25, 36, 49];
var specialTile;
byId('favicon').href = 'images/' + colorsEnglish[Math.floor(Math.random() * colorsEnglish.length)] + '.png';
var timer = 5000;
async function createField(which, whichSize) {
	size = which;

	if(iterations == 0) {
		specialTile = Math.floor(Math.random() * size);
		specialTileColor = window['colors' + whichLanguage][Math.floor(Math.random() * window['colors' + whichLanguage].length)];
		var index = baseColors.indexOf(colorsEnglish[window['colors' + whichLanguage].indexOf(specialTileColor)]);
  		baseColors.splice(index, 1);
  		byId('color').innerHTML = (specialTileColor.charAt(0).toUpperCase() + specialTileColor.slice(1));
  		byId('time').innerHTML = Math.round(timer / 1000);
  		if(tilesTapped >= 10) {
  			byId('color').style.color = colorCodes[Math.floor(Math.random() * colorCodes.length)];
  		} else {
  			byId('color').style.color = 'white';
  		}
  	}

  	if(iterations == specialTile) {
  		var color = colorsEnglish[window['colors' + whichLanguage].indexOf(specialTileColor)];
  	} else {
  		var color = baseColors[Math.floor(Math.random() * baseColors.length)];
	}
	if(whichSize == 1) {
		hide('time');
	}
	var str = document.createElement('span');
	tileSize = 86 / whichSize;
	str.innerHTML = '<img draggable="false" style="border:2px solid white; border-radius:8px; margin:2px; width:' + tileSize + '%; height:' + tileSize + '%;"  onclick="tap(' + iterations + ')" id="' + iterations + '" src="images/' + color + '.png"/>';
	byId("squareAnchor").append(str);

	iterations++;
	if(iterations < which) {
		createField(which, whichSize);
	} else {
		iterations = 0;
		baseColors = ['blue', 'red', 'green', 'orange', 'yellow', 'pink', 'purple'];
	}
}

document.addEventListener("backbutton", backKey, false); // Adds a listener to the back button on Android phones

function backKey() { // Hides all menus, shows front screen
	if(byId('gameArea').style.display != 'block' || byId('modal').style.display == 'block') { // Blocks use while game is active
		hide('mode');
		hide('gameArea');
		hide('language');
		hide('modal');
		display('menu');
	}
}

function changeSize(num) {
	tileAmount = num;
	backKey();
	save();
}

function play() { 
	hide('menu');
	display('gameArea');
	display('time');
	hide('modal');
	hundredPercent = 5000;
	gameActive = true;
	clear();
	createField(tileAmount, Math.sqrt(tileAmount));
	updateBar();
}

var gameActive;
setInterval(function timerCount() {
	if(gameActive) {
		if(timer <= 0) {
			tap(-1);
		} else {
			timer -= 10;
			updateBar();
			byId('time').innerHTML = Math.round(timer / 1000);
		}
	}
}, 10);

function updateBar() {
	byId('bar').style.width = ((timer / hundredPercent)) * 100 + '%';
}

var tileAmount = 0;
var score = 0;
var highscore = 0;
var looseTime = 0;
var hundredPercent = 0;
var tilesTapped = 0;
function tap(id) {
	if(id == specialTile) {
		score += Math.round(timer / hundredPercent * 10);
		tilesTapped++;
		gameActive = true;
		timer = 5000;
		timer -= looseTime;
		hundredPercent = timer;
		updateBar();
		if(looseTime <= 2000) {
			looseTime += 100;
		}
		byId('score').innerHTML = score;
		clear();
		createField(tileAmount, Math.sqrt(tileAmount));
	} else {
		byId('modal').style.display = "block";
		byId('thisScore').innerHTML = 'Score: ' + score + '<br />Tiles tapped:&nbsp; ' + tilesTapped;
		gameActive = false;
		if(score > highscore) {
			highscore = score;
		}
		score = 0;
		tilesTapped = 0;
		timer = 5000;
		looseTime = 0;
		hide('time');
		byId('score').innerHTML = score;
		save();
	}
}

function clear() {
	for(var i = 0; i <= 30; i++) {
		if(byId(i) != null) {
	    	var elem = document.getElementById(i);
   			elem.parentNode.removeChild(elem);
   		}
	}
}

var colorsHindi = ['नीला', 'लाल', 'हरा', 'संतरा', 'पीला', 'गुलाबी', 'बैंगनी'];
var colorsRussian = ['синий', 'красный', 'зеленый', 'оранжевый', 'желтый', 'розовый', 'фиолетовый'];
var colorsSpanish = ['azul', 'rojo', 'verde', 'naranja', 'amarillo', 'rosa', 'púrpura'];
var colorsGerman = ["Blau", "Rot", "Grün", "Orange", "Gelb", "Rosa", "Lila"];
var colorsFrench = ['bleu', 'rouge', 'vert', 'orange', 'jaune', 'rose', 'violet'];
var colorsIndonesian = ['biru', 'merah', 'hijau', 'oranye', 'kuning', 'merah muda', 'ungu'];
var colorsPortuguese = ['azul', 'vermelho', 'verde', 'laranja', 'amarelo', 'rosa', 'roxo'];
var colorsArabic = ["الأزرق" , "الأحمر" , "الأخضر" , "البرتقالي" , "الأصفر" , "الوردي" , "الأرجواني"];
var colorsJapanese = ['「青」', '「赤」', '「緑」', '「オレンジ」', '「黄色」', '「ピンク」', '「紫」'];
var colorsChinese = ['蓝色', '红色', '绿色', '橙色', '黄色', '粉红色', '紫色'];
var colorsKorean = ['파란색', '빨간색', '녹색', '주황색', '노란색', '분홍색', '보라색'];

var whichLanguage = 'English';
function language(which) {
	whichLanguage = which;
	backKey();
}

function save() {
	storage.tileAmount = tileAmount;
	storage.highscore = highscore;
	storage.whichLanguage = whichLanguage;
}

load();
display('menu');
function load() {
	if(storage.highscore == 0 || storage.highscore == undefined) {
		tileAmount = 4;
		highscore = 0;
		whichLanguage = 'English';
	} else {
		tileAmount = storage.tileAmount;
		highscore = storage.highscore;
		whichLanguage = storage.whichLanguage;
	}
}
