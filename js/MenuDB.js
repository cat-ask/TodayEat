class MenuDB{

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