const state=[]; //{id:Date.now(), title:..., content:[false,...], situation:..., edit:false, done:false}
const list=document.getElementById("list");
function render(){
    console.log(state.length);
    if(state.length===0){
        list.textContent="暫無待辦事項 😙🎵";
        return;
    };
    list.textContent='';
    state.forEach((value)=>{
        const item=document.createElement("li");
        item.setAttribute("data-id",`${value.id}`);
        const editItem=document.createElement("form");
        const frag=document.createDocumentFragment();
        const title=document.createElement("input");
        if(!value.edit){
            title.setAttribute("disabled",true)
        }
        title.classList.add("title");
        title.classList.add((value.done?"done":"yet"));
        title.value=value.title;
        if(value.situation==='emergency'){
            title.classList.add("emergency");
        }else if(value.situation==='normal'){
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
        done.textContent=(value.done?"↩️":"✅");

        const edit=document.createElement("span");
        edit.classList.add((value.edit?"save":"edit"));

        edit.textContent=(value.edit?"🆗":"✏️");

        const del=document.createElement("span");
        del.classList.add("del");
        del.textContent="❌";

        smallFrag.appendChild(done);
        smallFrag.appendChild(edit);
        smallFrag.appendChild(del);
        
        operate.appendChild(smallFrag);
        frag.appendChild(operate);
        //若有說明
        if(value.content[1]){
            const content=document.createElement("textarea");
            content.classList.add("content");
            content.style.display=(value.content[0]?"block":"none");
            if(!value.edit){
                content.setAttribute("disabled",true)
            }
            content.value=value.content[1];
            frag.appendChild(content);
            const open=document.createElement("div");
            open.classList.add("btn");
            open.classList.add("fold");
            open.textContent=(value.content[0]?"CLOSE":"OPEN");
            frag.appendChild(open);
        }
        editItem.appendChild(frag);
        item.appendChild(editItem);
        list.appendChild(item);
    });
};
//表單驗證
document.getElementById("backlog").addEventListener("submit",function(e){
    e.preventDefault();
    if(document.getElementById("toDo").value.trim()===''){
        document.querySelector("#toDo~.warning").textContent="待辦事項不可為空!";
        return;
    }else{
        document.querySelector("#backlog #toDo~span").textContent="";
    }
    if(document.querySelector("input[name=state]:checked")==null){
        document.querySelector("#relax~.warning").textContent="事項狀態不可為空!";
        return;
    }else{
        document.querySelector("#relax~.warning").textContent="";
    }
    //清空報錯消息
    document.querySelectorAll(".warning").forEach((value)=>{value.textContent=''});
    state.push({
        id:String(Date.now()), 
        title:document.getElementById("toDo").value, 
        content:[false,document.getElementById("detail").value.trim()],
        situation:document.querySelector("input[name=state]:checked").value,
        edit:false,
        done:false 
    })
    render();
    this.reset();
});
//處理內部點擊事件(事件代理)
list.addEventListener("click",function(e){
    const target=e.target.closest("li").dataset.id;
    const order=state.findIndex((val)=>{return val.id===target;});
    //完成
    if(e.target.classList.contains("done")){
        state[order].done=!state[order].done;
        render();
    };
    //編輯按鈕
    if(e.target.classList.contains("edit")){
        state[order].edit=!state[order].edit;
        render();
        document.querySelector(`li[data-id="${target}"] .title`).focus();
    }else if(e.target.classList.contains("save")){
        //儲存編輯
        state[order].edit=!state[order].edit;
        const editOne=e.target.closest("li");
        state[order].title=editOne.querySelector(".title").value;
        if(state[order].content[1]){
            state[order].content[1]=editOne.querySelector(".content").value;
        }
        render();
    };
    //刪除按鈕
    if(e.target.classList.contains("del")){
        state.splice(order,1);
        render();
    };
    //展開收起
    if(e.target.classList.contains("fold")){
        state[order].content[0]=!state[order].content[0];
        render();
    }
    
});
document.addEventListener("DOMContentLoaded",()=>{
    render();
});
