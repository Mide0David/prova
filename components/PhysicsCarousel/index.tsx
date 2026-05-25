'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { CarouselPhysics } from './physics';
import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders';

const CAROUSEL_HEIGHT = 480;   // px
const CARD_WIDTH  = 2.8;       // Three.js world units
const CARD_HEIGHT = 1.8;
const CARD_GAP    = 0.22;

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&h=500&fit=crop&auto=format',
];

export default function PhysicsCarousel({ hideHeader = false, className = '' }: { hideHeader?: boolean, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let containerWidth = container.clientWidth;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerWidth, CAROUSEL_HEIGHT);
    renderer.setClearColor(0x000000, 0); // transparent background

    const camera = new THREE.PerspectiveCamera(
      45,
      containerWidth / CAROUSEL_HEIGHT,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.rotation.x = -0.04;

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(
      CARD_WIDTH,
      CARD_HEIGHT,
      32,
      24
    );

    const physics = new CarouselPhysics();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      physics.AUTO_DRIFT = 0;
    }

    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      setLoaded(true);
    };

    const textureLoader = new THREE.TextureLoader(manager);
    const meshes: THREE.Mesh[] = [];
    const basePositions: number[] = [];

    const totalWidth = (CARD_WIDTH + CARD_GAP) * IMAGES.length;
    const startX = -totalWidth / 2;

    IMAGES.forEach((url, i) => {
      const texture = textureLoader.load(url, undefined, undefined, () => {
         // Fallback to random topic if 404
         const keywords = ['luxury-home', 'interior-design', 'architecture', 'kitchen', 'bedroom', 'house-exterior', 'garden', 'construction'];
         const fallbackUrl = `https://source.unsplash.com/800x500/?${keywords[i % keywords.length]}&sig=${i}`;
         textureLoader.load(fallbackUrl, (fallbackTexture) => {
             fallbackTexture.minFilter = THREE.LinearFilter;
             fallbackTexture.magFilter = THREE.LinearFilter;
             (meshes[i].material as THREE.ShaderMaterial).uniforms.uTexture.value = fallbackTexture;
         });
      });
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture:    { value: texture },
          uTime:       { value: 0 },
          uVelocity:   { value: 0 },
          uCenter:     { value: 0 },
          uBrightness: { value: 1.0 },
          uRadius:     { value: 0.06 },
        },
        vertexShader:   VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const basePos = startX + i * (CARD_WIDTH + CARD_GAP);
      basePositions.push(basePos);
      
      mesh.position.x = basePos;
      scene.add(mesh);
      meshes.push(mesh);
    });

    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    let rafId: number;

    function animate() {
      const delta = clock.getDelta();
      physics.tick(delta);

      meshes.forEach((mesh, i) => {
        let x = basePositions[i] + physics.position;

        x = ((x + totalWidth / 2) % totalWidth) - totalWidth / 2;
        
        // Ensure negative modulo works as expected in JS
        if (x < -totalWidth / 2) {
          x += totalWidth;
        }

        mesh.position.x = x;

        const distFromCenter = Math.abs(x) / (containerWidth / 2 * 0.5);

        let vel = physics.normalizedVelocity;
        if (prefersReducedMotion) vel = 0;

        const mat = mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uVelocity.value = vel;
        mat.uniforms.uCenter.value = Math.min(distFromCenter, 1.0);
        mat.uniforms.uTime.value = clock.getElapsedTime();

        const scale = 1.0 - Math.min(distFromCenter * 0.12, 0.12);
        mesh.scale.set(scale, scale, 1);
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    animate();

    const canvas = renderer.domElement;

    const onPointerDown = (clientX: number) => {
      physics.onPointerDown(clientX);
      canvas.style.cursor = 'grabbing';
    };
    
    const onPointerMove = (clientX: number) => {
      physics.onPointerMove(clientX);
    };

    const onPointerUp = () => {
      physics.onPointerUp();
      canvas.style.cursor = 'grab';
    };

    const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX);
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX);
    const handleMouseUp = () => onPointerUp();
    const handleMouseLeave = () => onPointerUp();

    const handleTouchStart = (e: TouchEvent) => onPointerDown(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (physics.isDragging) {
        e.preventDefault();
        onPointerMove(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => onPointerUp();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    canvas.style.cursor = 'grab';

    const handleResize = () => {
      containerWidth = container.clientWidth;
      renderer.setSize(containerWidth, CAROUSEL_HEIGHT);
      camera.aspect = containerWidth / CAROUSEL_HEIGHT;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);

      cancelAnimationFrame(rafId);

      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.ShaderMaterial).dispose();
      });
      
      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={className}
      style={{ background: hideHeader ? 'transparent' : '#000', padding: hideHeader ? '0' : '64px 0', overflow: 'hidden' }}
    >
      {!hideHeader && (
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'
          }}>
            Real work, real professionals
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff',
            letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1
          }}>
            PROJECTS COMPLETED<br />
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>BY VERIFIED PROS</span>
          </h2>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: `${CAROUSEL_HEIGHT}px`,
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out'
        }}
      />

      <p style={{
        textAlign: 'center', marginTop: '16px',
        fontSize: '11px', color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.06em', textTransform: 'uppercase'
      }}>
        Drag to explore
      </p>
    </motion.section>
  );
}
