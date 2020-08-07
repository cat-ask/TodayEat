class MenuControl{
    constructor(){
        this.MenuAllEvent();
        
        this.menu = new Menu();
        this.list = new List();
        this.rand = new Rand();
        this.cate = new Cate();

        this.menu.menu_event();
        this.list.option_event();
        this.cate.cate_event();

        this.menu.menu_update();
        this.list.menu_list_update();
    }

    MenuAllEvent(){
        document.querySelector("#menu_rand_set_btn").addEventListener("click",()=>{this.rand.make_rand_list()});
        document.querySelector("#menu_list_option_icon").addEventListener("click",()=>{this.list.option_tap()});
    }

}

window.addEventListener("load",()=>{
    let menu_control = new MenuControl();
});