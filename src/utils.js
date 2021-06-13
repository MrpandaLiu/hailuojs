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

module.exports = {
    get
};
