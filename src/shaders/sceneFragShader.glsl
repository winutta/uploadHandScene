
#define PI 3.1415926538


varying vec3 pos;
uniform float iTime;
varying vec2 vUV;
varying vec3 n;
uniform sampler2D envMapBlur;
uniform sampler2D envMapClear;

float getAngle(vec2 v1,vec2 v2)
{
    //return atan(v1.x,v1.y) -atan(v2.x,v2.y);
    return mod( atan(v1.x,v1.y) -atan(v2.x,v2.y), PI*2.)/PI/2.; //0 ... TWOPI
    //return mod( atan(v1.x,v1.y) -atan(v2.x,v2.y), TWOPI) - PI; //-pi to +pi 
}

vec4 getEnvMap(vec3 n,sampler2D envMap){
  float aXZ = getAngle(n.xz,vec2(1.,0.));
  float aUD = getAngle(vec2(length(n.xz),-n.y),vec2(0.,1.));
  return texture2D(envMap,vec2(aXZ,aUD*2.));
}

vec3 computeIrradiance(vec3 n)
{
  // Coefficients for SH 03
  vec3 l_0_p0 = vec3(0.379727,0.427857,0.452654);
  vec3 l_1_n1 = vec3(0.288207,0.358230,0.414330);
  vec3 l_1_p0 = vec3(0.039812,0.031627,0.012003);
  vec3 l_1_p1 = vec3(-0.103013,-0.102729,-0.087898);
  vec3 l_2_n2 = vec3(-0.060510,-0.053534,-0.037656);
  vec3 l_2_n1 = vec3(0.008683,-0.013685,-0.045723);
  vec3 l_2_p0 = vec3(-0.092757,-0.124872,-0.152495);
  vec3 l_2_p1 = vec3(-0.059096,-0.052316,-0.038539);
  vec3 l_2_p2 = vec3(0.022220,-0.002188,-0.042826);
    
  highp vec3 irr = vec3(0.0);
  
  float c1 = 0.429043;
  float c2 = 0.511664;
  float c3 = 0.743125;
  float c4 = 0.886227;
  float c5 = 0.247708;
  
  irr += c1 * l_2_p2 * (n.x*n.x - n.y*n.y); 
  irr += c3 * l_2_p0 * (n.z*n.z);
  irr += c4 * l_0_p0;
  irr -= c5 * l_2_p0;
  irr += 2.0 * c1 * (l_2_n2*n.x*n.y + l_2_p1*n.x*n.z + l_2_n1*n.y*n.z);
  irr += 2.0 * c2 * (l_1_p1*n.x + l_1_n1*n.y + l_1_p0*n.z);
  
  return vec3(irr);
}


void main() {
  vec3 col = vec3(1.,0.,0.);
  vec3 color3 = vec3(60., 54., 69.)/255.;
  vec3 red = vec3(166.,16.,30.)/255.;
  vec3 green = vec3(0.,0.8,0.5);
  vec3 peach = vec3(232., 102., 115.)/255.;


  col = color3;
  // col = vec3(sin(pos.y*10.)/2. + 0.5,0.,0.);

  vec3 light = vec3(0., 2.,-0.5);
  vec3 lightDir = normalize(light-pos);
  float dist = length(light-pos);
  float fade = smoothstep(3.,1.,dist);
  fade = 1.;

  vec3 viewDir = normalize(pos - cameraPosition);
  vec3 reflDir = reflect(viewDir,n);
  vec3 refrDir = refract(viewDir,n,1.33);

  float b = max(0.,dot(n,lightDir));
  float b2 = max(0.,dot(reflDir,lightDir));

  vec3 envMapColorBlur = getEnvMap(reflDir,envMapBlur).rgb;
  vec3 envMapColorIrr = getEnvMap(n,envMapBlur).rgb;
  vec3 envMapColorClear = getEnvMap(reflDir,envMapClear).rgb;
  vec3 envMapColorRefr = getEnvMap(refrDir,envMapClear).rgb;
  vec3 envMapColor = mix(envMapColorClear.rgb,envMapColorBlur.rgb,1.);

  // float envMapBrightness = length(envMapColorBlur);

  /////////Original 
  col = mix(col,envMapColorBlur*5.,0.5);
  col += pow(b2,1.)*fade* red;
  /////////

  // col = mix(col,vec3(envMapBrightness)*5.*vec3(0.,0.2,0.8),0.5);
  // col += pow(b2,4.)*fade* green;

  vec3 irrN = computeIrradiance(n);
  vec3 irrRefl = computeIrradiance(reflDir);

  // col = envMapColorRefr*5.;


  // col = irrN*peach;
  // col += pow(b,1.)*fade* vec3(166.,16.,30.)/255.;
  // col = mix(col, envMapColor*1.,5.);
  // col = envMapColorIrr;

  // col += pow(b2,1.)*fade* vec3(166.,16.,30.)/255.;





  gl_FragColor = vec4(col,1.);
}