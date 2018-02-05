/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform sampler2D textureImage;

in vertexData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
  //TODO Exercise 4:
  vec4 texCoords;

}frag;

out vec4 outcolour;

///////////////

void main()
{
  //TODO: get texture information. e.g.,
  vec4 outcol = texture(textureImage, frag.texCoords.xy);

  //////////////////////////////////////////////////////////
  //TODO Exercise 04a: integrate the texture information 
  //into a Phong shader (e.g. use the one from Exercise 2)
  //////////////////////////////////////////////////////////
  
  vec3 lightVector = gl_LightSource[0].position.xyz - frag.pos;
  float d = length(lightVector);

  float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
  + gl_LightSource[0].linearAttenuation * d
  + gl_LightSource[0].quadraticAttenuation * d * d);

  vec4 ia = outcol;

  vec3 lightVectorNormal = normalize(lightVector);
  vec4 id = attenuation * diffuseColor * max(dot(frag.normal, lightVectorNormal), 0); //must be non-negative

  vec3 reflectVector = reflect(lightVectorNormal, frag.normal);
  vec3 cameraVector = normalize(frag.pos); //Camera view looks towards vertex position
  const float M = 0.3;
  vec4 is = attenuation * specularColor * pow(max(dot(reflectVector, cameraVector),0), M*specularExponent);
  
  gl_FragColor = ia + id + is; 
  


  //outcolour = vec4(1.0,0.0,0.0,0.0);
  //////////////////////////////////////////////////////////


}
