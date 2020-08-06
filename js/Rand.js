class Rand extends Menu{
    static min = 0;
    static max = 0;
    static num = 1;
    static overlap = false;
    static list = [];
    static RandList = [];

    // Rand Option 클래스 다시 연결해야함

    constructor(){
        super();
        this.list = [];
        this.RandList = [];
        this.MakeList();
    }

    MakeList(){
        let flag=true,list = [];
        
        Menu.MenuCateList.forEach(x=>{
            list = Menu.MenuList.menu[x];

            if(list.check && list.item.length > 0){
                if(flag){
                    Rand.min = Rand.max = list.item[0].price;
                    flag=false;
                }

                list.item.forEach(item=>{
                    if(item.check){
                        this.list.push(item);
                        Rand.min = parseInt(item.price) < Rand.min ? parseInt(item.price) : Rand.min;
                        Rand.max = parseInt(item.price) > Rand.max ? parseInt(item.price) : Rand.max;
                    }
                });
            }
        });
        
        this.RandSetPopup();
    }

    RandSetPopup(){
        if(this.list.length > 0){
            let body = `<form id="MenuRandSetForm" name="MenuRandSetForm">
                            <label for="MenuRandNum" class="FormLabel">개수</label>
                            <input type="number" id="MenuRandNum" class="FormInput" min="1" max="${this.list.length}" value="1" placeholder="뽑을 개수를 정해주세요!">

                            <label for="MenuPriceArea" class="FormLabel">가격 범위</label>
                            <div id="MenuPriceAreaBox">
                                <div class="MenuPriceAreaItem">
                                    <label for="MenuPriceMin" class="FormLabel">최소</label>
                                    <input type="number" id="MenuPriceMin" class="FormInput" step="100" min="${Rand.min}" max="${Rand.max}" value="${Rand.min}">
                                </div>
                                <div class="MenuPriceAreaItem">
                                    <label for="MenuPriceMax" class="FormLabel">최대</label>
                                    <input type="number" id="MenuPriceMax" class="FormInput" step="100" min="${Rand.min}" max="${Rand.max}" value="${Rand.max}">
                                </div>
                            </div>

                            <div id="MenuRandOverlapBox">
                                <input type="checkbox" name="MenuRandOverlap" id="MenuRandOverlap">
                                <span>중복허용</span>
                            </div>
                        </form>`;

            let footer = `<button id="MenuRandOkBtn">확인</button>`;

            Menu.system.popup_open("뽑기 설정",body,footer);

            document.querySelector("#MenuRandOkBtn").addEventListener("click",()=>{this.MenuRandListMake()});

            document.querySelector("#MenuRandNum").addEventListener("change",()=>{this.MenuRandSetChange("num",1,this.list.length);});
            document.querySelector("#MenuPriceMin").addEventListener("change",()=>{this.MenuRandSetChange("min",Rand.min,Rand.max)});
            document.querySelector("#MenuPriceMax").addEventListener("change",()=>{this.MenuRandSetChange("max",Rand.min,Rand.max)});
            document.querySelector("#MenuRandOverlap").addEventListener("change",()=>{this.MenuRandSetChange("overlap",0,0)});
        
        }else Menu.system.MakeToast("뽑을 메뉴가 없습니다!");
    }

    MenuRandSetChange(mode,min,max){
        let price_min = document.querySelector("#MenuPriceMin"),price_max = document.querySelector("#MenuPriceMax"),rand_num = document.querySelector("#MenuRandNum");
        let min_val = parseInt(price_min.value),max_val = parseInt(price_max.value),num_val = parseInt(rand_num.value);

        if(mode == "min") min_val = min_val < min ? min : min_val > max_val ? max_val : min_val;
        else if(mode == "max") max_val = max_val > max ? max : max_val < min_val ? min_val : max_val;
        else if(mode == "num") num_val = num_val < min ? min : num_val > max ? max : num_val;
        else Rand.overlap = document.querySelector("#MenuRandOverlap").checked;
        
        Rand.num = rand_num.value = num_val;
        price_min.value = min_val;
        price_max.value = max_val;

        if(num_val > 1) document.querySelector("#MenuRandOverlapBox").classList.add("open");
        else{
            document.querySelector("#MenuRandOverlapBox").classList.remove("open");
            document.querySelector("#MenuRandOverlap").checked = false;
        }
        
    }

    MenuRandListMake(){
        let result = this.MenuRandList(),list = [];

        this.list.forEach(x=>{if(x.price >= Rand.min && x.price <= Rand.max) list.push(x);});
        if(result.length > 0) this.MakeResult(result);
        else Menu.system.MakeToast("해당 조건에 맞는 메뉴가 존재하지 않습니다!");
    }

    MenuRandList(){
        let list = [],result = [];
        this.list.forEach(x=>{if(x.price >= Rand.min && x.price <= Rand.max) list.push(x);});
        
        if(list.length >0){
            for(let i = 0; i<Rand.num; i++){
                let rand = Math.floor(Math.random()*(list.length));
                list[rand].idx = rand;
                result.push(list[rand]);
                if(!Rand.overlap) list.splice(rand,1);
                console.log(list[rand]);
            }

            this.RandList = result;
        }
        return result;
    }

    MakeResult(){
        Menu.system.popup_close();
        let dom = document.createElement("div");
        dom.innerHTML = `<div id="MenuResultBackground">
                            <div id="MenuResultBox">
                                <h2 id="MenuResultTitle">결과</h2>
                                <div id="MenuResultContent">
                                    
                                </div>
                                <div id="MenuResultFooter">
                                    <button class="MenuResultBtn" id="MenuResultAgain">다시하기</button>
                                    <button class="MenuResultBtn" id="MenuResultDelAgain">결과 제외하고 다시하기</button>
                                    <button class="MenuResultBtn" id="MenuResultClose">닫기</button>
                                </div>
                            </div>
                        </div>`;

        dom.querySelector("#MenuResultClose").addEventListener("click",this.menuResultClose);
        dom.querySelector("#MenuResultAgain").addEventListener("click",()=>{this.MenuRandResultAll()});

        document.querySelector("#wrap").appendChild(dom.firstChild);

        setTimeout(()=>{
            document.querySelector("#MenuResultBackground").classList.add("open");
            setTimeout(()=>{this.MenuRandResultAll();},700);
        },800);
        
    }

    async MenuRandResultAll(){
        this.MenuRandList();
        document.querySelector("#MenuResultContent").innerHTML = "";
        console.log(this.RandList);
        for(let i = 0; i< this.RandList.length; i++){
            await this.MakeResultItem(this.RandList[i].idx,this);
        }
    }

    async ShowResultAnimation(rand){
        let roop = this.MenuTimeSet();
        console.log(this.MenuTimeSet());
        for(let j = 0; j <= roop; j++){
            for(let i = 0; i<this.list.length; i++){
                if(j == roop && i > rand && document.querySelector("#nowResult")) document.querySelector("#nowResult").id = "";
                if((j == roop && i <= rand) || j < roop ) await this.MenuResultSetting(this.list[i]);
            }
        }
    }

    MenuResultSetting({name,price,cate}){
        let box = document.querySelector("#MenuResultContent > #nowResult");
        if(box){
            let cate_box = box.querySelector(".MenuResultItemCate");
            let name_box = box.querySelector(".MenuResultItemName");
            let price_box = box.querySelector(".MenuResultItemPrice");

            return new Promise(function(resolve,reject){
                setTimeout(()=>{
                    cate_box.innerHTML = `[${cate}]`;
                    name_box.innerHTML = name;
                    price_box.innerHTML = `가격 : ${price}원`;
                    resolve();
                },50);
            });
        }
    }

    MakeResultItem(idx,rand){
        return new Promise(function(resolve,reject){
            let dom = document.createElement("div");
            dom.innerHTML = `<div class="MenuResultItem" id="nowResult">
                                <span class="MenuResultItemCate"></span>
                                <p class="MenuResultItemName"></p>
                                <span class="MenuResultItemPrice">가격 : 원</span>
                            </div>`;
            document.querySelector("#MenuResultContent").appendChild(dom.firstChild);
            
            resolve(rand.ShowResultAnimation(idx));
        });
    }

    menuResultClose(){
        document.querySelector("#MenuResultBackground").classList.remove("open");
        setTimeout(()=>{document.querySelector("#wrap").removeChild(document.querySelector("#MenuResultBackground"));},800);
    }

    MenuTimeSet(){
        let time = 0,time_space = 50,max_time = 3000,num = 1;
        while(max_time >= time){
            time += (this.list.length * time_space);
            if(max_time >= time) num+=1;
        }
        return num;
    }
}