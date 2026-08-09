import {Stack, Text} from "@chakra-ui/react"
import type { Bot, BotPosition } from "../botsim/bot"
import { useEffect, useRef } from "react"

interface BotSimAnimatorProps {
    states: BotPosition[]
    bot: Bot
}

export const BotSimAnimator: React.FC<BotSimAnimatorProps> = ({states, bot}: BotSimAnimatorProps) => {
    const pathRef = useRef<SVGPathElement>(null);
    const botRef = useRef<SVGGElement>(null); // SVG G Element
    
    useEffect(()=>{
        const path = pathRef.current; // the path that react made
        const g = botRef.current;
        // now we can mess with it independent of react :D

        if (!path || !g || ! states.length) return;

        let start: number | null = null;
        let lastIdx = -1;
        let d = '';
        const stepsPerMs = 0.4;

        const tick = (now: number) => {
            if (start === null) start = now;
            const idx = Math.min(states.length - 1,
                Math.floor((now-start) * stepsPerMs)
            );

            let lastXyf = '';
            for (let i = lastIdx + 1; i <= idx; i++){
                const { x, y } = states[i].pen;
                const xyf = `${x.toFixed(2)} ${y.toFixed(2)}`;
                if(xyf === lastXyf) continue;
                lastXyf = xyf;
                d += `${i === 0 ? 'M' : 'L'}${xyf}`;
            }
            lastIdx = idx;
            path.setAttribute('d', d);

            const p = states[idx];
            const degrees = p.orientation * 180 / Math.PI;
            g.setAttribute('transform',
                `translate(${p.pen.x} ${p.pen.y}) rotate(${degrees})`
            )

            if (idx < states.length - 1) frame = requestAnimationFrame(tick)
        };

        let frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [states])

    const axleX = -bot._penDistanceFromAxle;
    const leftWheelY = bot._leftWheelPolarFromPen.r * Math.sin(bot._leftWheelPolarFromPen.t);
    const rightWheelY = bot._rightWheelPolarFromPen.r * Math.sin(bot._rightWheelPolarFromPen.t);
    const wheelWidth = bot._wheelDiameter/5;
    const wheelX1 = axleX - bot._wheelDiameter/2;
    const leftY1 = leftWheelY - wheelWidth/2;
    const rightY1 = rightWheelY - wheelWidth/2;
    const rx = wheelWidth/5;
    const bodyWidth = leftWheelY - rightWheelY - wheelWidth*2;
    const bodyMiddle = (leftWheelY + rightWheelY)/2;
    const bodyY = bodyMiddle - bodyWidth/2;
    const bodyX = axleX - 10;
    const bodyLength = bot._penDistanceFromAxle + 10;
    const xLines = [...Array(56).keys()].map(x => x*10 - 295);
    const yLines = [...Array(39).keys()].map(x => x*10 - 337);

    return  <svg viewBox="-300 -347 560 397" 
                width="710" height="497" 
                style={{'background':'darkgreen'}}>
        {xLines.map(x => <line key={`xline-${x}`} x1={x} x2={x} y1={-340} y2={45} stroke="seagreen" />)}
        {yLines.map(y => <line key={`yline-${y}`} x1={-295} x2={255} y1={y} y2={y} stroke="seagreen" />)}
        <g transform="scale(1, -1)">
            <rect fill="aliceblue" x="0" y="0" width={210} height={297} />
            <path ref={pathRef} fill="none" stroke="blue" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <g ref={botRef} transform="translate(10,270)">
                <circle r="5" stroke="blue" strokeWidth="0.5" fill="none" />
                <circle r="1.5" fill="blue" />
                <line x1="-5" x2="5" stroke="blue" strokeWidth="0.5" />
                <line y1="-5" y2="5" stroke="blue" strokeWidth="0.5" />

                <rect x={wheelX1} y={leftY1} 
                    width={bot._wheelDiameter} height={wheelWidth}
                    fill="salmon" rx={rx} />
                <rect x={wheelX1} y={rightY1} 
                    width={bot._wheelDiameter} height={wheelWidth}
                    fill="teal" rx={rx} />

                <line x1={axleX} x2={axleX} y1={leftY1+wheelWidth+rx} y2={rightY1-rx}
                    strokeWidth="1" stroke="gray" />
                <rect x={bodyX} y={bodyY} 
                    width={bodyLength} height={bodyWidth}
                    strokeWidth="1" stroke="gray"
                    fill="none" />
            </g>
        </g>
    </svg>
            
}