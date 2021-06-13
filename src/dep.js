class Dep {
    constructor() {
        this.subs = [];
    }

    add() {
        if(window.target) {
            this.subs.push(window.target);
            window.target = null;
        }
    }

    notify() {
        this.subs.forEach((watcher) => {
            watcher.update();
        });
    }
}

module.exports = {
    Dep
};