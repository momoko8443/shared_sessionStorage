class SharedSessionStorage{
    constructor(){
        if(!window){
            throw new Error('this library just support browser platform');
        }
        this.interval = 5000;
        window.addEventListener('DOMContentLoaded', (event) => {
            this._init();
        });

    }
    // config(cfg){

    // }
    setItem(name, value){
        window.localStorage.setItem(name, value);
    }

    getItem(name){
        return window.localStorage.getItem(name);
    }

    onChange(callback){
        window.addEventListener('storage', (result)=>{
            callback && callback(result);
        });
    }
    clear(){
        window.sessionStorage.clear();
        window.localStorage.clear();
    }
    _init(){
        var tabName = window.sessionStorage.getItem('tabName');
        if(!tabName){
            //is refresh page
            tabName = 'tab_' + Math.floor(Math.random() * new Date().getTime());
            window.sessionStorage.setItem('tabName',tabName);
            this._clearExpiredData();
            this._updateTimestamp(tabName);
        }
        document.getElementById('tabName').innerText = tabName;
        window.setInterval(()=>{
            this._updateTimestamp(tabName);
        },this.interval);
    }
    
    _updateTimestamp(tabName){
        var pool = JSON.parse(window.localStorage.getItem('sharedTabPool'));
        var time_stamp = new Date().getTime();
        pool[tabName] = time_stamp;
        window.localStorage.setItem('sharedTabPool',JSON.stringify(pool));
    }
    _clearExpiredData(){
        var pool = JSON.parse(window.localStorage.getItem('sharedTabPool'));
        for(var key in pool){
            var nowTime = new Date().getTime();
            if(nowTime - pool[key] > 5000){
                //is expired
                delete pool[key];
            }
        }
        if(Object.keys(pool).length === 0){
            window.localStorage.clear();
            window.localStorage.setItem('sharedTabPool','{}');
        }
    }

}

window.addEventListener('DOMContentLoaded', (event) => {
    init();
    renderData();
});
window.addEventListener('storage', (result)=>{
    renderData();
});
// document.getElementById('storeBtn').addEventListener('click',(e)=>{
//     updateLocalStorage();
//     renderData();
// });

// function renderData(){
//     var data = window.localStorage.getItem('sharedData');
//     if(data){
//         document.getElementById('sharedData').innerText = data;
//     }
// }
// function updateLocalStorage(){
//     var value = document.getElementById('message').value;
//     window.localStorage.setItem('sharedData',value);
// }
