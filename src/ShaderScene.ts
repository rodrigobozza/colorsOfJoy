import Phaser from 'phaser'
import Key from './Key'

const frag = `
precision mediump float;

uniform float h1f;
uniform float h2f;
uniform float h3f;
uniform float h4f;
uniform float h5f;
uniform float h6f;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main() {
     
     vec2 uv = vec2(0.0);
     uv.x = (fragCoord.x / resolution.x);
     uv.y = 1.0 - (fragCoord.y / resolution.y);
     vec4 originalPixel = texture2D(iChannel0, uv);
     vec4 grayPixel = vec4(vec3(originalPixel.r / 2.0 + originalPixel.g / 2.0 + originalPixel.b / 2.0), originalPixel.a);
     vec4 finalPixel = grayPixel;

     vec3 hsv = rgb2hsv(originalPixel.rgb);
     hsv.r *= 360.0;

     bool h1 = (h1f > 0.0);
     bool h2 = (h2f > 0.0);
     bool h3 = (h3f > 0.0);
     bool h4 = (h4f > 0.0);
     bool h5 = (h5f > 0.0);
     bool h6 = (h6f > 0.0);

     if(h1 || h2 || h3 || h4 || h5 || h6) {

          if( (h1 && (hsv.r > 335.0 || (hsv.r >= 0.0 && hsv.r <= 33.0))) ||
	      (h2 && hsv.r > 33.0 && hsv.r <= 69.0) ||
	      (h3 && hsv.r > 69.0 && hsv.r <= 150.0) ||
	      (h4 && hsv.r > 150.0 && hsv.r <= 210.0) ||
	      (h5 && hsv.r > 210.0 && hsv.r <= 278.0) ||
	      (h6 && hsv.r > 278.0 && hsv.r <= 335.0))
              finalPixel = originalPixel;
          else
              finalPixel = grayPixel;
	       
     }
     
     gl_FragColor = finalPixel;

}
`;

export default class ShaderScene extends Phaser.Scene {

    keys: Key[];
    hues: number[];
    
    constructor() {
	super('ShaderScene');
    }

    preload() {
	this.load.image('jester', '../assets/sprites/image.png');
    }

    create() {
	
	this.hues = new Array(6);
	for(var i = 0; i < 6; ++i)
	    this.hues[i] = 0.0;
	
	
	this.keys = new Array(6);
	this.keys[0] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE));
	this.keys[1] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO));
	this.keys[2] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE));
	this.keys[3] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR));
	this.keys[4] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE));
	this.keys[5] = new Key(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX));

	const base = new Phaser.Display.BaseShader('sadness', frag, null,
						   {
						       h1f: { type: '1f', value: 0.0 },
						       h2f: { type: '1f', value: 0.0 },
						       h3f: { type: '1f', value: 0.0 },
						       h4f: { type: '1f', value: 0.0 },
						       h5f: { type: '1f', value: 0.0 },
						       h6f: { type: '1f', value: 0.0 },
						       hue: { type: '1f', value: 0.0 }
						   });
	
	this.shaderReference = this.add.shader(base, 512, 512, 1024, 1024, ['jester']);
	this.shaderReference.setUniform('resolution.value.x', 1024);
	this.shaderReference.setUniform('resolution.value.y', 1024);
	this.resetHues();

	console.log(this.shaderReference);

    }

    update() {

	for(var i = 0; i < 6; ++i) {
	    this.keys[i].update();

	    if(this.keys[i].isPressed()) {
		this.hues[i] = this.hues[i] > 0.0 ? 0.0 : 1.0;
	    }
	}

	this.resetHues();
    }

    resetHues() {
	this.shaderReference.setUniform('h1f.value', this.hues[0]);
	this.shaderReference.setUniform('h2f.value', this.hues[1]);
	this.shaderReference.setUniform('h3f.value', this.hues[2]);
	this.shaderReference.setUniform('h4f.value', this.hues[3]);
	this.shaderReference.setUniform('h5f.value', this.hues[4]);
	this.shaderReference.setUniform('h6f.value', this.hues[5]);
    }
	
    
}
