class System{
    // Popup

    popup_close(){
        let popup = document.querySelector("#popup");

        document.querySelector("#popup_box").style.top = "-120%";
        document.querySelector("#popup_background").style.opacity = "0";
        setTimeout(()=>{
            if(document.querySelector("#popup")) document.querySelector("#wrap").removeChild(popup);
            if(document.querySelector("#popup_background")) document.querySelector("#wrap").removeChild(document.querySelector("#popup_background"));
        },600);

        
    }

    popup_open(title,content,footer){
        let cover = document.createElement("div");
        cover.innerHTML=`<div id="popup" class="popup_close">
                            <div id="popup_box">
                            <button id="popup_close_cross"><i class="fas fa-times"></i></button>
                                <div id="popup_box_title">
                                    <h2>${title}</h2>
                                </div>
                                <div id="popup_content">
                                    ${content}
                                </div>
                                <div id="popup_button_box">
                                    ${footer}
                                    <button class="popup_close_btn popup_button">닫기</button>
                                </div>
                            </div>
                        </div>
                        <div id="popup_background"></div>`;

        document.querySelector("#wrap").appendChild(cover.firstChild);
        document.querySelector("#wrap").appendChild(cover.lastChild);

        document.querySelector("#popup_background").addEventListener("click",()=>{this.popup_close();});
        document.querySelector(".popup_close_btn").addEventListener("click",()=>{this.popup_close();});
        document.querySelector("#popup_close_cross").addEventListener("click",()=>{this.popup_close();});

        setTimeout(()=>{document.querySelector("#popup").classList.add("open")},100);
    }

    // toast

    make_toast(msg){
        if(document.querySelector("#toast")) document.querySelector("#wrap").removeChild(document.querySelector("#toast"));
        let dom = document.createElement("div");
        dom.innerHTML = `<div id="toast">${msg}</div>`;
        document.querySelector("#wrap").appendChild(dom.firstChild);

        setTimeout(()=>{
            if(document.querySelector("#toast")) document.querySelector("#toast").classList.add("close");
            setTimeout(()=>{
                if(document.querySelector("#toast")) document.querySelector("#wrap").removeChild(document.querySelector("#toast"));
            },400);
        },700);
    }

    make_alert(title,content,type){
        let dom = document.createElement("div");
        dom.innerHTML = `<div id="system_alert_area">
                            <div id="system_alert" class="${type}">
                                <p><span id="alert-title">${title}</span> <span id="alert-content">${content}</span></p>
                                <button id="alert-close-btn" class="alert-close"><i class="fas fa-times alert-close"></i></button>
                            </div>
                        </div>`;
        dom.querySelector(".alert-close").addEventListener("click",this.close_alert);
        document.querySelector("#wrap").appendChild(dom.firstChild);
        document.querySelector("#content").style.paddingTop = "50px";
        setTimeout(()=>{
            document.querySelector("#system_alert_area").classList.add("open");
        },10);
    }

    close_alert(){
        document.querySelector("#system_alert_area").classList.remove("open");
        setTimeout(()=>{
            document.querySelector("#content").style.paddingTop = "20px";
            document.querySelector("#wrap").removeChild(document.querySelector("#system_alert_area"));
        },300);
    }
}