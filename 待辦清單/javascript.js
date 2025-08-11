const list=document.getElementById("list");
if(list.childElementCount===0){
    list.textContent="暫無待辦事項";
};
//表單驗證
document.getElementById("backlog").addEventListener("submit",function(e){
    e.preventDefault();
    if(document.getElementById("toDo").value.trim()===''){
        document.querySelector("#backlog #toDo~span").textContent="待辦事項不可為空!";
    }else{
        document.querySelector("#backlog #toDo~span").textContent="";
    }
    if(document.querySelector("input[name=state]:checked")==null){
        document.querySelector("#relax~span").textContent="事項狀態不可為空!";
    }else{
        //清空報錯消息
        document.querySelectorAll("#backlog span").forEach(function(value){value.textContent=''});
        const item=document.createElement("li");
        const editItem=document.createElement("form");
        const frag=document.createDocumentFragment();
        const title=document.createElement("input");
        title.setAttribute("disabled","true");
        title.classList.add("title");
        title.classList.add("yet");
        title.value=document.getElementById("toDo").value;
        if(document.querySelector("input[name=state]:checked").value==='emergency'){
            title.classList.add("emergency");
        }else if(document.querySelector("input[name=state]:checked").value==='normal'){
            title.classList.add("normal");
        }else{
            title.classList.add("relax");
        }
        frag.appendChild(title);
        //編輯按鈕組
        const smallFrag=document.createDocumentFragment();
        const operate=document.createElement("span");
        operate.setAttribute("class","btnGroup");
        const done=document.createElement("span");
        done.classList.add("done");
        done.textContent="✅";

        const edit=document.createElement("span");
        edit.classList.add("edit");
        edit.textContent="✏️";

        const del=document.createElement("span");
        del.classList.add("del");
        del.textContent="❌";

        smallFrag.appendChild(done);
        smallFrag.appendChild(edit);
        smallFrag.appendChild(del);
        
        operate.appendChild(smallFrag);
        frag.appendChild(operate);
        //若有說明
        if(document.getElementById("detail").value.trim()!==''){
            const content=document.createElement("textarea");
            content.style.display="none";
            content.setAttribute("disabled","true");
            content.value=document.getElementById("detail").value.trim();
            frag.appendChild(content);
            const open=document.createElement("div");
            open.classList.add("btn");
            open.classList.add("open");
            open.textContent="OPEN";
            frag.appendChild(open);
        }
        if(list.textContent==='暫無待辦事項'){
            list.textContent='';
        }
        editItem.appendChild(frag);
        item.appendChild(editItem);
        list.appendChild(item);
        this.reset();
    }
});
//處理內部點擊事件(事件代理)
list.addEventListener("click",function(e){
    const target=e.target;
    //完成
    if(target.classList.contains("done")){  
        target.textContent="↩️";
        const dad=target.closest("li");
        const title=dad.querySelector(".title");
        if(title.classList.contains("yet")){
            title.classList.replace("yet","done");
        }else{
            title.classList.replace("done","yet");
        };
        
    };
    //編輯按鈕
    if(target.classList.contains("edit")){
        target.textContent="🆗";
        const dad=target.closest("li");
        dad.querySelectorAll("input,textarea").forEach(function(value){
            value.removeAttribute("disabled");
        })
        dad.querySelector(".title").focus();
        target.classList.replace("edit","save");
    }else if(target.classList.contains("save")){
        //儲存編輯
        target.textContent="✏️";
        const dad=target.closest("li");
        dad.querySelectorAll("input,textarea").forEach(function(value){
            value.setAttribute("disabled","true");
        })
        target.classList.replace("save","edit");
    };
    //刪除按鈕
    if(target.classList.contains("del")){
        target.closest("li").remove();
        if(list.childElementCount===0){
            list.textContent="暫無待辦事項";
        };
    };
    //展開收起
    if(target.classList.contains("open")){
        target.textContent="CLOSE";
        target.classList.replace("open","close");
        const dad=target.closest("li");
        dad.querySelector("textarea").style.display="block";
    }else if(target.classList.contains("close")){
        target.textContent="OPEN";
        target.classList.replace("close","open");
        const dad=target.closest("li");
        dad.querySelector("textarea").style.display="none";
    }
});