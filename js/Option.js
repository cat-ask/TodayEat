class Option extends Menu{
    constructor(){
        super();

        this.option_event();
        this.option_tap();
    }

    option_tap(){
        let tap = document.querySelector("#MenuListOptionBox");
        window.addEventListener("click",(e)=>{this.option_close(e.target)});
        if(tap.classList.contains("open")) tap.classList.remove("open");
        else tap.classList.add("open");
    }

    option_close(target){
        let tap = document.querySelector("#MenuListOptionBox");
        if(tap.classList.contains("open") && (target.classList.contains("MenuListOptionItem") || target.id !== "MenuListOptionIcon")) tap.classList.remove("open");
    }

    option_event(){
        document.querySelector("#MenuListSave").addEventListener("click",()=>{this.MenuSave();});
        document.querySelector("#MenuListOtherSave").addEventListener("click",()=>{this.MenuSavePopup("other")});
        document.querySelector("#MenuListReset").addEventListener("click",this.MenuReset);
        document.querySelector("#MenuListOtherOpen").addEventListener("click",this.MenuListOpen.bind(this));
    }

    // MenuSavePopup
    MenuSavePopup(mode){
        if(!document.querySelector("#Popup")){
            let body = `<form name="MenuListSaveNameForm" id="MenuListSaveNameForm">
                            <label for="MenuListSaveName" class="FormLabel">※메뉴 리스트의 이름을 설정해주세요!</label>
                            <input type="text" class="FormInput" id="MenuListSaveName" placeholder="이름을 입력해주세요!">
                        </form>`;
            let footer = `<button id="MenuListSaveNameBtn">확인</button>`;
            Menu.system.popup_open("메뉴 리스트 저장",body,footer);

            document.querySelector("#MenuListSaveNameBtn").addEventListener("click",()=>{this.MenuSaveProcess(mode)});
        }
    }

    // MenuSave
    MenuSave(){
        let name = Menu.MenuList.name;
        if(name == "") this.MenuSavePopup("default");
        else{
            Menu.MenuListAll[name] = {"menu":Menu.MenuList.menu,"cate":Menu.MenuCateList};
            Menu.system.MakeToast("저장되었습니다!");
        }
    }

    // MenuSaveProcess
    MenuSaveProcess(mode){
        let list = Menu.MenuList.menu;
        let name = document.querySelector("#MenuListSaveName").value;
        if(name == "") return Menu.system.MakeToast("이름을 입력해주세요!");
        if(Menu.MenuListAll[name] !== undefined) return Menu.system.MakeToast("이미 있는 이름입니다!");
        if(mode == "other" && Menu.MenuList.name == name) return Menu.system.MakeToast("현재와 같은 이름입니다!");

        Menu.MenuListAll[name] = {"menu":list,"cate":Menu.MenuCateList};
        Menu.system.popup_close();
        Menu.MenuList.name = name;
        Menu.MenuListAllNames.push(name);
        Menu.system.MakeToast("저장되었습니다!");

        this.MenuListListUpdate();
    }

    // MenuListListUpdate
    MenuListListUpdate(){
        document.querySelector("#MenuListList").innerHTML = "";
        if(Menu.MenuListAllNames.length > 0){
            Menu.MenuListAllNames.forEach(x=>{this.MenuListListItemMake(x);});
        }else{
            let dom = document.createElement("div");
            dom.innerHTML = `<p id="MenuListListNot" class="NotAlert">현재 등록된 메뉴 리스트가 없습니다!</p>`;
            document.querySelector("#MenuListList").appendChild(dom.firstChild);
        }
    }

    // MenuListListItemMake
    MenuListListItemMake(name){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="MenuListListItem">
                            <p class="MenuListListTitle">${name}</p>
                            <button class="MenuListListDel" target="${name}"><i class="fas fa-times MenuListListDel" target="${name}"></i></button>
                        </div>`;
        document.querySelector("#MenuListList").appendChild(dom.firstChild);
    }

    // MenuReset
    MenuReset(){
        // Menu reset
        Menu.MenuList = {
            name:"",
            menu:{
                "기본":{
                    "item":[],
                    "check":true
                }
            }
        }

        Menu.MenuCateList = ["기본"];
        Menu.selectCate = "기본";
        
        // Rand reset
        Rand.min = Rand.max = 0;
        Rand.num = 1;
        Rand.overlap = false;

        super.MenuUpdate();
        super.MenuCateClose();
    }

    // MenuListOpen
    MenuListOpen(){
        if(Menu.MenuListAllNames.length > 0){
            let body = `<h5 id="MenuListOpenTitle">불러올 메뉴 리스트를 선택해주세요!</h5>
                        <p id="MenuListOpenWarning">※메뉴 리스트를 불러오면 기존 리스트는 지워집니다!</p>
                        <div id="MenuListOpenBox"></div>`;
            let footer = `<button id="MenuListSaveNameBtn">확인</button>`;
            Menu.system.popup_open("메뉴 리스트 불러오기",body,footer);

            Menu.MenuListAllNames.forEach(x=>{
                let dom = document.createElement("div");
                dom.innerHTML = `<div class="MenuListOpenItem" target="${x}">
                                    <p class="MenuListOpenItemName">${x}</p>
                                    <i class="fas fa-check MenuListOpenItemIcon"></i>
                                </div>`;
                dom.querySelector(".MenuListOpenItem").addEventListener("click",(e)=>{console.log(this)});
                document.querySelector("#MenuListOpenBox").appendChild(dom.firstChild);
            });
        }else Menu.system.MakeToast("불러올 메뉴 리스트가 없습니다!");
    }

    // MenuListOpenCheck
    MenuListOpenCheck(target){
        let item = document.querySelectorAll(".MenuListOpenItem.check");
        if(item) item.classList.remove("check");
        console.log(target);
    }
}