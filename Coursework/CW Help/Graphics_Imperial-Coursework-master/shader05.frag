/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/


#version 150 compatibility

in vec3 origin, dir, point;
out vec4 outcolour;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;

const float E = 0.001;

struct Ray
{
  vec3 origin;
  vec3 dir;
};
struct Sphere
{
  vec3 centre;
  float radius;
  vec3 colour;
};
struct Plane
{
  vec3 point;
  vec3 normal;
  vec3 colour;
};

struct Intersection
{
  float t;
  vec3 point;     // hit point
  vec3 normal;    // normal
  int hit;
  vec3 colour;
};

////////////////////////////////////////////////////////////////////
// TODO Exercise 5: implement a simple geometry based ray tracing
// implement the functions in the follwing.
// In order to reach all points you need to implement at least one
// feature more than shown in the coursework description
// effects like refraction, scattering, caustics, soft hadows, etc.
// are possible.
////////////////////////////////////////////////////////////////////

void sphere_intersect(Sphere sph, Ray ray, inout Intersection intersect)
{
  ////////////////////////////////////////////////////////////////////
  // TODO 
  ////////////////////////////////////////////////////////////////////
  float a = pow(length(ray.dir), 2.0);
  float b = 2.0 * dot(ray.dir, (ray.origin - sph.centre));
  float c = pow(length(ray.origin - sph.centre), 2.0) - pow(sph.radius, 2.0);

  float d = pow(b, 2) - 4*a*c;
  if (d >= 0) 
    {

      float m1 = (sqrt(d) - b) / (2*a);
      float m2 = (-b - sqrt(d)) / (2*a);
      float m;

      if (m1>0 && m2>0)
	{
	  if (m1<m2) {m = m1;} 
	  else {m = m2;}
	}

      if (m1<0 || m2<0)
	{
	  if (m1>m1) {m = m1;}
	  else {m = m2;}
	}

      if (m > 0 && (m < intersect.t || intersect.t < 0)) 
	{
	  intersect.t = m;
	  intersect.point = ray.origin + m * ray.dir;
	  intersect.normal = normalize(intersect.point - sph.centre);
	  intersect.colour = sph.colour;

	}
    }
}

void plane_intersect(Plane pl, Ray ray, inout Intersection intersect)
{
  ////////////////////////////////////////////////////////////////////
  // TODO 
  ////////////////////////////////////////////////////////////////////
  const float square_size = 0.5;

  float d = dot(pl.normal, ray.dir);
  if (d != 0) 
    {
      float m = -dot(pl.normal, ray.origin - pl.point) / d;
      if (m > 0 && (m < intersect.t || intersect.t < 0)) 
	{
	  intersect.point = ray.origin + m * ray.dir;
	  intersect.normal = pl.normal;
	  if ((int(floor(intersect.point.z / square_size)) % 2) == (int(floor(intersect.point.x / square_size)) % 2)) 
	    {
	      intersect.colour = pl.colour;
	    } else 
	    {
	      intersect.colour = vec3(1.0 - pl.colour.x, 1.0 - pl.colour.y, 1.0 - pl.colour.z);
	    }
	  intersect.t = m;
	}
    }
}

Sphere sphere[numSpheres];
Plane plane;
void Intersect(Ray r, inout Intersection i)
{
  ////////////////////////////////////////////////////////////////////
  // TODO 
  ////////////////////////////////////////////////////////////////////
  for (int x = 0; x < numSpheres; x++)
    {
      sphere_intersect(sphere[x], r, i);
    }

  plane_intersect(plane, r, i);

}

int seed = 0;
float rnd()
{
  seed = int(mod(float(seed)*1364.0+626.0, 509.0));
  return float(seed)/509.0;
}

vec3 computeShadow(in Intersection inter)
{
  ////////////////////////////////////////////////////////////////////
  // TODO 
  ////////////////////////////////////////////////////////////////////
  vec4 col = vec4(0, 0, 0, 0);

  vec3 lightPosition = gl_LightSource[0].position.xyz;

  Ray shadowRay;
  shadowRay.origin = inter.point;
  shadowRay.dir = normalize(lightPosition - shadowRay.origin);
  shadowRay.origin += shadowRay.dir*E;

  Intersection shadowInter;
  shadowInter.t = -1;
  Intersect(shadowRay, shadowInter);

  if (shadowInter.t != -1 && shadowInter.t < length(lightPosition - shadowRay.origin)) 
    {
      col += vec4(0, 0, 0, 0);
    } else 
    {
      vec3 lightVector = lightPosition - inter.point;
      float d = length(lightVector);
      lightVector = normalize(lightVector);
      vec3 cameraVector = normalize(inter.point);
      vec3 reflectVector = reflect(lightVector, inter.normal);
      float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation + gl_LightSource[0].linearAttenuation*d + gl_LightSource[0].quadraticAttenuation*d*d);
      const float M = 0.3;
      vec4 id = attenuation * vec4(inter.colour, 1) * max(dot(inter.normal, lightVector), 0);
      col += id;
    }
  
  return col.xyz;
}

void main()
{
  //initial scene definition
  sphere[0].centre   = vec3(-2.0, 1.5, -3.5);
  sphere[0].radius   = 1.5;
  sphere[0].colour = vec3(0.8,0.8,0.8);
  sphere[1].centre   = vec3(-0.5, 0.0, -2.0);
  sphere[1].radius   = 0.6;
  sphere[1].colour = vec3(0.3,0.8,0.3);
  sphere[2].centre   = vec3(1.0, 0.7, -2.2);
  sphere[2].radius   = 0.8;
  sphere[2].colour = vec3(0.3,0.8,0.8);
  sphere[3].centre   = vec3(0.7, -0.3, -1.2);
  sphere[3].radius   = 0.2;
  sphere[3].colour = vec3(0.8,0.8,0.3);
  sphere[4].centre   = vec3(-0.7, -0.3, -1.2);
  sphere[4].radius   = 0.2;
  sphere[4].colour = vec3(0.8,0.3,0.3);
  sphere[5].centre   = vec3(0.2, -0.2, -1.2);
  sphere[5].radius   = 0.3;
  sphere[5].colour = vec3(0.8,0.3,0.8);
  plane.point = vec3(0,-0.5, 0);
  plane.normal = vec3(0, 1.0, 0);
  plane.colour = vec3(1, 1, 1);
  seed = int(mod(dir.x * dir.y * 39786038.0, 65536.0));

  //scene definition end

  ////////////////////////////////////////////////////////////////////
  // TODO 
  ////////////////////////////////////////////////////////////////////

  outcolour = vec4(1,1,1,1);
  vec3 col = vec3(0,0,0);

  Ray ray;
  ray.origin = origin;
  ray.dir = normalize((modelViewMatrix * vec4(dir, 0)).xyz);

  Intersection intersec;
  intersec.t = -1;
  intersec.colour = vec3(0,0,0);

  int currentDepth = 0;
  const float k_reflected = 0.5;

  while (currentDepth < raytraceDepth) {
    Intersect(ray, intersec);
    if (intersec.t > 0) 
      {
	col += pow(k_reflected, currentDepth)*computeShadow(intersec);
	intersec.colour = vec3(0,0,0);
	intersec.t = -1;
	currentDepth++;

	Ray reflectedRay;
	reflectedRay.origin = intersec.point;
	reflectedRay.dir = normalize(ray.dir - dot(2 * ray.dir, intersec.normal) * intersec.normal);
	reflectedRay.origin += reflectedRay.dir*E;
	ray = reflectedRay;
      } 
  }

  outcolour = vec4(col, 1);
}
