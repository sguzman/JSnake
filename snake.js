"use strict";

const keysUniq$ = Rx.Observable.fromEvent(document, 'keydown').pluck('keyCode').distinctUntilChanged();

const keyUp$ = keysUniq$.filter(s => s === 38).mapTo([0,-1]);
const keyDown$ = keysUniq$.filter(s => s === 40).mapTo([0,1]);
const keyLeft$ = keysUniq$.filter(s => s === 37).mapTo([-1,0]);
const keyRight$ = keysUniq$.filter(s => s === 39).mapTo([1,0]);

const keyInput$ = keyUp$.merge(keyDown$).merge(keyLeft$).merge(keyRight$).subscribe(s => direction = s);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const waitTimeBetweenFrames = 20;
const widthOfSnake = 10;

let direction = [0,-1];

function rgbFromValues(red, green, blue) {
    return `rgb(${red},${green},${blue})`;
}

function square(_x, _y, _r) {
    return {
        x: _x,
        y: _y,
        r: _r,
        color: rgbFromValues(255 * Math.random(), 255 * Math.random(), 255 * Math.random()),
        render() {
            const preColor = context.fillStyle;
            context.fillStyle = this.color;

            context.fillRect(this.x, this.y, this.r, this.r);

            context.fillStyle = preColor;
        }
    };
}

let snake = [square(0, 0)];

let food = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
};
