const item=[]; //[{id, name, price, num},]
const warning={name:"品名不可為空",price:"價格不可為空"};
const create=document.getElementById("create");
//新增品項
create.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=test("name");
    const price=test("price");
    if(!name["full"]){
        return;
    }else if(!price["full"]){
        return;
    }else{
        item.push({"id":String(Date.now()),"name":name["value"],"price":price["value"],"num":0});
    };
    render(0);
});
//表單驗證
function test(id){
    const input=document.getElementById(id).value.trim();
    const warningText=`#${id}+.warning`;
    if(!input){
        document.querySelector(warningText).textContent=warning[id];
        return {"full":false,"value":""};
    }else{
        document.querySelector(warningText).textContent="";
        return {"full":true,"value":input};;
    }
    
};
function render(target=0){
    const itemShow=document.getElementById("itemShow");
    const totalShow=document.getElementById("totalShow");
    if(item.length===0){
        return;
    }else{
        for(let x of document.querySelectorAll(".noItem")){
            x.classList.toggle("hide",item.length!==0)
        }
    }
    //新增或調整
    if(target===0){
        const sum=document.getElementById("sum");
        itemShow.appendChild(createItemInfo(item[(item.length-1)],"item"));
        if(sum!=null){
            totalShow.insertBefore(createItemInfo(item[(item.length-1)],"total"),sum);
        }else{
            totalShow.appendChild(createItemInfo(item[(item.length-1)],"total"));
        }
        create.reset();
    }else if(target<0){
        itemShow.querySelectorAll(".calculate")[(target*-1)-1].remove();
        totalShow.querySelectorAll(".detail")[(target*-1)-1].remove();
        item.splice(((target*-1)-1),1);
    }else{
        itemShow.replaceChild(createItemInfo(item[(target-1)],"item"),itemShow.querySelectorAll(".calculate")[(target-1)]);
        totalShow.replaceChild(createItemInfo(item[(target-1)],"total"),totalShow.querySelectorAll(".detail")[(target-1)]);
    }
    totalPrice();
};
//建立按鈕(複製+填寫<temolate>)
function createItemInfo(info,place){
    const itemInfo=document.getElementById(`${place}Template`).content.cloneNode(true); //深拷貝:複製完整子樹
    itemInfo.querySelector("*").setAttribute("data-id",info.id);
    itemInfo.querySelector(`.${place}Name`).textContent=info.name;
    itemInfo.querySelector(`.${place}Price`).textContent=(place==="item"?`$ ${info.price}`:`$ ${info.price*info.num}`);
    if(place==="item"){itemInfo.querySelector(".num").textContent=info.num;};
    return itemInfo;
};
function totalPrice(){
    let exist,total;
    if(document.getElementById("sum")!=null){
        exist=true;
        total=document.getElementById("sum");
    }else{
        exist=false;
        total=document.createElement("div");
        total.setAttribute("id","sum");
    }
    console.log(exist);
    if(item.length===0){
        total.textContent="$0";
    }else{
        let sum=0;
        item.forEach((val)=>{
            sum+=val.price*val.num;
        })
        total.textContent=`$${sum}`;
    }
    if(!exist){document.getElementById("totalShow").appendChild(total);}
}
//按鈕點擊事件
document.getElementById("itemShow").addEventListener("click",(e)=>{
    const target=e.target.closest(".calculate");
    const id=target.dataset.id;
    const num=target.querySelector(".num");
    const index=item.findIndex((val)=>{return val.id==id;});
    console.log(id);
    if(e.target.classList.contains("plus")){
        item[index].num=Number(num.textContent)+1;
    }else if(e.target.classList.contains("minus")&&Number(num.textContent)>0){
        item[index].num=Number(num.textContent)-1;
    }else if(e.target.classList.contains("resetBtn")){
        item[index].num=0;
    }else if(e.target.classList.contains("delBtn")){
        render(-1*(index+1));
        return;
    }
    render((index+1));
});
render();
