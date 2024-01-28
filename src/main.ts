import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import ShaderScene from './ShaderScene'
import TestShader from './TestShader'
import Game from './scenes/Game'
import UI from './scenes/UI'

import SadnessPipeline from './scenes/SadnessShader.js'
import GrayScalePipeline from './scenes/GrayScale.js'
import BlurPostFX from './scenes/BlurPostFX.js'

const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL,
	parent: 'app',
	width: 1024,
	height: 1024,
	physics: {
		default: 'matter',
                matter: { debug: true }
		},
    scene: [Game,UI],
    pipeline: { 'sad': SadnessPipeline, 'gray': GrayScalePipeline, 'blur': BlurPostFX }
}

export default new Phaser.Game(config)
