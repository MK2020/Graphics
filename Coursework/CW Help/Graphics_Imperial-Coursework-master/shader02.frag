/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

in elemData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}frag;

///////////////

void main()
{
  vec4 outcol = frag.color;

  if(shader == 2)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.2 Phong shading here
    ///////////////////////////////////////////////////

  //Light vector travels from source to vertex
    vec3 lightVector = gl_LightSource[0].position.xyz - frag.pos;
    float d = length(lightVector);

    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
    	  + gl_LightSource[0].linearAttenuation * d
      	  + gl_LightSource[0].quadraticAttenuation * d * d);

    vec4 ia = ambientColor;

    vec3 lightVectorNormal = normalize(lightVector);
    vec4 id = attenuation * diffuseColor * max(dot(frag.normal, lightVectorNormal), 0); //must be non-negative

    vec3 reflectVector = reflect(lightVectorNormal, frag.normal);
    vec3 cameraVector = normalize(frag.pos); //Camera view looks towards vertex position
    const float M = 0.3;
    vec4 is = attenuation * specularColor * pow(max(dot(reflectVector, cameraVector),0), M*specularExponent);
    
    outcol = ia + id + is;  



    ///////////////////////////////////////////////////
  }

  if(shader == 3)
  {
    ///////////////////////////////////////////////////
    //TODO add code for exercise 2.3 toon shading here
    ///////////////////////////////////////////////////

    vec3 lightVector = gl_LightSource[0].position.xyz - frag.pos;

    float f = dot(lightVector / length(lightVector), frag.normal / length(frag.normal));

    if (f > 0.98)
    {
	outcol = vec4(0.8,0.8,0.8,1.0);
    }
    else if (f>0.5 && f<=0.98)
    {
	outcol = vec4(0.8,0.4,0.4,1.0);
    }
    else if (f>0.25 && f<=0.5)
    {
	outcol = vec4(0.6,0.2,0.2,1.0);
    }
    else
    {
	outcol = vec4(0.1,0.1,0.1,1.0);
    }


    ///////////////////////////////////////////////////
  }

  gl_FragColor = outcol;
}
