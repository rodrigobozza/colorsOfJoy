import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'

import SadnessPipeline from './scenes/SadnessShader.js'

const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL,
	parent: 'app',
	width: 1024,
	height: 1024,
	physics: {
		default: 'matter',
                matter: { debug: false }
		},
    scene: [Game,UI],
    pipeline: { 'sad': SadnessPipeline }
}

export default new Phaser.Game(config)
