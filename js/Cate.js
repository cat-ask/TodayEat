class Cate extends Menu{
    // menu_cate
    cate_event(){
        document.querySelector("#menu_cate").addEventListener("click",()=>{this.menu_cate_sel();});
        document.querySelector("#menu_cate_icon").addEventListener("click",()=>{this.menu_cate_sel();});
        document.querySelector("#menu_cate_add_btn").addEventListener("click",()=>{this.menu_cate_add();});
    }

    // menu_cate_sel
    menu_cate_sel(){
        let menu_cate_box = document.querySelector("#menu_cate_box");
        let menu_cate_list = document.querySelector("#menu_cate_list");
        menu_cate_list.style.height="0px";

        if(menu_cate_box.classList.contains("open")){
            super.menu_cate_close();
        }else{
            menu_cate_box.classList.add("open");
            Menu.menu_cate_list.forEach(x=>{
                let dom = this.menu_cate_make_item(x);

                dom.firstChild.addEventListener("click",(e)=>{this.menu_cate_change(e.target.getAttribute("value"));});
                if(dom.querySelector(".menu_cate_del")) dom.querySelector(".menu_cate_del").addEventListener("click",(e)=>{this.menu_cate_del_process(x)});
                menu_cate_list.appendChild(dom.firstChild);
            });
            menu_cate_list.style.height=(40*Menu.menu_cate_list.length)+"px";
        }
    }

    // menu_cate_make_item
    menu_cate_make_item(val){
        let dom = document.createElement("div");
        let check = val == Menu.select_cate ? "check" : "";
        let delbtn = val == "기본" ? "" : `<button class="menu_cate_del" type="button" target-id="${val}"><i class="fas fa-times"></i></button>`;
        dom.innerHTML = `<div class="menu_cate_item ${check}" value="${val}">
                            <i class="menu_cate_checkbox fas fa-check"></i>
                            ${val}
                            ${delbtn}
                        </div>`;
        return dom;
    }

    // menu_cate_del_process
    menu_cate_del_process(val){
        if(Menu.select_cate == val) Menu.select_cate = "기본";
        let flag = -1;
        Menu.menu_cate_list.forEach((x,idx)=>{if(x == val) flag = idx;});
        delete Menu.now_menu.list[val];
        if(flag != -1) Menu.menu_cate_list.splice(flag,1);
        this.menu_cate_change(Menu.select_cate);
        this.menu_update();
    }

    // menu_cate_change
    menu_cate_change(val){
        if(val == null) val = Menu.select_cate;
        document.querySelector("#menu_cate").innerHTML = val;
        Menu.select_cate = val;
        super.menu_cate_close();
    }

    // menu_cate_add
    menu_cate_add(){
        let dom = `<input type="text" class="form_input" id="menu_cate_add_name" placeholder="이름을 입력해주세요">`;
        
        let footer = `<button id="menu_cate_submit">결정</button>`;

        Menu.system.popup_open("카테고리 추가하기",dom,footer);
        document.querySelector("#menu_cate_submit").addEventListener("click",()=>{this.menu_cate_add_process();});
    }
    
    // menu_cate_add_process
    menu_cate_add_process(){
        let value = document.querySelector("#menu_cate_add_name").value,flag = false;
        if(value == "") return Menu.system.make_toast("내용을 입력해주세요!");
        Menu.menu_cate_list.forEach(x=>{if(value == x) flag = true;});
        if(flag) Menu.system.make_toast("이미 카테고리에 있습니다!");
        else{
            Menu.now_menu.list[value] = {"item":[],"check":true};
            Menu.menu_cate_list.push(value);

            if(document.querySelector("#menu_cate_box").classList.contains("open")) super.menu_cate_close();
            Menu.system.popup_close();
        }
    }

    
}