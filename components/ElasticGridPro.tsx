'use client';

import React, { useRef, useEffect, useCallback } from "react"

// ────────────────────────────────────────────────
// Enums & Types

export enum InteractionMode {
    PULL = "pull",
    PUSH = "push",
    WAVE = "wave",
    NONE = "none",
}

export enum TriggerMode {
    HOVER = "hover",
    HOLD = "hold",
}

interface Props {
    cellSize?: number
    elasticStrength?: number
    damping?: number
    interactionRadius?: number
    interactionStrength?: number
    interactionMode?: InteractionMode
    triggerMode?: TriggerMode
    lineColor?: string
    baseOpacity?: number
    glowColor?: string
    glowIntensity?: number
    glowRadius?: number
    lineWidth?: number
    showDots?: boolean
    dotRadius?: number
    ambientWaveAmplitude?: number
    ambientWaveFrequency?: number
    perspective?: number
    pointerEvents?: "auto" | "none"
    width?: number
    height?: number
    style?: React.CSSProperties
}

// ────────────────────────────────────────────────
// Main Component

export default function ElasticGridPro(props: Props) {
    const {
        cellSize = 150,
        elasticStrength = 0.05,
        damping = 0.6,
        interactionRadius = 200,
        interactionStrength = 6,
        interactionMode = InteractionMode.PUSH,
        triggerMode = TriggerMode.HOVER,
        lineColor = "rgba(255, 255, 255, 0.1)",
        baseOpacity = 0.5,
        glowColor = "#ffffff",
        glowIntensity = 2,
        glowRadius = 404,
        lineWidth = 0.5,
        showDots = false,
        dotRadius = 2,
        ambientWaveAmplitude = 0,
        ambientWaveFrequency = 0,
        perspective = 0,
        pointerEvents = "auto",
        style,
    } = props

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const pointsData = useRef<Float32Array | null>(null)
    const gridDim = useRef({ cols: 0, rows: 0 })

    const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
    const isPointerDownRef = useRef(false)
    const rafRef = useRef<number | null>(null)
    const isVisibleRef = useRef(false)

    const safeCellSize = Math.max(10, cellSize)

    const initGrid = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const { width, height } = container.getBoundingClientRect()
        const cols = Math.ceil(width / safeCellSize) + 4
        const rows = Math.ceil(height / safeCellSize) + 4
        gridDim.current = { cols, rows }

        const data = new Float32Array(cols * rows * 6)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const idx = (y * cols + x) * 6
                const px = x * safeCellSize - safeCellSize * 2
                const py = y * safeCellSize - safeCellSize * 2
                data[idx] = px
                data[idx + 1] = py
                data[idx + 2] = px
                data[idx + 3] = py
                data[idx + 4] = 0
                data[idx + 5] = 0
            }
        }
        pointsData.current = data
    }, [safeCellSize])

    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx || !containerRef.current || !pointsData.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const time = Date.now() * ambientWaveFrequency
        const data = pointsData.current
        const { cols, rows } = gridDim.current
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const isInteracting =
            triggerMode === TriggerMode.HOVER || isPointerDownRef.current
        const rSq = interactionRadius * interactionRadius

        // Physics update
        for (let i = 0; i < data.length; i += 6) {
            const xIdx = (i / 6) % cols
            const yIdx = Math.floor(i / 6 / cols)

            const waveX = Math.sin(time + xIdx * 0.4) * ambientWaveAmplitude
            const waveY = Math.cos(time + yIdx * 0.4) * ambientWaveAmplitude

            const tx = data[i] + waveX
            const ty = data[i + 1] + waveY

            let fx = (tx - data[i + 2]) * elasticStrength
            let fy = (ty - data[i + 3]) * elasticStrength

            if (
                isInteracting &&
                interactionMode !== InteractionMode.NONE &&
                interactionRadius > 0
            ) {
                const dx = data[i + 2] - mx
                const dy = data[i + 3] - my
                const distSq = dx * dx + dy * dy

                if (distSq < rSq) {
                    const dist = Math.sqrt(distSq) || 0.001
                    const influence =
                        (1 - dist / interactionRadius) * interactionStrength

                    if (interactionMode === InteractionMode.PULL) {
                        fx -= (dx / dist) * influence * 15
                        fy -= (dy / dist) * influence * 15
                    } else if (interactionMode === InteractionMode.PUSH) {
                        fx += (dx / dist) * influence * 20
                        fy += (dy / dist) * influence * 20
                    } else if (interactionMode === InteractionMode.WAVE) {
                        const ripple =
                            Math.sin(dist * 0.05 - Date.now() * 0.001) *
                            influence *
                            8
                        fx += (dx / dist) * ripple
                        fy += (dy / dist) * ripple
                    }
                }
            }

            data[i + 4] += fx
            data[i + 5] += fy
            data[i + 4] *= damping
            data[i + 5] *= damping
            data[i + 2] += data[i + 4]
            data[i + 3] += data[i + 5]
        }

        ctx.clearRect(0, 0, rect.width, rect.height)
        ctx.lineWidth = lineWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        const drawGridLines = (isGlowPass: boolean) => {
            if (isGlowPass) {
                const gradient = ctx.createRadialGradient(
                    mx,
                    my,
                    0,
                    mx,
                    my,
                    glowRadius
                )
                gradient.addColorStop(0, glowColor)
                gradient.addColorStop(1, "transparent")
                ctx.strokeStyle = gradient
                ctx.globalAlpha = 1
                ctx.shadowBlur = glowIntensity
                ctx.shadowColor = glowColor
            } else {
                ctx.strokeStyle = lineColor
                ctx.globalAlpha = baseOpacity
                ctx.shadowBlur = 0
            }

            for (let y = 0; y < rows; y++) {
                ctx.beginPath()
                const startIdx = y * cols * 6
                ctx.moveTo(data[startIdx + 2], data[startIdx + 3])
                for (let x = 1; x < cols; x++) {
                    const idx = (y * cols + x) * 6
                    const prevIdx = idx - 6
                    const midX = (data[prevIdx + 2] + data[idx + 2]) / 2
                    const midY = (data[prevIdx + 3] + data[idx + 3]) / 2
                    ctx.quadraticCurveTo(
                        data[prevIdx + 2],
                        data[prevIdx + 3],
                        midX,
                        midY
                    )
                }
                ctx.stroke()
            }

            for (let x = 0; x < cols; x++) {
                ctx.beginPath()
                const startIdx = x * 6
                ctx.moveTo(data[startIdx + 2], data[startIdx + 3])
                for (let y = 1; y < rows; y++) {
                    const idx = (y * cols + x) * 6
                    const prevIdx = ((y - 1) * cols + x) * 6
                    const midX = (data[prevIdx + 2] + data[idx + 2]) / 2
                    const midY = (data[prevIdx + 3] + data[idx + 3]) / 2
                    ctx.quadraticCurveTo(
                        data[prevIdx + 2],
                        data[prevIdx + 3],
                        midX,
                        midY
                    )
                }
                ctx.stroke()
            }
        }

        drawGridLines(false)

        if (glowIntensity > 0 && glowRadius > 0 && mx > -5000) {
            drawGridLines(true)
        }

        if (showDots) {
            ctx.shadowBlur = 0
            ctx.globalAlpha = baseOpacity
            ctx.fillStyle = lineColor
            for (let i = 0; i < data.length; i += 6) {
                ctx.beginPath()
                ctx.arc(data[i + 2], data[i + 3], dotRadius, 0, Math.PI * 2)
                ctx.fill()
            }
        }
    }, [
        elasticStrength,
        damping,
        interactionRadius,
        interactionStrength,
        interactionMode,
        triggerMode,
        lineColor,
        baseOpacity,
        glowColor,
        glowIntensity,
        glowRadius,
        lineWidth,
        showDots,
        dotRadius,
        ambientWaveAmplitude,
        ambientWaveFrequency,
        // mx, my are from refs, no need to include in deps
    ])

    // RAF loop
    const animateLoop = useCallback(() => {
        drawFrame()
        rafRef.current = requestAnimationFrame(animateLoop)
    }, [drawFrame])

    // Resize + init
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current
            const container = containerRef.current
            if (!canvas || !container) return

            const rect = container.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1

            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`

            const ctx = canvas.getContext("2d")
            ctx?.scale(dpr, dpr)

            initGrid()
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [initGrid])

    // Animation loop
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting
                if (entry.isIntersecting) {
                    if (rafRef.current === null) {
                        rafRef.current = requestAnimationFrame(animateLoop)
                    }
                } else {
                    if (rafRef.current !== null) {
                        cancelAnimationFrame(rafRef.current)
                        rafRef.current = null
                    }
                }
            },
            { threshold: 0 }
        )

        observer.observe(container)

        return () => {
            observer.disconnect()
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [animateLoop])

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handlePointerDown = () => {
        isPointerDownRef.current = true
    }
    const handlePointerUp = () => {
        isPointerDownRef.current = false
    }
    const handlePointerLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 }
        isPointerDownRef.current = false
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: pointerEvents,
                touchAction: "pan-y",
                WebkitUserSelect: "none",
                userSelect: "none",
                perspective: `${1200 + perspective * 10}px`,
                ...style,
            }}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    transform: `rotateX(${perspective}deg)`,
                    transformOrigin: "50% 50%",
                }}
            />
        </div>
    )
}
