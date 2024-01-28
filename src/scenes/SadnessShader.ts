/*const sadnessShader = `
precision mediump float;

uniform float h1f;
uniform float h2f;
uniform float h3f;
uniform float h4f;
uniform float h5f;
uniform float h6f;

uniform vec2 resolution;
uniform sampler2D iChannel0[%count%];

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
     vec4 = texture;
     %forloop%
     gl_FragColor = texture;

   
     vec2 uv = vec2(0.0);

     %forloop%

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


export default class SadnessPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
	    fragShader,
            uniforms: [
                'h1f',
		'h2f',
		'h3f',
		'h4f',
		'h5f',
		'h6f',
		'resolution',
		'iChannel0'
            ]
        });
	
	this.h1f = 0.0;
	this.h2f = 0.0;
	this.h3f = 0.0;
	this.h4f = 0.0;
	this.h5f = 0.0;
	this.h6f = 0.0;
	this._gray = 1;
    }

    onPreRender () 
    {
	this.set1f('h1f', 0.0);
	this.set1f('h2f', 0.0);
	this.set1f('h3f', 0.0);
	this.set1f('h4f', 0.0);
	this.set1f('h5f', 0.0);
	this.set1f('h6f', 0.0);
    }    
}*/
const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float gray;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture;

    %forloop%

    gl_FragColor = texture;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);
}
`;

export default class SadnessPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader,
            uniforms: [
 /*               'uProjectionMatrix',
                'uMainSampler',*/
                'gray'
            ]
        });

        this._gray = 1;
    }

    onPreRender ()
    {
        this.set1f('gray', this._gray);
    }

    get gray ()
    {
        return this._gray;
    }

    set gray (value)
    {
        this._gray = value;
    }
}
