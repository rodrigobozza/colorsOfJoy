import Phaser from "phaser"
import { sharedInstance as events } from './EventCenter'

export default class UI extends Phaser.Scene{
    
    private starLabel!: Phaser.GameObjects.Text
    private starsCollected = 0
    private lifes = 2   

    constructor(){
        super({
            key: 'ui'
        })
    }

    init(){
        this.starsCollected = 0
        this.lifes = 2
    }

    preload(){
    }

    create(){

        this.starLabel = this.add.text(10, 10, 'Score: 0',{
            fontSize: '24px'
        })

        this.add.text(10 ,this.game.canvas.height - 40, 'Colors of Joy',{
            fontSize: '24px',
            color: 'red',
            strokeThickness: 5 
        })

        this.add.text(this.game.canvas.width * 0.5 - 90 , 0, '[ ]',{
            fontSize: '100px',
            strokeThickness: 0 
        })

        events.on('star-collected', this.handleStarCollected, this)
        events.on('got-hit', this.handleGotHit, this)
    }

    private handleStarCollected(){
        console.log('UI: star collected')
        this.starsCollected++
        this.starLabel.text = `Score: ${this.starsCollected}`
    }

    private handleGotHit(){
        console.log('Got hit')
        this.lifes--
        if(this.lifes <= 0){
            events.emit('dead')
            //console.log("UI: Player is dead!!!")
        }

    }
}