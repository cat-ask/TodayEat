class MenuRand extends Menu{
    static min = 0;
    static max = 0;
    static num = 1;
    static overlap = false;
    static list = [];
    static rand_list = [];

    // make_rand_list
    make_rand_list(){
        let flag=true,list = [];

        MenuRand.list = [];
        
        Menu.menu_cate_list.forEach(x=>{
            list = Menu.now_menu.list[x];

            if(list.check && list.item.length > 0){
                if(flag){
                    MenuRand.min = MenuRand.max = list.item[0].price;
                    flag=false;
                }

                list.item.forEach(item=>{
                    if(item.check){
                        MenuRand.list.push(item);
                        MenuRand.min = parseInt(item.price) < MenuRand.min ? parseInt(item.price) : MenuRand.min;
                        MenuRand.max = parseInt(item.price) > MenuRand.max ? parseInt(item.price) : MenuRand.max;
                    }
                });
            }
        });
        
        this.rand_set_popup(MenuRand.min,MenuRand.max);
    }

    // rand_set_popup
    rand_set_popup(min,max){
        if(MenuRand.list.length > 0){
            let body = `<form id="menu_rand_set_form" name="menu_rand_set_form">
                            <label for="menu_rand_num" class="form_label">개수</label>
                            <input type="number" id="menu_rand_num" class="form_input" min="1" max="${MenuRand.list.length}" value="1" placeholder="뽑을 개수를 정해주세요!">

                            <label for="menu_price_area" class="form_label">가격 범위</label>
                            <div id="menu_price_area_box">
                                <div class="menu_price_area_item">
                                    <label for="menu_price_min" class="form_label">최소</label>
                                    <input type="number" id="menu_price_min" class="form_input" step="100" min="${min}" max="${max}" value="${min}">
                                </div>
                                <div class="menu_price_area_item">
                                    <label for="menu_pirce_max" class="form_label">최대</label>
                                    <input type="number" id="menu_pirce_max" class="form_input" step="100" min="${min}" max="${max}" value="${max}">
                                </div>
                            </div>

                            <div id="menu_rand_overlap_box">
                                <input type="checkbox" name="menu_rand_over_lap" id="menu_rand_over_lap">
                                <span>중복허용</span>
                            </div>
                        </form>`;

            let footer = `<button id="menu_rand_btn">확인</button>`;

            Menu.system.popup_open("뽑기 설정",body,footer);

            document.querySelector("#menu_rand_btn").addEventListener("click",()=>{this.menu_rand_list_make()});

            document.querySelector("#menu_rand_num").addEventListener("change",()=>{this.menu_rand_set_change("num",1,MenuRand.list.length);});
            document.querySelector("#menu_price_min").addEventListener("change",()=>{this.menu_rand_set_change("min",min,max)});
            document.querySelector("#menu_pirce_max").addEventListener("change",()=>{this.menu_rand_set_change("max",min,max)});
            document.querySelector("#menu_rand_over_lap").addEventListener("change",()=>{this.menu_rand_set_change("overlap",0,0)});
        
        }else Menu.system.make_toast("뽑을 메뉴가 없습니다!");
    }

    // menu_rand_set_change
    menu_rand_set_change(mode,min,max){
        let price_min = document.querySelector("#menu_price_min"),price_max = document.querySelector("#menu_pirce_max"),rand_num = document.querySelector("#menu_rand_num");
        let min_val = parseInt(price_min.value),max_val = parseInt(price_max.value),num_val = parseInt(rand_num.value);

        if(mode == "min") min_val = min_val < min ? min : min_val > max_val ? max_val : min_val;
        else if(mode == "max") max_val = max_val > max ? max : max_val < min_val ? min_val : max_val;
        else if(mode == "num") num_val = num_val < min ? min : num_val > max ? max : num_val;
        else MenuRand.overlap = document.querySelector("#menu_rand_over_lap").checked;
        
        MenuRand.num = rand_num.value = num_val;
        MenuRand.min = price_min.value = min_val;
        MenuRand.max = price_max.value = max_val;

        if(num_val > 1) document.querySelector("#menu_rand_overlap_box").classList.add("open");
        else{
            document.querySelector("#menu_rand_overlap_box").classList.remove("open");
            document.querySelector("#menu_rand_over_lap").checked = false;
        }
        
    }

    // menu_rand_list_make
    menu_rand_list_make(){
        let list = [];

        MenuRand.list.forEach(x=>{if(x.price >= MenuRand.min && x.price <= MenuRand.max) list.push(x);});
        if(list.length > 0 && MenuRand.num <= list.length) this.make_result();
        else if(list.length > 0) Menu.system.make_toast("해당 조건에 맞는 메뉴가 충분하지 않습니다!");
        else Menu.system.make_toast("해당 조건에 맞는 메뉴가 존재하지 않습니다!");
    }

    // menu_rand_list
    menu_rand_list(){
        let list = [],result = [];

        MenuRand.list.forEach(x=>{if(x.price >= MenuRand.min && x.price <= MenuRand.max)list.push(x);});

        if(list.length >0){
            for(let i = 0; i<MenuRand.num; i++){
                let rand = Math.floor(Math.random()*(list.length));
                list[rand].idx = rand;
                result.push(list[rand]);
                if(!MenuRand.overlap) list.splice(rand,1);
            }

            MenuRand.rand_list = result;
        }
        return result;
    }

    // make_result
    make_result(){
        Menu.system.popup_close();
        let dom = document.createElement("div");
        dom.innerHTML = `<div id="menu_result_background">
                            <div id="menu_result_box">
                                <h2 id="menu_result_title">결과</h2>
                                <div id="menu_result_content">
                                    
                                </div>
                                <div id="menu_result_footer">
                                    <button class="menu_result_btn" id="menu_result_again">다시하기</button>
                                    <button class="menu_result_btn" id="menu_result_close">닫기</button>
                                </div>
                            </div>
                        </div>`;

        dom.querySelector("#menu_result_close").addEventListener("click",this.menu_result_close);
        dom.querySelector("#menu_result_again").addEventListener("click",()=>{this.menu_rand_result_all()});

        document.querySelector("#wrap").appendChild(dom.firstChild);

        setTimeout(()=>{
            document.querySelector("#menu_result_background").classList.add("open");
            setTimeout(()=>{this.menu_rand_result_all();},700);
        },800);
        
    }

    // menu_rand_result_all
    menu_rand_result_all(){
        this.menu_rand_list();
        document.querySelector("#menu_result_content").innerHTML = "";
        for(let i = 0; i< MenuRand.rand_list.length; i++){
            this.make_result_item(MenuRand.rand_list[i]);
        }
    }

    // make_result_item
    make_result_item({name,cate,price}){
        let dom = document.createElement("div");
        dom.innerHTML = `<div class="menu_result_item">
                            <span class="menu_result_item_cate">[${cate}]</span>
                            <p class="menu_result_item_name">${name}</p>
                            <span class="menu_result_item_price">가격 : ${price}원</span>
                            <div class="menu_result_item_cover">?</div>
                        </div>`;
        
        dom.firstChild.querySelector(".menu_result_item_cover").addEventListener("click",(e)=>{e.target.classList.add("open")});
        document.querySelector("#menu_result_content").appendChild(dom.firstChild);
    }

    // menu_result_close
    menu_result_close(){
        document.querySelector("#menu_result_background").classList.remove("open");
        setTimeout(()=>{document.querySelector("#wrap").removeChild(document.querySelector("#menu_result_background"));},800);
    }
}