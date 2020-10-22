class MenuDB{
    static idxDB = "";

    async setIdxDB(){
        let req = window.indexedDB.open("Menu");

        req.onsuccess = await function (e){
            console.log(e);
            MenuDB.idxDB = req.result;
        }
    
        req.onupgradeneeded = await function (e){
            console.log(e);
            let res = e.target.result;
            let store = res.createObjectStore("menu",{
                "keyPath":"id",
                autoIncrement:true
            });
        }

    }

    async getDB(mode){
        if(MenuDB.idxDB == "") await this.setIdxDB();

        let result = {};

        console.log(MenuDB.idxDB);

        if(mode == "read") result.trs = MenuDB.idxDB.transaction(['menu']);
        if(mode == "write") result.trs = MenuDB.idxDB.transaction(['menu','readwrite']);

        result.store = result.trs.createObjectStore("menu");

        return result;
    }

    async DelDB(id){
        let {trs,store} = await this.getDB("write");
        let req = store.delete(id);
    }

    async UpdateDB(id,data){
        let {trs,store} = await this.getDB("write");
        let req = store.get(id);

        req.onsuccess = e =>{
            let upReq = store.put(data);
        }
    }

    async LoadDB(){
        let {trs,store} = await this.getDB("read");
        store.openCursor().onsuccess = e=>{
            let cursor = e.target.result;
            console.log(cursor);
        }
    }
    
    async InsertDB(data){
        let {trs,store} = await this.getDB("write");
        let req = store.add(data);
    }

    FoodAdd({price,name,cate,check,list}){
        let result = false;
        if(price == "" || name == "" || cate == "" || check == "" || list == "") return false;
        return result;
    }

    FoodRemove({name,cate,list}){
        let result = false;
        if(name == "" || cate == "" || list) return false;
        return result;
    }

    MenuListAdd(name,item){
        let result = false;
        if(name == "" || item == "") return false;
        return result;
    }

    MenuListLoad(){
        let result = []
        return result;
    }
}