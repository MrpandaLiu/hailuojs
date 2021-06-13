const { Dep } = require('./dep.js');

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

module.exports = {
    observer
};
