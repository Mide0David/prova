export class CarouselPhysics {
  velocity: number = 0;       // current scroll speed (world units/frame)
  position: number = 0;       // current X offset applied to all cards
  isDragging: boolean = false;
  lastPointerX: number = 0;
  lastPointerTime: number = 0;

  readonly AUTO_DRIFT: number = -0.006;     // idle drift speed (left)
  readonly FRICTION: number = 0.92;         // momentum decay per frame (0–1, lower = faster stop)
  readonly DRAG_SENSITIVITY: number = 0.012; // pointer pixels → world units
  readonly MAX_VELOCITY: number = 0.25;

  tick(deltaTime: number): void {
    if (!this.isDragging) {
      // Apply auto-drift when idle
      const target = this.AUTO_DRIFT;
      this.velocity += (target - this.velocity) * 0.03; // ease toward drift
      this.velocity *= this.FRICTION;
    }
    this.position += this.velocity;
  }

  onPointerDown(x: number): void {
    this.isDragging = true;
    this.lastPointerX = x;
    this.lastPointerTime = performance.now();
    this.velocity = 0;
  }

  onPointerMove(x: number): void {
    if (!this.isDragging) return;
    const now = performance.now();
    const dt  = Math.max(now - this.lastPointerTime, 1);
    const dx  = (x - this.lastPointerX) * this.DRAG_SENSITIVITY;

    this.velocity = dx / dt * 16; // normalize to ~60fps frame time
    this.velocity = Math.max(-this.MAX_VELOCITY, Math.min(this.MAX_VELOCITY, this.velocity));

    this.position += dx;
    this.lastPointerX = x;
    this.lastPointerTime = now;
  }

  onPointerUp(): void {
    this.isDragging = false;
    // velocity carries forward and decays via FRICTION in tick()
  }

  // Normalized velocity for the shader uniform: -1 to 1
  get normalizedVelocity(): number {
    return Math.max(-1, Math.min(1, this.velocity / this.MAX_VELOCITY));
  }
}
