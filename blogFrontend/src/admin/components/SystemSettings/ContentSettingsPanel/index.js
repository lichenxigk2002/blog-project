const instanceofs = (target, obj) => {
    let p = target;
    while (p) {
        if (p === obj.prototype){
            return true
        }
        p = p.__proto__
    }
    return false
}