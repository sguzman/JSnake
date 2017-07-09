"use strict";

const keysUniq$ = Rx.Observable.fromEvent(document, 'keydown').pluck('keyCode').distinctUntilChanged();

const keyUp$ = keysUniq$.filter(s => s === 38).mapTo([0,-1]);
const keyDown$ = keysUniq$.filter(s => s === 40).mapTo([0,1]);
const keyLeft$ = keysUniq$.filter(s => s === 37).mapTo([-1,0]);
const keyRight$ = keysUniq$.filter(s => s === 39).mapTo([1,0]);

const keyInput$ = keyUp$.merge(keyDown$).merge(keyLeft$).merge(keyRight$).subscribe(s => direction = s);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const bgColor = 'black';

const moveUnits = 1;
const waitTimeBetweenFrames = 20;
const widthOfSnake = 10;

function rgbFromValues(red, green, blue) {
    return `rgb(${red},${green},${blue})`;
}

function square(_x, _y, _r = 5) {
    return {
        x: _x,
        y: _y,
        r: _r,
        color: rgbFromValues.apply(null, [0,0,0].map(s => Math.floor(255 * Math.random()))),
        render() {
            const preColor = context.fillStyle;
            context.fillStyle = this.color;

            context.fillRect(this.x, this.y, this.r, this.r);

            context.fillStyle = preColor;
        }
    };
}

const initX = canvas.width / 2;
const initY = canvas.height / 2;

let snake = square(initX, initY);
let direction = [0,-1];

const gameLoop$ = Rx.Observable.interval(waitTimeBetweenFrames).subscribe(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    snake.x += direction[0];
    snake.y += direction[1];

    snake.render();
});
