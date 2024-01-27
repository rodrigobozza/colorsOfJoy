import Phaser from 'phaser'

export default class TestShader extends Phaser.Scene {

    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('face', '../assets/bw-face.png');
        this.load.image('metal', '../assets/alien-metal.jpg');
        this.load.image('grass', '../assets/grass.png');
        this.load.image('tiles', '../assets/tiles.jpg');
        this.load.image('logo', '../assets/phaser3-logo-small.png');
    }

    create ()
    {
        const frag = `
        precision mediump float;

        uniform vec2 resolution;
        uniform float pixelSize;

        varying vec2 fragCoord;

        void main (void)
        {
            vec2 uv = fragCoord / resolution.xy;

            gl_FragColor = vec4(vec3(uv.xy, 1.0), 1.0);
        }
        `;

        const base = new Phaser.Display.BaseShader(
            'pixelate',
            frag,
            null,
            {
                pixelSize: { type: '1f', value: 0.2 }
            }
        );

        const shader = this.add.shader(base, 400, 300, 800, 600, [ 'metal' ]);

        shader.setUniform('pixelSize.value', 0.2);

        console.log(shader);
    }
}
