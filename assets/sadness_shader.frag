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

void main() {
     
     vec2 uv = vec2(0.0);
     uv.x = (fragCoord.x / resolution.x);
     uv.y = 1.0 - (fragCoord.y / resolution.y);
     vec4 p = texture2D(iChannel0, uv);

     bool h1 = true;
     bool h2 = true;
     bool h3 = true;
     bool h4 = true;
     bool h5 = true;
     bool h6 = true;

     if(p.a > 0.0 && (h1 || h2 || h3 || h4 || h5 || h6)) {

          vec3 normRGB = vec3(p.r / 255.0, p.g / 255.0, p.b / 255.0);
	  //vec3 normRGB = vec3(p.rgb);
	  vec3 hsv = vec3(0.0);

          float Cmax = max(max(normRGB.r, normRGB.g), normRGB.b);
          float Cmin = min(min(normRGB.t, normRGB.g), normRGB.b);
	  float deltaC = Cmax - Cmin;

	  if(Cmax == Cmin)
	       hsv.r = 0.0;
	  else if(Cmax == normRGB.r) {
	       float x = (normRGB.g - normRGB.b) / deltaC;
	       float y = 6.0;
	       hsv.r = x - y * floor(x/y);
	  }
	  else if(Cmax == normRGB.g)
	       hsv.r = 60.0 * (((normRGB.b - normRGB.r) / deltaC) + 2.0);
	  else if(Cmax == normRGB.b)
	       hsv.r = 60.0 * (((normRGB.r - normRGB.g) / deltaC) + 4.0);

          //Unecessary calculation as we do not need saturation or value to decide
	  //hsv.g = Cmax != 0 ? (deltaC / Cmax) : 0;
	  //hsv.b = Cmax;

          hsv.r = mod(hsv.r, 360.0);

	  if( (!h1 && (hsv.r > 335.0 || (hsv.r > 0.0 && hsv.r <= 33.0))) ||
	      (!h2 && hsv.r > 33.0 && hsv.r <= 69.0) ||
	      (!h3 && hsv.r > 69.0 && hsv.r <= 150.0) ||
	      (!h4 && hsv.r > 150.0 && hsv.r <= 210.0) ||
	      (!h5 && hsv.r > 210.0 && hsv.r <= 278.0) ||
	      (!h6 && hsv.r > 278.0 && hsv.r <= 335.0))
	       p = vec4(vec3(p.r / 2.0 + p.g / 2.0 + p.b / 2.0), p.a);
	       
     }
     else {

          p = vec4(vec3(p.r / 2.0 + p.g / 2.0 + p.b / 2.0), p.a);

     }
     float factor = abs(sin(time));
     gl_FragColor = vec4(p.r * factor, p.g * factor, p.b * factor, 1.0);

}