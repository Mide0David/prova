export const VERTEX_SHADER = `
uniform float uVelocity;   // normalized velocity: -1.0 = max left, 1.0 = max right
uniform float uTime;
uniform float uCenter;     // how far from viewport center (0 = centered, 1 = far edge)

varying vec2 vUv;
varying float vDistortion;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Velocity-driven warp: bend the card along X based on speed
  // The warp is stronger in the middle of the card (U ≈ 0.5) and zero at edges
  float bendStrength = uVelocity * 0.35;
  float bendFalloff  = sin(uv.x * 3.14159);  // bell curve: 0 at edges, 1 at center
  pos.z += bendStrength * bendFalloff;

  // Secondary ripple: high-frequency shimmer proportional to speed
  float ripple = sin(uv.x * 12.0 + uTime * 2.0) * abs(uVelocity) * 0.04;
  pos.z += ripple;

  vDistortion = abs(bendStrength * bendFalloff);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const FRAGMENT_SHADER = `
uniform sampler2D uTexture;
uniform float     uBrightness;
uniform float     uRadius;      // corner radius in UV space (e.g. 0.05)
uniform float     uCenter;      // 0 = at center, 1 = far from center

varying vec2  vUv;
varying float vDistortion;

// Signed-distance function for a rounded rectangle in UV space
float roundedBox(vec2 uv, vec2 size, float radius) {
  vec2 d = abs(uv - 0.5) - (size * 0.5 - radius);
  return length(max(d, 0.0)) - radius;
}

void main() {
  // Rounded corners: SDF mask
  float sdf = roundedBox(vUv, vec2(1.0), uRadius);
  float alpha = 1.0 - smoothstep(-0.005, 0.005, sdf);

  // Sample texture
  vec4 color = texture2D(uTexture, vUv);

  // Brightness based on distance from center (center = full, edges = dimmed)
  float bright = mix(1.0, 0.55, clamp(uCenter, 0.0, 1.0));
  color.rgb *= bright * uBrightness;

  // Slight desaturation + darkening at high distortion for cinematic feel
  float gray  = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb   = mix(color.rgb, vec3(gray), vDistortion * 0.3);

  gl_FragColor = vec4(color.rgb, color.a * alpha);
}
`;
