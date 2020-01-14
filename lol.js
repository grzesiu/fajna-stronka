let time = 0;
let path = [];

let short_drawing = [];
for (let i = 0; i < drawing.length; i += 10) {
    short_drawing.push(drawing[i]);
}

const dt = 2 * math.pi / short_drawing.length;
const transform = dft(short_drawing);

function dft(xs) {
    const XS = new Array(xs.length).fill(math.complex(0, 0));
    for (let k = 0; k < xs.length; ++k) {
        for (let n = 0; n < xs.length; ++n) {
            const exp = math.multiply(-2 * math.pi * n * k / xs.length, math.i);
            const addend = math.multiply(xs[n], math.pow(math.e, exp));
            XS[k] = math.add(XS[k], addend)
        }
        XS[k] = {value: math.divide(XS[k], xs.length), frequency: k};
    }
    XS.sort((a, b) => math.abs(b.value) - math.abs(a.value));
    return XS;
}


function setup() {
    createCanvas(1200, 800);
    noFill();
    stroke(255, 255, 255);
    strokeWeight(1);
    frameRate(30);
}


function drawComponent(x, y, component, frequency) {
    const radius = math.abs(component);
    ellipse(x, y, 2 * radius);
    const inverse = invert(component, frequency);
    const xHead = math.re(inverse) + x;
    const yHead = math.im(inverse) + y;
    line(x, y, xHead, yHead);
    return {x: xHead, y: yHead}
}


function invert(component, frequency) {
    const exp = math.multiply(frequency * time, math.i);
    return math.multiply(component, math.pow(math.e, exp));
}

function draw() {
    background(0);

    let x = 0;
    let y = 0;
    for (const {value, frequency} of transform) {
        const xy = drawComponent(x, y, value, frequency);
        x = xy.x;
        y = xy.y;
    }

    path.push({x: x, y: y});

    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();


    time += dt;
    if (time > 2 * math.pi) {
        time = 0;
        path = [];
    }
}
