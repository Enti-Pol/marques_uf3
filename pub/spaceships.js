

const scene_w = 640;
const scene_h = 480;

let player_init_x = 32;

let bg = [];
let player;
let enemies = [];
let bullets = [];

let text;
let score = 0;

let up_key;
let down_key;
let space_key;

const BULLET_INIT_X = -1000;
const BULLET_INIT_Y = -1000;
const BACK_INIT_X = 960;

const MAX_BACK = 4;
const MAX_ENEMIES = 20;
const MAX_BULLETS = 3;

const SCREEN_MARGIN = 32;

let the_game = this;

function preload() {
	the_game = this;
	this.load.image("background", "stars.jpg");
	this.load.image("character", "PNG/Characters/woman.png");
	this.load.image("enemy", "PNG/Characters/man.png");
	this.load.image("bullet", "PNG/Cars/scooter.png");
	this.load.image("explosion", "PNG/explosion.png");
}

function create() {	
	for (let i = 0; i < MAX_BACK; i++){
		let init_back_x = 320;
		if (i == 1){init_back_x += 320;}
		else if (i == 2){init_back_x += 640;}
		else if (i == 3){init_back_x += 960;}
		bg.push(this.add.image(init_back_x, scene_h/2, "background"));
	}
	player = this.physics.add.image(player_init_x, scene_h/2, "character");
	player.setScale(2);

	for (let i = 0; i < MAX_ENEMIES; i++){
		let randomH = Math.random() * (scene_h - 130) + 70;
		let randomW = Math.random() * (scene_w*4) + scene_w/2;
		enemies.push(this.physics.add.image(randomW, randomH, "enemy"));
	}

	for (let i = 0; i < MAX_BULLETS; i++){
		bullets.push(this.physics.add.image(-100, -100, "bullet"));

		bullets[i].moving = false;
	}

	up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);	
	space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	
	text = this.add.text(10, 10, 'Score: ', { font: '32px Courier', fill: '#ffffff'});
	var emitter0 = this.add.particles('explosion').createEmitter({
		x: -1000,
		y: -1000,
		speed: { min: -100, max: 100},
		angle: { min: 0, max: 360 },
		scale: { start: 0.1, end: 0 },
		blendMode: 'SCREEN',
		lifespan: 300,
		gravityY: 0
	});
	enemies.forEach(function (element){
		the_game.physics.add.overlap(player, element, function (){ the_game.scene.restart(); score = 0;})
		the_game.physics.add.overlap(bullets, element, function (){ emitter0.setPosition(element.x, element.y); emitter0.explode(); element.x += 640; score += 1;})
		});

}

function bg_check(bg){
		if (bg.x <= -320){
			bg.x = BACK_INIT_X;
		}
}

function update() {
	if (up_key.isDown){
		player.y--;
		if (player.y <= 70) {
			player.y++;
		}
	}
	else if (down_key.isDown){
		if (player.y >= 410) {
			player.y--;
		}
		player.y++;
	}

	if (Phaser.Input.Keyboard.JustDown(space_key)){
		let found = false;

		for (let i = 0; i < MAX_BULLETS && !found; i++){
			if (!bullets[i].moving){
				bullets[i].moving = true;
				bullets[i].x = player.x;
				bullets[i].y = player.y;
				found = true;
			}
		}
	}
	
	for (let i = 0; i < MAX_BULLETS; i++){
		if (bullets[i].moving){
			bullets[i].x += 3;

			if (bullets[i].x >= scene_w + SCREEN_MARGIN){
				bullets[i].x = BULLET_INIT_X;
				bullets[i].y = BULLET_INIT_Y;

				bullets[i].moving = false;
			}
		}
	}

	for (let i = 0; i < MAX_ENEMIES; i++){
		enemies[i].x--;
	}
	for (let i = 0; i < MAX_BACK; i++){
		bg[i].x--;
	}

	text.setText('Score: ' + score);

	bg.forEach(bg_check);
	enemies.forEach(bg_check);
}

const config = {
	type: Phaser.AUTO,
	width: scene_w,
	height: scene_h,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: { debug:false}
		},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

let game = new Phaser.Game(config);
