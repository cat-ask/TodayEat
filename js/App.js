class App{
    constructor(){
        this.setEvent();
    }

    setEvent(){
        document.querySelector(".side").addEventListener("click",()=>{
            document.querySelector("#side").classList.add("open");
        });

        window.addEventListener("click",(e)=>{
            if(document.querySelector("#side").classList.contains("open") && !e.target.classList.contains("side")) document.querySelector("#side").classList.remove("open");
        });
        
    }
}

window.addEventListener("load",()=>{
    let app = new App();
})