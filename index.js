
function ajax(baseurl, method,params ,callback) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHttp");
    }
    let str = '?appkey=zhangning_1590670295069';
    for (let key in params) {
        str+= '&' + key + '=' + params[key]
    }
    let url = baseurl +str
    xhr.open(method, url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            callback &&callback(data)
        }
    }
    xhr.send();
}

function getStudentList(){
    let allStudentList = [];
    ajax('http://open.duyiedu.com/api/student/findAll','get',params = {} ,function(res){
        allStudentList = res.data
        if(!allStudentList){
            allStudentList = [
                {
                    name:'张三',
                    id:111,
                    sex: 0,
                    birth: 1993,
                    sNo:11111,
                    phone:13155102144,
                    address:'人民街',
                    email:'444@qq.com'
                }
            ]
        }
    })
    return allStudentList;
}

function renderList(){
    let studentList = getStudentList();
   
    str = '';
    for (let i = 0; i < studentList.length; i++) {
        str += `<tr>
        <td>${studentList[i].name}</td>
        <td>${studentList[i].sex=== 0? '男':'女'}</td>
        <td>${new Date().getFullYear() - studentList[i].birth}</td>
        <td>${studentList[i].sNo}3</td>
        <td>${studentList[i].phone}</td>
        <td>${studentList[i].address}</td>
        <td>${studentList[i].email}</td>
        <td><button class='edit' data-id='${studentList[i].id}'>编辑</button><button class='delete' data-id='${studentList[i].id}'>删除</button></td>
    </tr>`   
    }
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = str;
}

renderList()
// 完成展开/隐藏功能

let domContent = document.querySelector('.open-close');
function openCloseClick() {
  let left = document.querySelector('.left');
  let right = document.querySelector('.right')
 if(left.clientWidth === 0){
     left.style.width = '30%'
     right.style.marginLeft = 113 + 'px'
 } 
}
EventUtil.bindEvent(domContent, 'click', openCloseClick);




// 给left添加左滑消失事件

let left = document.querySelector('.left')
function leftLeft() {
  left.style.width = 0;
  let right = document.querySelector('.right')
  right.style.marginLeft = 0

}
EventUtil.bindEvent(left, 'swipeleft', leftLeft);


// 完成菜单的点击功能
let menu = document.querySelector('.menu');
function getSbring(node){
    let parent = node.parentNode;
    let children = parent.children
    let result = [];
    for (let i = 0; i < children.length; i++) {
       if(children[i] != node)
        result.push(children[i])
    }
    return result
}
function menuClick(e){
    let target = e.target;
    if(target.tagName != 'DD'){
        return;
    }else{
        let sbring = getSbring(target);
        for (let i = 0; i < sbring.length; i++) {
            sbring[i].classList.remove('active');  
        }
        target.classList.add('active')

        let showDom = document.getElementById(target.dataset.id);
        let showSbring = getSbring(showDom);
        for (let i = 0; i < showSbring.length; i++) {
            showSbring[i].style.display = 'none';  
        }
        showDom.style.display = 'block'
    }
}
EventUtil.bindEvent(menu,'click',menuClick)
// 完成添加功能

function getFormData(form){
    let name = form.name.value;
    let sex = form.sex.value;
    let email = form.email.value;
    let sNo = form.sNo.value;
    let phone = form.phone.value;
    let address = form.addres.value;
    let birth = form.birth.value

    if(phone.length != 11){
        alert('手机格式不正确')
        return
    }
    else if(!name || !sex || !email || !sNo || !phone || ! address || !birth ){
        alert('信息不全')
        return
    }else{
        return {
            name,sex,email,sNo,phone,address,birth
        }
    }
}

let addBtn = document.querySelector('.add-btn');
let addform = document.querySelector('.form-add')
function addStudent(e){
    if(e.preventDefault){
        e.preventDefault();
        }else{
        window.event.returnValue == false;
        }
    let formdata = getFormData(addform)
    ajax('http://open.duyiedu.com/api/student/addStudent','get',formdata,function(res){
        alert(res.msg)
    })
    renderList()
}

EventUtil.bindEvent(addBtn,'click',addStudent)


// 编辑学生
    // 绑定编辑按钮事件
let tbody = document.getElementById('tbody');

let formEdit = document.getElementById('form-edit')
function operation(e){
    if(e.target.classList.contains('edit')){
        let id = e.target.dataset.id;
        let editDiv = document.querySelector('.edit-div')
        let curdata = getStudentList().filter(item=>{
           return item.id == id
        });
        formEdit.name.value = curdata[0].name;
        formEdit.sex.value = curdata[0].sex;
        formEdit.addres.value = curdata[0].address;
        formEdit.birth.value = curdata[0].birth;
        formEdit.email.value = curdata[0].email;
        formEdit.sNo.value = curdata[0].sNo;
        formEdit.phone.value = curdata[0].phone;
        editDiv.style.display ='block'
    }else if(e.target.classList.contains('delete')){
        let id = e.target.dataset.id;
        let editDiv = document.querySelector('.edit-div')
        let curdata = getStudentList().filter(item=>{
           return item.id == id
        });
        ajax('http://open.duyiedu.com/api/student/delBySno','get',{sNo:curdata.sNo},function(res){
            alert(res.msg)
        })
        renderList()
    }else{
        return
    }
}
EventUtil.bindEvent(tbody,'click',operation)

// 修改学生表单的确定按钮

let editSureBtn = document.querySelector('.edit-sure-btn');
function editSure(e){
    if(e.preventDefault){
        e.preventDefault();
        }else{
        window.event.returnValue == false;
        }
    let editData = {
        name: formEdit.name.value,
        address: formEdit.addres.value,
        phone: formEdit.phone.value,
        sex: formEdit.sex.value,
        birth: formEdit.birth.value,
        sNo: formEdit.sNo.value,
        email: formEdit.email.value
    }
    console.log(editData)
    ajax('http://open.duyiedu.com/api/student/updateStudent','get',editData,function(res){
        alert(res.msg)
    })
    let editDiv = document.querySelector('.edit-div')
    renderList()
    editDiv.style.display = 'none'

}

EventUtil.bindEvent(editSureBtn,'click',editSure)

let editCancelBtn = document.querySelector('.edit-cancel-btn')
function editCancel(e){
    if(e.preventDefault){
        e.preventDefault();
        }else{
        window.event.returnValue == false;
        }
    let editDiv = document.querySelector('.edit-div')
    editDiv.style.display = 'none'
}

EventUtil.bindEvent(editCancelBtn,'click',editCancel)
//绑定两次左滑事件

// EventUtil.bindEvent(domContent, 'swipeleft', handleLeft);
// //绑定右滑事件
// EventUtil.bindEvent(domContent, 'swiperight', handleRight);
// //上滑事件
// EventUtil.bindEvent(domContent, 'slideup', handleUp);
// //下滑事件
// EventUtil.bindEvent(domContent, 'slidedown', handleDown);
// //长按点击事件
// EventUtil.bindEvent(domContent, 'longpress', handleLong);

