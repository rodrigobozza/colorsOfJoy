import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene{

    private cursors! : Phaser.Types.Input.Keyboard.CursorKeys 
    private jester!: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private soundEffects : Phaser.Sound.HTML5AudioSound[]
    //private monsters: MonsterController[] 

    constructor(config: Phaser.Types.Core.GameConfig){
        super('game')
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
                    this.jester = this.matter.add.sprite(x + (width * 0.5), y, 'jester')
                        .setFixedRotation()

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
    }

    update(t: number, dt: number ){
        if (!this.playerController){
            return
        }
        
        this.playerController.update(dt)
    }


}