import React, { useEffect, useRef } from 'react';

import './Canvas.css';

const VoidFunc = ["rect", "circle", "line", "img", "?", "!"];
const CondFunc = ["?", "!"];


let ImageMap = new Map([]);
const Behavs = new Map([
    ["=", function ([a, b]) { return a === b }],
    ["+", function ([a, b]) { return a + b }],
    ["-", function ([a, b]) { return a - b }],
    ["/", function ([a, b]) { return a / b }],
    ["*", function ([a, b]) { return a * b }],
    ["rect", function ([x, y, w, h, c], ctx) {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
    }],
    ["img", function ([x, y, dx, dy, i], ctx) {
        if (ImageMap.get(i) !== undefined) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ImageMap.get(i), x, y, dx, dy);
            return;
        }
        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y, dx, dy);
        };
        img.src = i;
        ImageMap.set(i, img);
    }],
    ["even", function ([a]) {
        return a % 2 === 0;
    }],
    ["odd", function ([a]) {
        return !(a % 2 === 0);
    }],
    ["circle", function ([x, y, r, s, e, b, c], ctx) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, r, s * Math.PI / 180, e * Math.PI / 180, b);
        ctx.fill();
    }],
    ["line", function ([x, y, a, b, c], ctx) {
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(a, b);
        ctx.stroke();
    }],
    ["?", function ([b, p], ctx) {
        if (b) {
            Behavs.get(p.com)(p.arg, ctx);
        }
    }],
    ["!", function ([b, p], ctx) {
        if (!b) {
            Behavs.get(p.com)(p.arg, ctx);
        }
    }]
]);

const Canvas = ({ code }) => {
    const canvasRef = useRef(null);
    const drawRef = useRef([]);

    function runCode(loop, hier, ctx) {
        for (const c of hier) {
            runCom(loop, c, ctx, false);
        }
    }

    function runCom(loop, com, ctx, isCond) {
        let arg = [];
        let newCond = CondFunc.includes(com.com);

        for (const a of com.arg) {
            if (a.com !== undefined) {
                let val = runCom(loop, a, ctx, newCond);

                arg.push(val);
            } else if (a === "t") {
                arg.push(loop);
            } else {
                arg.push(a);
            }
        }

        if (isCond) {
            if (VoidFunc.includes(com.com)) {
                return { com: com.com, arg: arg };
            }
        }
        return Behavs.get(com.com)(arg, ctx);
    }

    function draw(ctx) {
        drawRef.current.forEach((draw, i) => {
            runCode(draw.totalSeconds % 60, draw.run, ctx);
        })
    }

    function Com(run, dur) {
        let endTime,
            self = this,
            running = false;
        this.run = run;
        this.totalSeconds = dur;

        let go = (function tick() {
            let now = new Date().getTime();
            if (now >= endTime) {
                drawRef.current = drawRef.current.filter((com) => com !== self);

                return;
            }

            self.totalSeconds = Math.round((endTime - now) / 1000);
            window.setTimeout(tick, 1000 / 12);
        });

        this.start = function () {
            if (running) return;
            running = true;
            endTime = new Date().getTime() + dur * 1000;
            go();
        };
    }
    
    useEffect(() => {
        const remove = setInterval(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw(ctx);
        }, 50);

        return () => {
            clearInterval(remove);
        }
    }, [])

    useEffect(() => {
        if (code !== null) {
            let newCom = new Com(code.hier, code.loop);
            drawRef.current.push(newCom);
            newCom.start();
        }
    }, [code])


    return (
        <canvas width='400' height='300' ref={canvasRef} className="canvas"></canvas>
    )
}

export default Canvas;