class Menu{
    static system = new System();
    static menu_cate_list = ["기본"];
    static select_cate = "기본";
    static now_menu = {
        name:"",
        list:{
            "기본":{
                "item":[],
                "check":true
            }
        },
        cate:["기본"]
    };
    static menu_list = {};
    static menu_list_names = [];

    menu_event(){
        document.querySelector("#add_menu_btn").addEventListener("click",()=>{this.menu_add();});
        document.querySelector("#menu_price").addEventListener("keyup",()=>{this.menu_price_change();});
    }

    // Menu

    // menu_item_check
    menu_item_check(target){
        let val = target.getAttribute("target-cate"),name = target.value,flag = target.checked,checkflag = false;
        let list = Menu.now_menu.list[val].item;
        
        list.forEach(x=>{
            if(x.name == name) x.check = flag;
            if(x.check == true) checkflag = true;
        });
        
        let checkboxs = document.querySelector("#"+target.parentNode.parentNode.parentNode.id+"> .menu_cate_title_box > .menu_cate_check");
        checkboxs.checked = checkflag;
        Menu.now_menu.list[val].check = checkflag;
    }

    // menu_item_cate_check
    menu_item_cate_check(cate){
        let list = Menu.now_menu.list[cate].item,checkflag = false;
        
        list.forEach(x=>{if(x.check == true) checkflag = true; });
        let domlist = document.querySelectorAll(".menu_cate");
        let checkboxs = "";
        domlist.forEach(x=>{if(x.getAttribute("target") == cate) checkboxs = x.querySelector(".menu_cate_check");});
        if(checkboxs)checkboxs.checked = checkflag;
        Menu.now_menu.list[cate].check = checkflag;
    }

    // menu_update
    menu_update(cate){
        let flag = 0;

        if(Menu.now_menu.name !== "") document.querySelector("#menu_box_title > h2").innerHTML = `메뉴 [${Menu.now_menu.name}]`;
        else document.querySelector("#menu_box_title > h2").innerHTML = `메뉴`;
        
        Menu.menu_cate_list.forEach(x=>{flag += Menu.now_menu.list[x].item.length;});

        if(flag > 0 && document.querySelector("#menu_not")) document.querySelector("#menu").removeChild(document.querySelector("#menu_not"));

        if(flag == 0){
            document.querySelector("#menu").innerHTML="";
            let dom = document.createElement("div");
            dom.innerHTML = `<p id="menu_not" class="not_alert">현재 등록된 메뉴가 없습니다!</p>`;
            document.querySelector("#menu").appendChild(dom.firstChild);
        }else{
            if(cate !== undefined && cate !== null){
                if(Menu.now_menu.list[cate].item.length == 0) document.querySelector("#menu").removeChild(document.querySelector("#menu"+cate));
                else this.menu_item_process(cate);
            }else{
                document.querySelector("#menu").innerHTML="";
                Menu.menu_cate_list.forEach(x=>{this.menu_item_process(x)});
            }
        }
    }

    // menu_item_process
    menu_item_process(cate){
        let list = Menu.now_menu.list[cate].item;
        
        if(Menu.now_menu.list[cate].item.length >0){
            if(!document.querySelector("#menu"+cate)){
                let dom = this.menu_cate_make(cate);

                dom.querySelector(".menu_cate_title").addEventListener("click",(e)=>{this.menu_item_open(e.target.parentNode.parentNode);});
                dom.querySelector(".menu_cate_check").addEventListener("change",(e)=>{this.menu_cate_check(e.target);});
                dom.querySelector(".menu_cate_open_icon").addEventListener("click",(e)=>{this.menu_item_open(e.target.parentNode.parentNode);});
                document.querySelector("#menu").appendChild(dom.firstChild);
            }
            let domlist = document.querySelectorAll(".menu_cate");
            let target = "";
            domlist.forEach(x=>{if(x.getAttribute("target") == cate) target = x;});
            let list_box = target.querySelector(".menu_item_box");
            list_box.innerHTML = "";
            list.forEach(y=>{
                let dom = this.menu_item_make(y);

                dom.querySelector(".menu_item_check").addEventListener("change",(e)=>{this.menu_item_check(e.target)});
                dom.querySelector(".menu_item_del").addEventListener("click",(e)=>{this.menu_del(e.target)});
                list_box.appendChild(dom.firstChild);
            });

            target.querySelector(".menu_cate_title_box>.menu_cate_check").checked = true;
            let height = Menu.now_menu.list[cate].item.length;
            list_box.style.height = (height * 60)+"px";
        }
    }

    // menu_item_open
    menu_item_open(target){
        let val = target.getAttribute("target"),height = Menu.now_menu.list[val].item.length;

        if(target.classList.contains("close")){
            target.querySelector(".menu_item_box").style.height = (height * 60)+"px";
            target.classList.remove("close");
        }else{
            target.querySelector(".menu_item_box").style.height = "0px";
            target.classList.add("close");
        }
    }

    // menu_cate_make
    menu_cate_make(cate){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="menu_cate" id="menu${cate}" target="${cate}">
                            <div class = "menu_cate_title_box">
                                <input type="checkbox" class="menu_cate_check" value="${cate}" checked="true">
                                <h2 class="menu_cate_title">${cate}</h2>
                                <i class="fas fa-angle-down menu_cate_open_icon"></i>
                            </div>
                            <div class="menu_item_box">
                            </div>
                        </div>`;
                        
        return dom;
    }

    // menu_del
    menu_del(target){
        let cate = target.getAttribute("target-cate"),name = target.getAttribute("target");
        let list = Menu.now_menu.list[cate].item,flag = -1;
        list.forEach((x,idx)=>{if(x.name == name) flag = idx;});
        if(flag !== -1) list.splice(flag,1);
        Menu.now_menu.list[cate].item = list;
        this.menu_update(cate);
        this.menu_item_cate_check(cate);
    }

    // menu_item_make
    menu_item_make({name,price,check,cate}){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="menu_item">
                            <input type="checkbox" class="menu_item_check" value="${name}" target-cate="${cate}" checked="${check}">
                            <p class="menu_item_name">${name} <span class="menu_item_price">${price}원</span></p>
                            <button class="menu_item_del" target="${name}" target-cate="${cate}"><i class="fas fa-times" target="${name}" target-cate="${cate}"></i></button>
                        </div>`;
        dom.querySelector(".menu_item_check").checked = check;
        return dom;
    }

    // menu_price_change
    menu_price_change(){
        let price = document.querySelector("#menu_price").value;
        price = price.replace(/[^0-9]/g,"");
        document.querySelector("#menu_price").value = price;
    }

    // menu_add
    menu_add(){
        let MenuAddForm = document.add_menu_box_form,flag = 0;
        let name = MenuAddForm.menu_name.value, price = MenuAddForm.menu_price.value,cate = Menu.select_cate;
        let menu_name = Menu.now_menu.name, menu = Menu.now_menu;
        
        let obj = new Object();
        obj = {"name":name,"price":parseInt(price),"cate":cate,"check":true};
        
        Menu.select_cate = "기본";

        if(name == "" || price == "" || cate == "") return Menu.system.make_toast("값을 입력해주세요!");

        menu.list[cate].item.forEach(x=>{if(x.name == name)flag = 1});
        
        if(flag) return Menu.system.make_toast("이미 등록된 메뉴입니다!");

        if(menu_name == "") menu.list[cate].item.push(obj);
        else{
            Menu.menu_list[menu_name].list[cate].item.push(obj);
            menu = Menu.menu_list[menu_name];
        }

        MenuAddForm.menu_name.value = "";
        MenuAddForm.menu_price.value = "";
        document.querySelector("#menu_cate").innerText = "기본";

        Menu.now_menu = menu;

        console.log(Menu.menu_list);

        if(document.querySelector("#menu_cate_box").classList.contains("open")) this.menu_cate_close();
        
        this.menu_update(cate);
    }

    // menu_cate

    // menu_cate_close
    menu_cate_close(){
        let menu_cate_box = document.querySelector("#menu_cate_box");
        let menu_cate_list = document.querySelector("#menu_cate_list");

        menu_cate_list.style.height="0px";
        setTimeout(()=>{
            menu_cate_box.classList.remove("open");
            menu_cate_list.innerHTML="";
        },200);
    }

    // menu_cate_check
    menu_cate_check(target){
        
        let val = target.value,flag = target.checked;

        Menu.now_menu.list[val].check = flag;
        Menu.now_menu.list[val].item.forEach(x=>{x.check = flag;});

        let checkboxs = document.querySelectorAll("#"+target.parentNode.parentNode.id+"> .menu_item_box > .menu_item> .menu_item_check");
        checkboxs.forEach(x=>{x.checked = flag;});
    }
}