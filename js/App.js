class App{
    constructor(){
        this.event();
        
        this.menu = new Menu();
        this.system = new System();

        this.menu.MenuEvent();
        this.menu.MenuUpdate();
    }

    event(){
        
    }

}

window.addEventListener("load",()=>{
    let app = new App();
});