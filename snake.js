"use strict";

(() => {
    const keysUniq$ = Rx.Observable.fromEvent(document, 'keydown').pluck('keyCode').distinctUntilChanged();

    const keyUp$ = keysUniq$.filter(s => s === 38).mapTo([0,-1]);
    const keyDown$ = keysUniq$.filter(s => s === 40).mapTo([0,1]);
    const keyLeft$ = keysUniq$.filter(s => s === 37).mapTo([-1,0]);
    const keyRight$ = keysUniq$.filter(s => s === 39).mapTo([1,0]);

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const bgColor = 'black';

    const waitTimeBetweenFrames = 125;
    const widthOfSquare = 5;
    const moveUnits = widthOfSquare;

    function rgbFromValues(red, green, blue) {
        return `rgb(${red},${green},${blue})`;
    }

    function randomUpto(number) {
        return Math.floor(number * Math.random());
    }

    function overlap(x1, x2, y1, y2) {
        if (y1 > x1) {
            return overlap(y1, y2, x1, x2);
        }

        return x1 <= y2 && y1 <= x2;
    }

    function squareOverlapOf(sq1, sq2, prop) {
        const x1 = sq1[prop];
        const x2 = sq1[prop] + widthOfSquare;

        const y1 = sq2[prop];
        const y2 = sq2[prop] + widthOfSquare;

        return overlap(x1, x2, y1, y2);
    }

    function squareOverlap(sq1, sq2) {
        return squareOverlapOf(sq1, sq2, 'x') && squareOverlapOf(sq1, sq2, 'y');
    }

    function Square(_x, _y, _r = widthOfSquare) {
        return {
            x: _x,
            y: _y,
            r: _r,
            color: rgbFromValues.apply(null, [null, null, null].map(s => randomUpto(255))),
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

    let snake = new Square(initX, initY);
    let direction = [0,-1];

    let food = new Square(randomUpto(canvas.width), randomUpto(canvas.height));
    food.color = 'rgb(255,255,255)';

    const keyInput$ = keyUp$.merge(keyDown$).merge(keyLeft$).merge(keyRight$).subscribe(s => direction = s);

    const gameLoop$ = Rx.Observable.interval(waitTimeBetweenFrames);

    gameLoop$.map(s => snake.x > canvas.width).distinctUntilChanged().filter(s => s).subscribe(s => snake.x = 0);
    gameLoop$.map(s => snake.x < 0).distinctUntilChanged().filter(s => s).subscribe(s => snake.x = canvas.width);
    gameLoop$.map(s => snake.y < 0).distinctUntilChanged().filter(s => s).subscribe(s => snake.y = canvas.height);
    gameLoop$.map(s => snake.y > canvas.height).distinctUntilChanged().filter(s => s).subscribe(s => snake.y = 0);

    const collision$ = gameLoop$.filter(s => squareOverlap(snake, food)).mapTo(true);
    const noCollision$ = gameLoop$.filter(s => !squareOverlap(snake, food)).mapTo(false);
    const foodCollide$ = collision$.merge(noCollision$).distinctUntilChanged();

    foodCollide$.subscribe(s => {
        console.log(s);
    });

    gameLoop$.subscribe(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        snake.x += direction[0] * moveUnits;
        snake.y += direction[1] * moveUnits;

        food.render();
        snake.render();
    });

})();
