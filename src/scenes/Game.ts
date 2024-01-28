import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene{

    private cursors! : Phaser.Types.Input.Keyboard.CursorKeys 
    private jester!: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    //private monsters: MonsterController[] 

    constructor(config: Phaser.Types.Core.GameConfig){
        super('game')
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
        this.scene.launch('ui')
        this.cameras.main.setBounds(0, 0, undefined, undefined, true);   

        const map = this.make.tilemap({ key: 'tilemap'})
        const tileset = map.addTilesetImage('iceworld', 'tiles')
        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer?.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch(name){
                case 'player-spawn':{
                    this.jester = this.matter.add.sprite(x + (width * 0.5), y, 'jester')
                        .setFixedRotation()

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
    }

    update(t: number, dt: number ){
        if (!this.playerController){
            return
        }
        
        this.playerController.update(dt)
    }


}