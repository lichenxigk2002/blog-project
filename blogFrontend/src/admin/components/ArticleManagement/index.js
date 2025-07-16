function debounce (fn,delay){
    let timer;
    return function (...arg){
        if(timer) clearTimeout(timer);
        timer = setTimeout(function (){
            fn.apply( this,arg)
        },delay)
    }
}