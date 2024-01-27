import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import ShaderScene from './ShaderScene'
import TestShader from './TestShader'

const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL,
	parent: 'app',
	width: 800,
	height: 600,
	/*physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},*/
	scene: [ShaderScene],
}

export default new Phaser.Game(config)
