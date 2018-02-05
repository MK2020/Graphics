#version 410

uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shininess;
uniform float ambientCoefficent;
uniform float diffuseCoefficent;
uniform float specularCoefficent;

uniform vec4 lightPosition_camSpace; //light Position in camera space

in fragmentData
{
  vec4 position_camSpace;
  vec3 normal_camSpace;
  vec2 textureCoordinate;
  vec4 color;
} frag;

out vec4 fragColor; 

//Fragment shader computes the final color
void main(void)
{

		float q = 50; 
		float si_intensity = 200;
		float heuristic_constant = 10;

	
		vec3 lightvector = normalize(vec3(lightPosition_camSpace));
		vec3 view = normalize(vec3(frag.position_camSpace));

		float lightViewDist = length(vec3(lightPosition_camSpace));

		vec3 reflection = reflect(frag.normal_camSpace, lightvector);
		vec3 reflectvec = normalize(reflection);
	
		vec4 a = ambient;
		float attenuation = si_intensity / (4*3.14*(lightViewDist+heuristic_constant));
		vec4 d = attenuation*diffuse * max(dot(frag.normal_camSpace, lightvector),0);
		vec4 s = attenuation*specular * pow(max(dot(view, reflectvec),0), q);

		fragColor = frag.color + a + d + s; 
}