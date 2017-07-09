const keysUniq$ = Rx.Observable.fromEvent(document, 'keydown').pluck('keyCode').distinctUntilChanged();

const keyUp$ = keysUniq$.filter(s => s === 38).mapTo([0,-1]);
const keyDown$ = keysUniq$.filter(s => s === 40).mapTo([0,1]);
const keyLeft$ = keysUniq$.filter(s => s === 37).mapTo([-1,0]);
const keyRight$ = keysUniq$.filter(s => s === 39).mapTo([1,0]);

const keyInput$ = keyUp$.merge(keyDown$).merge(keyLeft$).merge(keyRight$);
