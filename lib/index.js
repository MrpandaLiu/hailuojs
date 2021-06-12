const get = (obj, keys, defaultValue = '') => {
    const keyList = keys.split('.');
    let res = obj;
    while(keyList.length) {
        try {
            res = res[`${keyList.shift()}`];
        } catch(e) {
            return defaultValue;
        }
    }
    return res;
};

class Watcher {
    constructor(cb) {
        this.cb = cb;
    }

    update() {
        this.cb();
    }
}

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

const reactive = (target, key, value) => {
    const dep = new Dep();
    Object.defineProperty(target, key, {
        get() {
            dep.add();
            return value;
        },
        set(newV) {
            if(target[key] !== newV) {
                value = newV;
                target[key] = newV;
                dep.notify();
            }
            return true;
        }
    });
}

const observer = (obj) => {
    const target = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) 
            target[key] = observer(obj[key]);
        else reactive(target, key, obj[key]);
    });
    return target;
}

class Hailuo {
    constructor(html) {
        this.states = {};
        this.mutations = {};
        this.renderer = html;
    }

    useReactive(obj) {
        this.states = observer(obj);
    }

    register(name, fn) {
        this.mutations[name] = fn;
    }

    render(root) {
        const compile = (node) => {
            if(Object.keys(window.Hailuo).includes(node.tagName.toLowerCase())) {
                const name = node.tagName.toLowerCase();
                node.parentNode.insertBefore(window.Hailuo[name], node);
                node.parentNode.removeChild(node);
            }
            if(node.getAttribute('h-if')) {
                const display = node.style.display;
                const renderShow = () => {
                    const isShow = get(this.states, node.getAttribute('h-if')); 
                    node.style.display = isShow ? display : 'none';
                };
                window.target = new Watcher(renderShow);
                window.target.update();
                get(this.states, node.getAttribute('h-if'));
            }
            if(node.getAttribute('h-bind')) {
                const type = node.tagName === "INPUT" ? 'value' : 'innerText';
                const renderData = () => { 
                    const val = get(this.states, node.getAttribute('h-bind')); 
                    node[type] = val; 
                }
                window.target = new Watcher(renderData);
                window.target.update();
                get(this.states, node.getAttribute('h-bind'));
                if(node.tagName === "INPUT" ) {
                    node.addEventListener('input', (e) => {
                        eval(`this.states.${node.getAttribute('h-bind')} = '${e.target.value}'`);
                    });
                }
            }
            if(node.getAttribute('h-for')) {
                const renderFor = () => {
                    const val = get(this.states, node.getAttribute('h-for'));
                    const tpl = node.children[0];
                    node.innerHTML = '';
                    val.forEach((item, index) => {
                        const travel = (node) => {
                            if(node.getAttribute('h-bind') && node.getAttribute('h-bind').indexOf('item') !== -1) {
                                const isChain = node.getAttribute('h-bind').split('.').length;
                                node.innerText = isChain === 1 ? item : get(item, node.getAttribute('h-bind').slice(5)); 
                            }
                            if(node.children) {
                                [...node.children].forEach((child) => { travel(child) });
                            }
                            return node;
                        }
                        const n = travel(tpl.cloneNode(true));
                        node.appendChild(n);
                    });
                };
                window.target = new Watcher(renderFor);
                window.target.update();
                get(this.states, node.getAttribute('h-for'));
                return;
            }
            if(node.getAttribute('h-click')) {
                node.addEventListener('click', this.mutations[node.getAttribute('h-click')]);
            }
            if(node.children) {
                for(const el of node.children) {
                    compile(el);
                }
            }
            return node;
        };
        compile(root);
    }
};

Hailuo.createApp = (html) => {
    return new Hailuo(html);
}

Hailuo.define = (name, app) => {
    const root = document.createElement('div');
    root.id = name;
    root.innerHTML = app.renderer;
    app.render(root);
    window.Hailuo[name] = root;
}

window.Hailuo = {};
