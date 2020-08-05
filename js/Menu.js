class Menu{

    static system = new System();
    static MenuCateList = ["기본"];
    static selectCate = "기본";
    static MenuList = {"기본":{"item":[],"check":true}};

    MenuEvent(){
        document.querySelector("#MenuCate").addEventListener("click",()=>{this.MenuCateSelect();});
        document.querySelector("#MenuCateIcon").addEventListener("click",()=>{this.MenuCateSelect();});

        document.querySelector("#MenuCateAdd").addEventListener("click",()=>{this.MenuCateAdd();});
        
        document.querySelector("#AddMenuButton").addEventListener("click",()=>{this.MenuAdd();});
        
        document.querySelector("#MenuPrice").addEventListener("keyup",()=>{this.MenuPriceChange();});
    }

    // MenuList

    // MenuListCateCheck
    MenuListCateCheck(target){
        let val = target.value,flag = target.checked;

        Menu.MenuList[val].check = flag;
        Menu.MenuList[val].item.forEach(x=>{x.check = flag;});

        let checkboxs = document.querySelectorAll("#"+target.parentNode.parentNode.id+"> .MenuListItemBox > .MenuListItem> .MenuListItemCheck");
        checkboxs.forEach(x=>{x.checked = flag;});
    }

    // MenuListItemCheck
    MenuListItemCheck(target){
        let val = target.getAttribute("target-cate"),name = target.value,flag = target.checked,checkflag = false;
        let list = Menu.MenuList[val].item;
        
        list.forEach(x=>{
            if(x.name == name) x.check = flag;
            if(x.check == true) checkflag = true;
        });
        
        let checkboxs = document.querySelector("#"+target.parentNode.parentNode.parentNode.id+"> .MenuListCateTitleBox > .MenuListCateCheck");
        checkboxs.checked = checkflag;
        Menu.MenuList[val].check = checkflag;
    }

    // MenuListItemCheckConnectCateCheck
    MenuListItemCheckConnectCateCheck(cate){
        let list = Menu.MenuList[cate].item,checkflag = false;
        
        list.forEach(x=>{if(x.check == true) checkflag = true; });
        
        let checkboxs = document.querySelector("#MenuList"+cate+"> .MenuListCateTitleBox > .MenuListCateCheck");
        if(checkboxs)checkboxs.checked = checkflag;
        Menu.MenuList[cate].check = checkflag;
    }

    // menuupdate
    MenuUpdate(cate){
        let flag = 0;
        Menu.MenuCateList.forEach(x=>{flag += Menu.MenuList[x].item.length;});

        if(flag > 0 && document.querySelector("#MenuListNot")) document.querySelector("#MenuList").removeChild(document.querySelector("#MenuListNot"));

        if(flag == 0){
            document.querySelector("#MenuList").innerHTML="";
            let dom = document.createElement("div");
            dom.innerHTML = `<p id="MenuListNot">현재 등록된 메뉴가 없습니다!</p>`;
            document.querySelector("#MenuList").appendChild(dom.firstChild);
        }else{
            if(cate !== undefined && cate !== null){
                if(Menu.MenuList[cate].item.length == 0) document.querySelector("#MenuList").removeChild(document.querySelector("#MenuList"+cate));
                else this.MenuListItemProcess(cate);
            }else{
                document.querySelector("#MenuList").innerHTML="";
                Menu.MenuCateList.forEach(x=>{this.MenuListItemProcess(x)});
            }
        }
    }

    // MenuLsitItemProcess
    MenuListItemProcess(cate){
        let list = Menu.MenuList[cate].item;
        
        if(Menu.MenuList[cate].item.length >0){
            if(!document.querySelector("#MenuList"+cate)){
                let dom = this.MenuListCateMake(cate);

                dom.querySelector(".MenuListCateTitle").addEventListener("click",(e)=>{this.MenuListItemOpen(e.target.parentNode.parentNode);});
                dom.querySelector(".MenuListCateCheck").addEventListener("change",(e)=>{this.MenuListCateCheck(e.target);});
                dom.querySelector(".MenuListCateOpenIcon").addEventListener("click",(e)=>{this.MenuListItemOpen(e.target.parentNode.parentNode);});
                document.querySelector("#MenuList").appendChild(dom.firstChild);
            }

            let list_box = document.querySelector("#MenuList"+cate+"> .MenuListItemBox");
            list_box.innerHTML = "";
            list.forEach(y=>{
                let dom = this.MenuListItemMake(y);

                dom.querySelector(".MenuListItemCheck").addEventListener("change",(e)=>{this.MenuListItemCheck(e.target)});
                dom.querySelector(".MenuListItemDel").addEventListener("click",(e)=>{this.MenuDel(e.target)});
                list_box.appendChild(dom.firstChild);
            });

            document.querySelector("#MenuList"+cate+">.MenuListCateTitleBox>.MenuListCateCheck").checked = true;
            let height = Menu.MenuList[cate].item.length;
            list_box.style.height = (height * 60)+"px";
        }
    }

    // MenuListItemOpen
    MenuListItemOpen(target){
        let val = target.id.substr(8,target.id.length),height = Menu.MenuList[val].item.length;

        if(target.classList.contains("close")){
            target.querySelector(".MenuListItemBox").style.height = (height * 60)+"px";
            target.classList.remove("close");
        }else{
            target.querySelector(".MenuListItemBox").style.height = "0px";
            target.classList.add("close");
        }
    }

    // MenuListCateMake
    MenuListCateMake(cate){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="MenuListCate" id="MenuList${cate}">
                            <div class = "MenuListCateTitleBox">
                                <input type="checkbox" class="MenuListCateCheck" value="${cate}" checked="true">
                                <h2 class="MenuListCateTitle">${cate}</h2>
                                <i class="fas fa-angle-down MenuListCateOpenIcon"></i>
                            </div>
                            <div class="MenuListItemBox">
                            </div>
                        </div>`;
                        
        return dom;
    }

    // menudel
    MenuDel(target){
        let cate = target.getAttribute("target-cate"),name = target.getAttribute("target");
        let list = Menu.MenuList[cate].item,flag = -1;
        list.forEach((x,idx)=>{if(x.name == name) flag = idx;});
        if(flag !== -1) list.splice(flag,1);
        Menu.MenuList[cate].item = list;
        this.MenuUpdate(cate);
        this.MenuListItemCheckConnectCateCheck(cate);
    }

    // MenuListItemMake
    MenuListItemMake({name,price,check,cate}){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="MenuListItem">
                            <input type="checkbox" class="MenuListItemCheck" value="${name}" target-cate="${cate}" checked="${check}">
                            <span class="MenuListItemName">${name} - [${price}원]</span>
                            <button class="MenuListItemDel" target="${name}" target-cate="${cate}"><i class="fas fa-times" target="${name}" target-cate="${cate}"></i></button>
                        </div>`;
        dom.querySelector(".MenuListItemCheck").checked = check;
        return dom;
    }

    // menuprice
    MenuPriceChange(){
        let price = document.querySelector("#MenuPrice").value;
        price = price.replace(/[^0-9]/g,"");
        document.querySelector("#MenuPrice").value = price;
    }

    // menuadd
    MenuAdd(){
        let MenuAddForm = document.AddMenuBoxForm,flag = 0;
        let name = MenuAddForm.MenuName.value, price = MenuAddForm.MenuPrice.value,cate = Menu.selectCate;
        Menu.selectCate = "기본";

        if(name == "" || price == "" || cate == "") return Menu.system.MakeToast("값을 입력해주세요!");

        Menu.MenuList[cate].item.forEach(x=>{if(x.name == name)flag = 1});
        
        if(flag) return Menu.system.MakeToast("이미 등록된 메뉴입니다!");
        Menu.MenuList[cate].item.push({"name":name,"price":parseInt(price),"cate":cate,"check":true});

        MenuAddForm.MenuName.value = "";
        MenuAddForm.MenuPrice.value = "";
        document.querySelector("#MenuCate").innerText = Menu.selectCate;

        if(document.querySelector("#MenuCateBox").classList.contains("open")) this.MenuCateClose();
        
        this.MenuUpdate(cate);
    }

    // MenuCate

    // MenuCateSelect
    MenuCateSelect(){
        let menu_cate_box = document.querySelector("#MenuCateBox");
        let menu_cate_list = document.querySelector("#MenuCateList");
        menu_cate_list.style.height="0px";

        if(menu_cate_box.classList.contains("open")){
            this.MenuCateClose();
        }else{
            menu_cate_box.classList.add("open");
            Menu.MenuCateList.forEach(x=>{
                let dom = this.MenuCateMakeItem(x);

                dom.firstChild.addEventListener("click",(e)=>{this.MenuCateChange(e.target.getAttribute("value"));});
                if(dom.querySelector(".MenuCateDel")) dom.querySelector(".MenuCateDel").addEventListener("click",(e)=>{this.MenuCateDelPrograss(x)});
                menu_cate_list.appendChild(dom.firstChild);
            });
            menu_cate_list.style.height=(40*Menu.MenuCateList.length)+"px";
        }
    }

    // MenuCateMakeItem
    MenuCateMakeItem(val){
        let dom = document.createElement("div");
        let check = val == Menu.selectCate ? "check" : "";
        let delbtn = val == "기본" ? "" : `<button class="MenuCateDel" type="button" target-id="${val}"><i class="fas fa-times"></i></button>`;
        dom.innerHTML = `<div class="MenuCateItem ${check}" value="${val}">
                            <i class="CheckBox fas fa-check"></i>
                            ${val}
                            ${delbtn}
                        </div>`;
        return dom;
    }

    // MenuCateDelPrograss
    MenuCateDelPrograss(val){
        if(Menu.selectCate == val) Menu.selectCate = "기본";
        let flag = -1;
        Menu.MenuCateList.forEach((x,idx)=>{if(x == val) flag = idx;});
        delete Menu.MenuList[val];
        if(flag != -1) Menu.MenuCateList.splice(flag,1);
        this.MenuCateChange(Menu.selectCate);
        this.MenuUpdate();
    }

    // MenuCateChange
    MenuCateChange(val){
        if(val == null) val = Menu.selectCate;
        document.querySelector("#MenuCate").innerHTML = val;
        Menu.selectCate = val;
        this.MenuCateClose();
    }

    // MenuCateAdd
    MenuCateAdd(){
        let dom = `<input type="text" class="FormInput" id="MenuCateAddName" placeholder="이름을 입력해주세요">`;
        
        let footer = `<button class="PopupButtonBtn PopupSubmit" id="MenuCateAddBtn">결정</button>`;

        Menu.system.popup_open("카테고리 추가하기",dom,footer);
        document.querySelector("#MenuCateAddBtn").addEventListener("click",()=>{this.MenuCateAddPrograss();});
    }
    
    // MenuCateAdd Prograss
    MenuCateAddPrograss(){
        let value = document.querySelector("#MenuCateAddName").value,flag = false;
        if(value == "") return Menu.system.MakeToast("내용을 입력해주세요!");
        Menu.MenuCateList.forEach(x=>{if(value == x) flag = true;});
        if(flag) Menu.system.MakeToast("이미 카테고리에 있습니다!");
        else{
            Menu.MenuList[value] = {"item":[],"check":true};
            Menu.MenuCateList.push(value);

            if(document.querySelector("#MenuCateBox").classList.contains("open")) this.MenuCateClose();
            Menu.system.popup_close();
        }
    }

    // MenuCateClose
    MenuCateClose(){
        let menu_cate_box = document.querySelector("#MenuCateBox");
        let menu_cate_list = document.querySelector("#MenuCateList");

        menu_cate_list.style.height="0px";
        setTimeout(()=>{
            menu_cate_box.classList.remove("open");
            menu_cate_list.innerHTML="";
        },200);
    }
}