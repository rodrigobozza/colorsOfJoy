import Phaser from 'phaser'
import PlayerController from './PlayerController'
import Key from '../Key'

export default class Game extends Phaser.Scene{

    private cursors! : Phaser.Types.Input.Keyboard.CursorKeys 
    private jester!: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private soundEffects : Phaser.Sound.HTML5AudioSound[]
    //private monsters: MonsterController[] 

    constructor(config: Phaser.Types.Core.GameConfig){
        super('game')
	this.cam2 = 0;
	this.keys;
	this.hues;
//	this.shader = new SadnessFX(this.game);
    }

    init(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.soundEffects = []
    }

    preload(){
        this.load.atlas('jester','assets/jester.png', 'assets/jester.json')
        this.load.image('tiles1', 'assets/tiles-1.png')
        this.load.image('tiles2', 'assets/tiles-2.png')
        this.load.tilemapTiledJSON('tilemap','assets/game.json')

        //Load Sprites
        this.load.image('monster', 'assets/monster.png')
        this.load.image('star', 'assets/star.png')

        //Load Sound Effects
        this.load.setPath('assets/audio/')
        this.load.audio('backgroundSong',['song.ogg'])
        
        this.load.audio('jumpSound', ['jump.ogg'])
        this.load.audio('walkSound', ['armhole-farting.ogg'])
        this.load.audio('gotHitSound', ['ugh.ogg'])
        this.load.audio('grimaceSound', ['peekaboo.ogg'])
        this.load.audio('deadSound', ['morrendo.ogg'])
        this.load.audio('shotSound', ['arremesso.ogg'])
        this.load.audio('shotHitSound', ['splash.ogg'])
        this.load.audio('madeLaughSound', ['aleluia.ogg'])

    }

    create(){

	this.keys = new Array(6);
        this.keys[0] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE));
	this.keys[1] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO));
	this.keys[2] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE));
	this.keys[3] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR));
	this.keys[4] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE));
	this.keys[5] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX));

        this.scene.launch('ui')
        this.cameras.main.setBounds(0, 0, undefined, undefined, true);

        this.sound.stopAll()
        this.sound.removeAll()
        // Play the bgSong in loop
        const bgSound = this.sound.add('backgroundSong')
        bgSound.loop = true
        bgSound.volume = 1
        bgSound.play()
        
        this.soundEffects.push(this.sound.add('jumpSound')) // 0
        this.soundEffects.push(this.sound.add('walkSound')) // 1
        this.soundEffects.push(this.sound.add('gotHitSound')) // 2
        this.soundEffects.push(this.sound.add('grimaceSound')) // 3
        this.soundEffects.push(this.sound.add('deadSound')) // 4
        this.soundEffects.push(this.sound.add('shotSound')) // 5
        this.soundEffects.push(this.sound.add('shotHitSound')) // 6
        this.soundEffects.push(this.sound.add('madeLaughSound')) // 7

	this.hues = new Array(6);
	for(var i = 0; i < 6; ++i)
	    this.hues[i] = 0.0;

	this.cameras.main.setPostPipeline('sad');

        this.cam2 = this.cameras.add(this.cameras.main.x, this.cameras.main.y, 1024, 1024);
        this.cam2.setBounds(0, 0, undefined, undefined, true);

        const map = this.make.tilemap({ key: 'tilemap'})
        const tileset1 = map.addTilesetImage('tiles-1', 'tiles1')
        const tileset2 = map.addTilesetImage('tiles-2', 'tiles2')
        
        const background = map.createLayer('background', tileset2)
        const decoration1 = map.createLayer('decoration-t1', tileset1)
        const decoration2 = map.createLayer('decoration-t2', tileset2)

        const ground = map.createLayer('ground', tileset1)
        ground.setCollisionByProperty({ collides: true })

        
        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer?.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch(name){
                case 'player-spawn':{
                    this.jester = this.matter.add.sprite(x + (width * 0.5), y, 'jester').setFixedRotation()
		    //this.jester.setPipeline('sad')

                    this.playerController = new PlayerController(this.jester, this.cursors, this.soundEffects)
        
                    this.cameras.main.startFollow(this.jester, undefined, undefined, undefined, undefined, 150)

		    
                    break;
                }
                case 'star':{
                    const star = this.matter.add.sprite(x, y, 'star', undefined,{
                        isStatic: true,
                        isSensor: true
                    })
                    star.setData('type','star')
                    break;
                }

                case 'monster':{
                    const monster = this.matter.add.sprite(x, y, 'monster')
                    monster.setData('type','monster')
                    //this.monsters.push(monster)
                    break;
                }
            }
        })

        this.matter.world.convertTilemapLayer(ground)
        this.cameras.main.ignore(this.jester);
	this.cam2.ignore(ground);
	this.cam2.ignore(decoration1);
	this.cam2.ignore(decoration2);
	this.cam2.ignore(background);
	this.cam2.startFollow(this.jester, undefined, undefined, undefined, undefined, 150);

    }

    update(t: number, dt: number ){
        if (!this.playerController){
            return
        }
        
        this.playerController.update(dt);

	for(var i = 0; i < 6; ++i) {
	    this.keys[i].update();

	    if(this.keys[i].isPressed()) {
		this.hues[i] = this.hues[i] > 0.0 ? 0.0 : 1.0;
	    }
	}

	for(var i = 0; i <= this.playerController.hueCount; ++i)
	    this.hues[i] = 1.0;

	this.resetHues();
	
    }

    resetHues() {
	let shaderReference: SadnessPipeline = this.cameras.main.getPostPipeline('sad');
	shaderReference.h1f = this.hues[0];
	shaderReference.h2f = this.hues[1];
	shaderReference.h3f = this.hues[2];
	shaderReference.h4f = this.hues[3];
	shaderReference.h5f = this.hues[4];
	shaderReference.h6f = this.hues[5];
    }

}
