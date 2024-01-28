import Phaser from "phaser"
import StateMachine from "../statemachine/StateMachine"
import { sharedInstance as events } from "./EventCenter"

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController{
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine

    private actionReady = false

    constructor(sprite : Phaser.Physics.Matter.Sprite, cursors: CursorKeys){
        this.sprite = sprite
        this.cursors = cursors

        this.createAnimations()

        this.sprite.setRectangle(this.sprite.width * 0.3,this.sprite.height * 0.7) //reduces the size of collision body
        this.sprite.setOrigin(0.5,0.55) //dislocate the image slightly on Y for best fir on tiles/collision 
        this.sprite.setFixedRotation()

        this.stateMachine = new StateMachine(this, "player")

        this.stateMachine
        .addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
        .addState('walk', {
            onEnter: this.walkOnEnter,
            onUpdate: this.walkOnUpdate,
            onExit: this.walkOnExit            
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .addState('action',{
            onEnter: this.actionOnEnter,
            onUpdate: this.actionOnUpdate,
            onExit: this.actionOnExit 
        })
        .addState('dead',{
            onEnter: this.deadOnEnter
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
            const gameObject =  body.gameObject

            if(!gameObject){
                return
            }

            if(gameObject instanceof Phaser.Physics.Matter.TileBody){ //colided with floor or wall
                if(this.stateMachine.isCurrentState('jump')){
                    this.stateMachine.setState('idle')
                }
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            switch(type){ //checking objects in the map
                case 'star':
                    events.emit('star-collected')
                    sprite.destroy()
                    break
                case 'monster':
                    events.emit('got-hit')
                    sprite.destroy()
                    break
            }

        })

        this.actionReady = true
    }

    update(dt: number){
        this.stateMachine.update(dt)
        events.on('dead', this.handleDeath, this)
    }

    private handleDeath(){
        this.stateMachine.setState('dead')
    }

    private idleOnEnter(){
        this.sprite.play('player-idle')
    }

    private idleOnUpdate(){
        if(this.cursors.left.isDown || this.cursors.right.isDown){
            this.stateMachine.setState('walk')
        }

        const actionJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (actionJustPressed){
            this.stateMachine.setState('action')
        } 

        const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        if (jumpJustPressed){
            this.stateMachine.setState('jump')
        }
    }

    private walkOnEnter(){
        this.sprite.play('player-walk')
    }

    private walkOnUpdate(){
        const speed = 3

        if(this.cursors.left.isDown){
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        } else if(this.cursors.right.isDown){
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        } else {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }

        const actionJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (actionJustPressed){
            this.stateMachine.setState('action')
        } 

        const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        if (jumpJustPressed){
            this.stateMachine.setState('jump')
        }   
    }

    private walkOnExit(){
        this.sprite.stop()
    }

    private jumpOnEnter(){
        if(this.stateMachine.previousStateName!='action'){
            this.sprite.setVelocityY(-15)
        }
    }

    private jumpOnUpdate(){
        const speed = 3

        if(this.cursors.left.isDown){
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        } else if(this.cursors.right.isDown){
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }

        const actionJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (actionJustPressed){
            this.stateMachine.setState('action')
        } 
    }

    private actionOnEnter(){
        if(this.actionReady){
            //this.sprite.play('player-action')
            //this.actionReady = false
            console.log('Action triggered')
            //console.log(this.stateMachine.previousStateName)
            
        } else {
            //Not ready yet
        }
        this.stateMachine.setState(this.stateMachine.previousStateName)
    }

    private actionOnUpdate(){
        // any?
    }

    private actionOnExit(){
        this.sprite.stop()
    }

    private deadOnEnter(){
        //this.sprite.play('player-dead')
        console.log("Player is dead!!")
    }

    private createAnimations(){
        /*this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key:'jester',frame: 'penguin_walk01.png' }]
            
        })
        
        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('jester',{ 
                start: 1, 
                end: 4,
                prefix: 'penguin_walk0',
                suffix: '.png'

            }),
            repeat: -1
        })*/

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 3,
            frames: this.sprite.anims.generateFrameNames('jester',{ 
                start: 1, 
                end: 2,
                prefix: 'andando_',
                suffix: '.png'

            }),
            repeat: -1
            
        })
        
        this.sprite.anims.create({
            key: 'player-idle',
            frameRate: 5,
            frames: this.sprite.anims.generateFrameNames('jester',{ 
                start: 1, 
                end: 3,
                prefix: 'iddle_',
                suffix: '.png'

            }),
            repeat: -1
        })

    }
}