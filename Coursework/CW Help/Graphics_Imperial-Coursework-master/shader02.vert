/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

////////////////
//exercise 2
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

out elemData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}vertex;

/////////////

void main()
{
  //xyz position of vertex
  vertex.pos = vec3(gl_ModelViewMatrix * gl_Vertex);

  //normal vector of the vertex
  vertex.normal = normalize(gl_NormalMatrix * gl_Normal);

  //set the transformed position of the vertex
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

  vertex.color = vec4(1.0,0.0,0.0,1.0);


  if(shader == 1)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.1 Gouraud shading here
    ///////////////////////////////////////////////////

    //Light vector travels from source to vertex
    vec3 lightVector = gl_LightSource[0].position.xyz - vertex.pos;
    float d = length(lightVector);

    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
    	  + gl_LightSource[0].linearAttenuation * d
      	  + gl_LightSource[0].quadraticAttenuation * d * d);

    vec4 ia = ambientColor;

    vec3 lightVectorNormal = normalize(lightVector);
    vec4 id = attenuation * diffuseColor * max(dot(vertex.normal, lightVectorNormal), 0); //must be non-negative

    vec3 reflectVector = reflect(lightVectorNormal, vertex.normal);
    vec3 cameraVector = normalize(vertex.pos); //Camera view looks towards vertex position
    const float M = 0.3;
    vec4 is = attenuation * specularColor * pow(max(dot(reflectVector, cameraVector),0), M*specularExponent);
    
    vertex.color = ia + id + is;

    ///////////////////////////////////////////////////
  }
}
