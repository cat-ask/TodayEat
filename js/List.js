class List extends Menu{

    option_tap(){
        let tap = document.querySelector("#menu_list_option_box");
        window.addEventListener("click",(e)=>{this.option_close(e.target)});
        if(tap.classList.contains("open")) tap.classList.remove("open");
        else tap.classList.add("open");
    }

    option_close(target){
        let tap = document.querySelector("#menu_list_option_box");
        if(tap.classList.contains("open") && (target.classList.contains("menu_list_option_item") || target.id !== "menu_list_option_icon")) tap.classList.remove("open");
    }

    option_event(){
        document.querySelector("#MenuListSave").addEventListener("click",()=>{this.menu_save_popup();});
        document.querySelector("#MenuListReset").addEventListener("click",this.menu_reset);
        document.querySelector("#MenuListOtherOpen").addEventListener("click",()=>{this.menu_list_open();});
    }

    // menu_save_popup
    menu_save_popup(){
        if(!document.querySelector("#popup")){
            const list = Menu.now_menu.list;
            const cate = Menu.menu_cate_list;
            let body = `<form name="menu_list_save_name_form" id="menu_list_save_name_form">
                            <label for="menu_list_save_name" class="form_label">※메뉴의 이름을 설정해주세요!</label>
                            <input type="text" class="form_input" id="menu_list_save_name" placeholder="이름을 입력해주세요!">
                        </form>`;
            let footer = `<button id="menu_list_save_name_btn">확인</button>`;
            Menu.system.popup_open("메뉴 저장",body,footer);

            document.querySelector("#menu_list_save_name_btn").addEventListener("click",()=>{this.menu_save_process(list,cate)});
        }
    }

    // menu_save_process
    menu_save_process(list,cate){
        // 깊은 복사(내용을 복사)!!!
        list = JSON.parse(JSON.stringify(list));
        cate = JSON.parse(JSON.stringify(cate));

        let now = new Object();
        Menu.now_menu = new Object();

        let name = document.querySelector("#menu_list_save_name").value;        
        now = {"list":list,"cate":cate,"name":name};

        if(name == "") return Menu.system.make_toast("이름을 입력해주세요!");
        if(Menu.menu_list.name == name) return Menu.system.make_toast("현재와 같은 이름입니다!");
        if(Menu.menu_list[name] !== undefined) return Menu.system.make_toast("이미 있는 이름입니다!");

        Menu.menu_list[name] = now;

        Menu.now_menu = now;
        Menu.menu_list_names.push(name);

        Menu.system.popup_close();
        Menu.system.make_toast("저장되었습니다!");

        this.menu_list_update();
    }

    // menu_list_update
    menu_list_update(){
        document.querySelector("#menu_list").innerHTML = "";

        if(Menu.now_menu.name !== "") document.querySelector("#menu_box_title > h2").innerHTML = `메뉴 [${Menu.now_menu.name}]`;
        else document.querySelector("#menu_box_title > h2").innerHTML = `메뉴`;

        if(Menu.menu_list_names.length > 0){
            Menu.menu_list_names.forEach(x=>{this.menu_list_item_make(x);});
        }else{
            let dom = document.createElement("div");
            dom.innerHTML = `<p id="menu_list_not" class="not_alert">현재 등록된 메뉴가 없습니다!</p>`;
            document.querySelector("#menu_list").appendChild(dom.firstChild);
        }
    }

    // menu_list_item_make
    menu_list_item_make(name){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="menu_list_item">
                            <p class="menu_list_title" target="${name}">${name}</p>
                            <button class="menu_list_del" target="${name}"><i class="fas fa-times menu_list_del" target="${name}"></i></button>
                        </div>`;
        dom.querySelector(".menu_list_title").addEventListener("click",(e)=>{this.menu_list_title_open(e.target)});
        dom.firstChild.querySelector(".menu_list_del").addEventListener("click",(e)=>{this.menu_list_del(e.target)});
        document.querySelector("#menu_list").appendChild(dom.firstChild);
    }

    // menu_reset
    menu_reset(){
        // Menu reset
        Menu.now_menu = {
            name:"",
            list:{
                "기본":{
                    "item":[],
                    "check":true
                }
            },
            cate:["기본"]
        }

        Menu.menu_cate_list = ["기본"];
        Menu.select_cate = "기본";
        
        // Rand reset
        Rand.min = Rand.max = 0;
        Rand.num = 1;
        Rand.overlap = false;

        super.menu_update();
        super.menu_cate_close();
    }

    // menu_list_open
    menu_list_open(){
        if(!document.querySelector("#popup")){
            if(Menu.menu_list_names.length > 0){
                let body = `<h5 id="menu_list_open_title">불러올 메뉴를 선택해주세요!</h5>
                            <p id="menu_list_open_warning">※메뉴를 불러오면 기존 메뉴는 지워집니다!</p>
                            <div id="menu_list_open_box"></div>`;
                let footer = `<button id="menu_list_open_btn">확인</button>`;
                Menu.system.popup_open("메뉴 불러오기",body,footer);

                document.querySelector("#menu_list_open_btn").addEventListener("click",this.menu_list_loading.bind(this));
    
                Menu.menu_list_names.forEach(x=>{
                    let dom = document.createElement("div");
                    dom.innerHTML = `<div class="menu_list_open_item" target="${x}">
                                        <p class="menu_list_open_item_name">${x}</p>
                                        <i class="fas fa-check MenuListOpenItemIcon"></i>
                                    </div>`;
                    dom.querySelector(".menu_list_open_item").addEventListener("click",(e)=>{this.menu_list_open_check(e.target)});
                    document.querySelector("#menu_list_open_box").appendChild(dom.firstChild);
                });
            }else Menu.system.make_toast("불러올 메뉴가 없습니다!");
        }
    }

    // menu_list_loading
    menu_list_loading(){
        let item = document.querySelector(".menu_list_open_item.check");
        if(item){
            let list = Menu.menu_list[item.getAttribute("target")];

            Menu.menu_cate_list = list.cate;
            Menu.now_menu = {};
            Menu.now_menu = {"list":list["list"],"cate":list["cate"],"name":list["name"]};
            Menu.select_cate = "기본";

            super.menu_update();

            Menu.system.popup_close();
        }else Menu.system.make_toast("불러올 메뉴를 선택해주세요!");
    }

    // menu_list_open_check
    menu_list_open_check(target){
        let item = document.querySelector(".menu_list_open_item.check");
        if(item) item.classList.remove("check");
        if(target.classList.contains("menu_list_open_item"))target.classList.add("check");
    }

    // menu_list_del
    menu_list_del(target){
        let name = target.getAttribute("target"),flag = false;
        delete Menu.menu_list[name];
        Menu.menu_list_names.forEach((x,idx)=>{
            if(x == name) flag = idx;
        });
        Menu.menu_list_names.splice(flag,1);
        this.menu_list_update();
    }

    // menu_list_title_open
    menu_list_title_open(target){
        let name = target.getAttribute("target");
        if(name){
            let body = `<h2 id="menu_list_title_open_popup_title">※주의!</h2>
                        <p id="menu_list_title_open_popup_content">기존에 있던 메뉴는 사라지게 됩니다! 메뉴를 불러오시겠습니까?</p>`;
            let footer = `<button id="menu_list_title_open_popup_btn" target="${name}">확인</button>`;
            Menu.system.popup_open("메뉴 불러오기",body,footer);
            document.querySelector("#menu_list_title_open_popup_btn").addEventListener("click",(e)=>{this.menu_list_title_open_process(name)});
        }
    }

    // menu_list_title_open_process
    menu_list_title_open_process(name){
        let list = new Object();
        list = {"list":Menu.menu_list[name].list,"cate":Menu.menu_list[name].cate,"name":Menu.menu_list[name].name}

        Menu.now_menu = new Object();
        Menu.now_menu = list;
        Menu.menu_cate_list = list.cate;
        Menu.select_cate = "기본";

        console.log(Menu.menu_list);

        super.menu_update();

        Menu.system.popup_close();
    }
}