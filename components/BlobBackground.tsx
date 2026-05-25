'use client'

import { useEffect, useRef } from 'react'

interface BlobBackgroundProps {
    count?: number
    dotSpacing?: number    // distance between dot centers in px (default: 7)
    dotSize?: number       // size of each square dot in px (default: 2)
    speed?: number
    darkRGB?: [number, number, number]
    lightRGB?: [number, number, number]
    className?: string
}

export default function BlobBackground({
    count = 4,
    dotSpacing = 7,
    dotSize = 2,
    speed = 1,
    darkRGB = [22, 18, 16],
    lightRGB = [58, 48, 44],
    className = '',
}: BlobBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const blobs = Array.from({ length: count }, () => ({
            x: canvas.width * (0.15 + 0.7 * Math.random()),
            y: canvas.height * (0.15 + 0.7 * Math.random()),
            r: canvas.width * (0.22 + 0.14 * Math.random()),
            vx: (Math.random() - 0.5) * 0.5 * speed,
            vy: (Math.random() - 0.5) * 0.5 * speed,
            phase: Math.random() * Math.PI * 2,
            blobSpeed: (0.003 + Math.random() * 0.004) * speed,
            wobble: 0.1 + Math.random() * 0.12,
        }))

        // Low-res offscreen for the smooth blob field
        const FIELD_SCALE = 4
        const off = document.createElement('canvas')
        const offCtx = off.getContext('2d')!

        // Stable pixel buffer — we read from this, write to a fresh one each frame
        let stableData: Uint8ClampedArray | null = null

        const [dr, dg, db] = darkRGB
        const [lr, lg, lb] = lightRGB

        // Dot overlay color — single fixed light grey, same as video
        const dotColor = `rgb(${lr + 14}, ${lg + 12}, ${lb + 10})`

        let t = 0

        const draw = () => {
            t += 1

            const W = Math.ceil(canvas.width / FIELD_SCALE)
            const H = Math.ceil(canvas.height / FIELD_SCALE)
            if (off.width !== W || off.height !== H) {
                off.width = W
                off.height = H
                stableData = null
            }

            // Move blobs
            blobs.forEach((b) => {
                b.x += b.vx
                b.y += b.vy
                if (b.x - b.r < 0 || b.x + b.r > canvas.width) b.vx *= -1
                if (b.y - b.r < 0 || b.y + b.r > canvas.height) b.vy *= -1
            })

            // Write smooth blob gradient to offscreen buffer
            const imgData = offCtx.createImageData(W, H)
            const data = imgData.data
            for (let py = 0; py < H; py++) {
                for (let px = 0; px < W; px++) {
                    const cx = (px + 0.5) * FIELD_SCALE
                    const cy = (py + 0.5) * FIELD_SCALE
                    let field = 0
                    blobs.forEach((b, i) => {
                        const phase = b.phase + t * b.blobSpeed
                        const wx = 1 + b.wobble * Math.sin(phase * 1.3 + i)
                        const wy = 1 + b.wobble * Math.cos(phase * 0.9 + i * 0.7)
                        const dx = (cx - b.x) / (b.r * wx)
                        const dy = (cy - b.y) / (b.r * wy)
                        field += 1 / (dx * dx + dy * dy + 0.0001)
                    })
                    const v = Math.min(1, field / 8)
                    const f = v * v * (3 - 2 * v) // smoothstep — no noise
                    const idx = (py * W + px) * 4
                    data[idx] = Math.round(lr + (dr - lr) * f)
                    data[idx + 1] = Math.round(lg + (dg - lg) * f)
                    data[idx + 2] = Math.round(lb + (db - lb) * f)
                    data[idx + 3] = 255
                }
            }
            offCtx.putImageData(imgData, 0, 0)

            // Commit to stable buffer BEFORE drawing — dots read from here, never flickering
            stableData = new Uint8ClampedArray(data)

            // ── Draw smooth gradient background (scaled up, no smoothing) ──
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(off, 0, 0, canvas.width, canvas.height)

            // ── Draw fixed dot grid on top ──
            // Every dot: same fixed size square, same fixed color
            // Position is fixed; only the underlying gradient moves
            if (!stableData) { animId = requestAnimationFrame(draw); return }

            ctx.fillStyle = dotColor
            const half = dotSize / 2
            const cols = Math.ceil(canvas.width / dotSpacing)
            const rows = Math.ceil(canvas.height / dotSpacing)

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const cx = col * dotSpacing + dotSpacing / 2
                    const cy = row * dotSpacing + dotSpacing / 2

                    // Sample the underlying field to decide: show dot or not
                    // In the video, dots are visible everywhere but appear brighter
                    // in the transition zones between dark and light
                    const fx = Math.min(W - 1, Math.floor((cx / canvas.width) * W))
                    const fy = Math.min(H - 1, Math.floor((cy / canvas.height) * H))
                    const idx = (fy * W + fx) * 4
                    const bgR = stableData[idx]

                    // Dots are always drawn — same color, same size
                    // They're just slightly brighter than whatever bg is under them
                    // so they're visible everywhere (as seen in the video)
                    ctx.globalAlpha = 0.55 + (1 - (bgR - dr) / Math.max(1, lr - dr)) * 0.3
                    ctx.fillRect(cx - half, cy - half, dotSize, dotSize)
                }
            }
            ctx.globalAlpha = 1

            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [count, dotSpacing, dotSize, speed, darkRGB, lightRGB])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    )
}