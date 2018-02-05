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
	shader_type=3;

	//original
if(shader_type == 0){
		fragColor = frag.color;

	//phong shading
}else if(shader_type==2){
//constants

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

}else if(shader_type ==3){
		
		vec3 lightnorm = vec3(lightPosition_camSpace);
		vec3 view = vec3(frag.position_camSpace);
		vec3 lightvector = lightnorm-view;	

    	float If = max(dot(lightvector / length(lightvector), frag.normal_camSpace / length(frag.normal_camSpace)),0);

    	if (If > 0.98)
   		{
			fragColor = vec4(0.8,0.8,0.8,1.0);
    	}
    	else if (If>0.5 && If<=0.98)
    	{
			fragColor = vec4(0.8,0.4,0.4,1.0);
    	}
    	else if (If>0.25 && If<=0.5)
    	{
			fragColor = vec4(0.6,0.2,0.2,1.0);
    	}
    	else
    	{
			fragColor = vec4(0.1,0.1,0.1,1.0);
    	}
		
	}
	
}
