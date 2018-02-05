#version 410 

in vec3 vertex_worldSpace;
in vec3 normal_worldSpace;
in vec2 textureCoordinate_input;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;
uniform mat3 normalMatrix; //mv matrix without translation

uniform vec4 lightPosition_camSpace; //light Position in camera space

uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shininess;
uniform float ambientCoefficent;
uniform float diffuseCoefficent;
uniform float specularCoefficent;

int shading_type;

out data
{
  vec4 position_camSpace;
  vec3 normal_camSpace;
  vec2 textureCoordinate;
  vec4 color;
}vertexInOut;

//Vertex shader compute the vectors per vertex
void main(void)
{
  //Put the vertex in the correct coordinate system by applying the model view matrix
  vec4 vertex_camSpace = mvMatrix*vec4(vertex_worldSpace,1.0f); 
  vertexInOut.position_camSpace = vertex_camSpace;
  
  //Apply the model-view transformation to the normal (only rotation, no translation)
  //Normals put in the camera space
  vertexInOut.normal_camSpace = normalize(normalMatrix*normal_worldSpace);
  
  //we need to make sure that the normals and texture coordinates
  //aren't optimised away, 
  //so we have to use them somehow.
  //Uniforms and array objects that are nor used for 
  //the final output(!) are  removed during 
  //glsl compilation regardless if you assign them. 
  vec4 workaround = 
		vec4((vertexInOut.normal_camSpace.x + textureCoordinate_input.x)*0.0001, 0, 0, 1);
 
shading_type = 0;

if(shading_type == 1){

//constants
	float q =50; 
	float si_intensity = 200;
	float heuristic_constant = 10;
//normalize	
	vec3 lightvector = normalize(vec3(lightPosition_camSpace));
	vec3 view = normalize(vec3(vertexInOut.position_camSpace));

	//vec3 lightvector = normalize(lightnorm-view);	

//find distance since lightvector travels from the light sources to the vertices
	float lightViewDist = length(vec3(lightPosition_camSpace)); //unnormalized distance
	//float lightViewDist = distance(vec3(lightPosition_camSpace), view);

//reflecion vector
	vec3 reflection = reflect(vertexInOut.normal_camSpace, lightvector); //reflect(normal, incident) to match lecture eqn.
	vec3 reflectvec = normalize(reflection);
//components
	float attenuation = si_intensity / (4*3.14*(lightViewDist+heuristic_constant));
	vec4 a = ambient;
	vec4 d = attenuation*diffuse * max(dot(vertexInOut.normal_camSpace, lightvector),0);
	vec4 s = attenuation*specular * pow(max(dot(view, reflectvec),0), q);
	vec4 L = a + d + s; 
  //forwarding pure red as RGBA color and the shading by summing them up
  //Note: you can use texture coordinates here too
   vertexInOut.color =L+ vec4(1,0,0,1);

//if we are not performing gouraud shading forward pure red as the RGBA color ONLY
}else if (shading_type == 0){

  vertexInOut.color = vec4(1,0,0,1);

}
  //a negligible contribution from normals and texcoords is added 
  //to ensure these array objects are not optimsed away 
  vertexInOut.color += workaround;
  
  //Texture coordinate
  vertexInOut.textureCoordinate = textureCoordinate_input;
  
  gl_Position = pMatrix * vertex_camSpace;
}
