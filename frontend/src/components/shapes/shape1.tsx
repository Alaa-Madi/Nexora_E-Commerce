"use client"

import { motion, useAnimationFrame } from "framer-motion"
import { useRef } from "react"

interface CubeProps {
    size?: number;
    style?: React.CSSProperties;
    animationConfig?: {
        rotateSpeed?: number;
        ySpeed?: number;
        yAmount?: number;
        initialRotate?: number;
    };
}

export default function UseAnimationFrameCube({ size = 120, style = {}, animationConfig = {} }: CubeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const {
        rotateSpeed = 10000,
        ySpeed = 1000,
        yAmount = 50,
        initialRotate = 0,
    } = animationConfig;

    useAnimationFrame((t) => {
        if (!ref.current) return;
        const rotate = Math.sin(t / rotateSpeed) * 200 + initialRotate;
        const y = (1 + Math.sin(t / ySpeed)) * -yAmount;
        ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
    });

    return (
        <div
            className="container"
            style={{
                width: size,
                height: size,
                perspective: size * 4,
                ...style,
            }}
        >
            <motion.div
                className="cube"
                ref={ref}
                initial={{ rotateX: 0, rotateY: 0 }}
                animate={{}}
                style={{ width: size, height: size }}
            >
                <div className="side front" />
                <div className="side left" />
                <div className="side right" />
                <div className="side top" />
                <div className="side bottom" />
                <div className="side back" />
            </motion.div>
            <StyleSheet size={size} />
        </div>
    );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet({ size = 120 }: { size?: number }) {
    const translate = size / 2;
    const borderRadius = Math.max(size * 0.12, 12);
    return (
        <style>{`
            .container {
                margin: 2rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cube {
                position: relative;
                transform-style: preserve-3d;
            }
            .side {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0.92;
                border-radius: ${borderRadius}px;
                box-shadow: 0 2px 24px 0 #1769FA44;
            }
            .front {
                transform: rotateY(0deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #1769FA 0%, #2563EB 100%);
            }
            .right {
                transform: rotateY(90deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #0A1833 0%, #1769FA 100%);
            }
            .back {
                transform: rotateY(180deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #2563EB 0%, #F9FAFB 100%);
            }
            .left {
                transform: rotateY(-90deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #102040 0%, #1769FA 100%);
            }
            .top {
                transform: rotateX(90deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #1769FA 0%, #F9FAFB 100%);
            }
            .bottom {
                transform: rotateX(-90deg) translateZ(${translate}px);
                background: linear-gradient(135deg, #0A1833 0%, #2563EB 100%);
            }
        `}</style>
    );
}
