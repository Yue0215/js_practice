
const commentForm= document.getElementById("comment");
const user= document.getElementById("name");
const mail= document.getElementById("mail");
const content= document.getElementById("content");
const table=document.getElementById("displayTable");
const display=document.getElementById("display");
const processURL='https://jsonplaceholder.typicode.com/posts'; //後端(模擬)

//表單驗證
user.addEventListener("change",function(){
    if(this.value.trim()==''){
        this.setCustomValidity("姓名為必填");
    }else{
        this.setCustomValidity("");
    }
    this.reportValidity();
});
mail.addEventListener("change",function(){
    if(this.validity.typeMismatch){
        this.setCustomValidity("請輸入正確的電子郵件格式");
    }else{
        this.setCustomValidity("");
    }
    this.reportValidity();
});
content.addEventListener("change",function(){
    if(this.value.trim()==''){
        this.setCustomValidity("意見內容不可為空");
    }else if((this.value.trim()).length<20 ){
        this.setCustomValidity("內容須至少20字");
    }else{
        this.setCustomValidity("");
    }
    this.reportValidity();
});
commentForm.addEventListener("input",function(e){ //檢查各欄位必填
    if(this.checkValidity()){
        document.getElementById("submit").removeAttribute("disabled");
    }else{
        document.getElementById("submit").setAttribute("disabled",true);
    }
});
//送出回饋到後端(模擬)+儲存紀錄
async function sendData(url,dataInJSON){
    try{
        const response= await fetch(processURL,{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: dataInJSON
        });
        if(response.ok){
            Swal.fire({
                title:"回饋送出成功",
                text:"感謝您的回饋!",
                type:"success"
            });
            commentForm.reset();
            for(const item of commentForm.querySelectorAll("input,textarea")){
                item.removeAttribute("disabled");
            };
        }else{
            throw new Error(`網路層錯誤: ${response.status}`);
        }
    }catch(error){
        Swal.fire({
            title:"回饋送出失敗",
            text:error,
            type:"error"
        });
    }
    let log=[];
    if(localStorage.getItem("log")===null){ //無過去紀錄
        log.push(dataInJSON);
        localStorage.setItem("log",JSON.stringify(log));
    }else{
        log=log.concat(Array.from(JSON.parse(localStorage.getItem("log"))));
        log.push(dataInJSON);
        localStorage.setItem("log",JSON.stringify(log));
    }
}
//表單提交
commentForm.addEventListener("submit",function(e){
    e.preventDefault();
    const data= new FormData(this);
    const time= new Date();
    data.delete("mail"); //使用者端不紀錄maill資料
    data.append("time",`${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`);    
    const dataInJSON=JSON.stringify(Object.fromEntries(data.entries())); //將單筆回饋資料轉為JSON格式
    sendData(processURL,dataInJSON);
    for(const item of this.querySelectorAll("input,textarea")){
        item.setAttribute("disabled",true);
    };
    document.getElementById("displayTable").classList.toggle("hide",true);
    document.getElementById("submit").setAttribute("disabled",true);
});
//建立單筆紀錄
function createLog(info){
    data=JSON.parse(info);
    const item= document.getElementById("pastRecord").content.cloneNode(true);        
    item.querySelectorAll(".recordInfo")[0].textContent=data.time;
    item.querySelectorAll(".recordInfo")[1].textContent=data.name;
    item.querySelectorAll(".recordInfo")[2].textContent=data.content;
    display.appendChild(item);
}
//查看紀錄(JSON陣列)
document.getElementById("showPast").addEventListener("click",function(){
    if(table.classList.contains("hide")){
        this.textContent='回饋紀錄 ⏏️';
        table.classList.toggle("hide",false);
        if(localStorage.getItem("log")!=null){ //若有送出回饋紀錄
            if(display.querySelector(".noItem")!=null){ //若有"暫無資料"文字則清空
                display.innerHTML='';
            }
            if(display.innerHTML==''){ //若為第一次點擊
                JSON.parse(localStorage.getItem("log")).forEach((data)=>{
                    createLog(data);
                });
            }else{
                const last= display.querySelector(".record:last-child");
                const recordInfo= last.querySelectorAll(".recordInfo");
                const infoInJSON= JSON.stringify({name:recordInfo[1].textContent,content:recordInfo[2].textContent,time:recordInfo[0].textContent});
                const log=JSON.parse(localStorage.getItem("log"));
                log.slice(log.indexOf(infoInJSON)+1).forEach((data)=>{ //找到上次寫至html的紀錄，從下一個開始寫入(僅添加新增部分)
                    createLog(data);
                });
            }    
        }else{
            display.innerHTML='';
            const noItem= document.createElement("tr");
            const text= document.createElement("td");
            text.setAttribute("colspan","3");
            text.textContent= '暫無資料';
            text.classList.add("noItem");
            noItem.appendChild(text);
            display.appendChild(noItem);
        }
    }else{
        this.textContent='回饋紀錄 🔽';
        table.classList.toggle("hide",true);
    } 
});


