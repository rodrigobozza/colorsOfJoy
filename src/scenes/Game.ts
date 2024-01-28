import Phaser from 'phaser'
import PlayerController from './PlayerController'
import Key from '../Key'

export default class Game extends Phaser.Scene{

    private cursors! : Phaser.Types.Input.Keyboard.CursorKeys 
    private jester!: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
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
    }

    preload(){
        this.load.atlas('jester','assets/jester.png', 'assets/jester.json')
        this.load.image('tiles', 'assets/sheet.png')
        this.load.tilemapTiledJSON('tilemap','assets/game.json')

        this.load.image('monster', 'assets/monster.png')

        this.load.image('star', 'assets/star.png')
    }

    create(){
	this.keys = new Array(6);
        this.keys[0] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE));
	this.keys[1] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO));
	this.keys[2] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE));
	this.keys[3] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR));
	this.keys[4] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE));
	this.keys[5] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX));

	this.hues = new Array(6);
	for(var i = 0; i < 6; ++i)
	    this.hues[i] = 0.0;
	
        this.scene.launch('ui')
        this.cameras.main.setBounds(0, 0, undefined, undefined, true);
	this.cameras.main.setPostPipeline('sad');

        this.cam2 = this.cameras.add(this.cameras.main.x, this.cameras.main.y, 1024, 1024);
        this.cam2.setBounds(0, 0, undefined, undefined, true);
        const map = this.make.tilemap({ key: 'tilemap'})
        const tileset = map.addTilesetImage('iceworld', 'tiles')
        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer?.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch(name){
                case 'player-spawn':{
                    this.jester = this.matter.add.sprite(x + (width * 0.5), y, 'jester').setFixedRotation()
		    //this.jester.setPipeline('sad')

                    this.playerController = new PlayerController(this.jester, this.cursors)
        
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
