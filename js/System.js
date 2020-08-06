class System{
    // Popup

    popup_close(){
        let popup = document.querySelector("#Popup");

        document.querySelector("#PopupBox").style.top = "-120%";
        document.querySelector("#PopupBackground").style.opacity = "0";
        setTimeout(()=>{
            if(document.querySelector("#Popup")) document.querySelector("#wrap").removeChild(popup);
            if(document.querySelector("#PopupBackground")) document.querySelector("#wrap").removeChild(document.querySelector("#PopupBackground"));
        },600);

        
    }

    popup_open(title,content,footer){
        let cover = document.createElement("div");
        cover.innerHTML=`<div id="Popup" class="popup_close">
                            <div id="PopupBox">
                            <button id="PopupCloseCross"><i class="fas fa-times"></i></button>
                                <div id="PopupBoxTitle">
                                    <h2>${title}</h2>
                                </div>
                                <div id="PopupContent">
                                    ${content}
                                </div>
                                <div id="PopupButtonBox">
                                    ${footer}
                                    <button class="PopupCloseBtn PopupButton">닫기</button>
                                </div>
                            </div>
                        </div>
                        <div id="PopupBackground"></div>`;

        document.querySelector("#wrap").appendChild(cover.firstChild);
        document.querySelector("#wrap").appendChild(cover.lastChild);

        let width = document.querySelector("#PopupBox").getClientRects()[0].width;
        let vx = document.querySelector("html").getClientRects()[0].width;

        let left = vx/2 - width/2;
        document.querySelector("#PopupBox").style.left = left+"px";

        document.querySelector("#PopupBackground").addEventListener("click",()=>{this.popup_close();});
        document.querySelector(".PopupCloseBtn").addEventListener("click",()=>{this.popup_close();});
        document.querySelector("#PopupCloseCross").addEventListener("click",()=>{this.popup_close();});

        setTimeout(()=>{document.querySelector("#Popup").classList.add("open")},100);
    }

    // toast

    MakeToast(msg){
        if(document.querySelector("#Toast")) document.querySelector("#wrap").removeChild(document.querySelector("#Toast"));
        let dom = document.createElement("div");
        dom.innerHTML = `<div id="Toast">${msg}</div>`;
        document.querySelector("#wrap").appendChild(dom.firstChild);

        let width = document.querySelector("#Toast").getClientRects()[0].width;
        let vx = document.querySelector("html").getClientRects()[0].width;

        let left = vx/2 - width/2;
        document.querySelector("#Toast").style.left = left+"px";

        setTimeout(()=>{
            if(document.querySelector("#Toast")) document.querySelector("#Toast").classList.add("close");
            setTimeout(()=>{
                if(document.querySelector("#Toast")) document.querySelector("#wrap").removeChild(document.querySelector("#Toast"));
            },600);
        },800);
    }
}