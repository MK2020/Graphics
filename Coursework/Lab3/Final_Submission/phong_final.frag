#version 410

uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shininess;
uniform float ambientCoefficent;
uniform float diffuseCoefficent;
uniform float specularCoefficent;

uniform vec4 lightPosition_camSpace; //light Position in camera space

int shader_type;

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
shader_type=1;

	//original
	if(shader_type == 0){
		fragColor = frag.color;

	//phong shading
	}else if(shader_type==1){
//constants
		float q = 5; 
		float si_intensity = 20;
		float heuristic_constant = 1;
//normalize	
		vec3 lightvector = normalize(vec3(lightPosition_camSpace));
		vec3 view = normalize(vec3(frag.position_camSpace));
//find distance since lightvector travels from the light sources to the vertices
		float lightViewDist = length(lightvector);
//refleciton vector
		vec3 reflection = -1*reflect(lightvector, frag.normal_camSpace); // multiply with -1 since reflect calculates  I - 2.0 * dot(N, I) * N
		vec3 reflectvec = normalize(reflection);
//components	
		float attenuation = si_intensity / (4*3.14*(lightViewDist+heuristic_constant));
		vec4 a = ambient;
		vec4 d = attenuation*diffuse * max(dot(frag.normal_camSpace, lightvector),0);
		vec4 s = attenuation*specular * pow(max(dot(view, reflectvec),0), q);

		fragColor = frag.color + a + d + s; 
}

}
