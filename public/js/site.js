
let AuthToken= ""

fetch('/site/list').then((resp) => { console.log(resp); return resp.json() })
    .then((data) => {
        console.log(data);
        let CB_Sites = document.getElementById('CB_SiteList');
        let SitesL = data.map((obj) => `<option value="${obj['Site']}" >${obj['Site']}</option> `);
        let htmlStr = SitesL.reduce((agg, item) => agg += item);
        CB_Sites.innerHTML = htmlStr;
        CB_Sites.addEventListener("change", gather_Site_data);
        gather_Site_data();
    });

function gather_Site_data() {
    let CB_Sites = document.getElementById('CB_SiteList');
    console.log("fetch Site ALL for ", CB_Sites.value)
    Fetch_Site_Info();
    Fetch_Site_prodLines();
    Fetch_Site_incidents();

}


function Fetch_Site_Info() {
    let CB_Sites = document.getElementById('CB_SiteList');
    console.log("fetch Site_Info for ", CB_Sites.value)
    fetch('/site/info?Site=' + CB_Sites.value)
        .then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            console.log(data);
            document.getElementById('Site_Country').innerText = data[0]['Country'];
            document.getElementById('Site_City').innerText = data[0]['City'];
            document.getElementById('Site_Street').innerText = data[0]['Street'];
            document.getElementById('Site_Size').innerText = "not yet available";
            document.getElementById('Line_site_header').innerText = data[0]['City'];
            //document.getElementById('TheImage').remove()
            // let TheImage = document.createElement('img')
            // TheImage.src = "https://picsum.photos/200/300?random=" + 
            // (Math.floor(Math.random() * (20 - 1) + 1 ))
            // TheImage.id = "TheImage"
            // document.getElementById('imgsite').appendChild(TheImage)
            document.getElementById('TheImage').src = "https://picsum.photos/300/200?random=" + 
            (Math.floor(Math.random() * (20 - 1) + 1 ))


        });
}



function Fetch_Site_prodLines() {
    let CB_Sites = document.getElementById('CB_SiteList');
    console.log("fetch prodLines for ", CB_Sites.value)
    fetch('/site/info_lignes?Site=' + CB_Sites.value).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            //console.log(data);
            let tb_SiteLigne = document.getElementById('sitelinetable');
            //header
            //console.log('obj data:', data)
            //console.log('obj data 0 :', data[0])
            console.log('obj data key :', Object.keys(data[0]))
            //let Headers = data[0].keys()
            let Headers = Object.keys(data[0])
            console.log(Headers)
            let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
            htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
            //rows
            let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
            SitesL = `<tbody>${SitesL}</tbody>`
            tb_SiteLigne.innerHTML = htmlStrH + SitesL;
            //tb_SiteLigne.appendChild(sTable)
        });
}

function Fetch_Site_incidents() {
    let CB_Sites = document.getElementById('CB_SiteList');
    console.log("fetch incident for ", CB_Sites.value)
    fetch('/site/incidents?Site=' + CB_Sites.value)
        .then((resp) => {
            response = resp
            console.log('response.headers.NbResults =', response.headers.get('NbResults'));
            //console.log(resp)
            if (resp.status === 403) {
                let tb_SiteLigne = document.getElementById('LigneIncidentsTable');
                tb_SiteLigne.innerHTML = '<p style="color:red;">you are not allowed to access this data</p>';
            } else {
                return resp.json()
            }
        })
        .then((data) => {
            console.log('Fetch_Site_incidents data:',data);
            let tb_SiteLigne = document.getElementById('LigneIncidentsTable');
            if (response.headers.get('NbResults') === "0") {
                tb_SiteLigne.innerHTML = '<p style="color:green;">No incident reported</p>';
            } else {
                //header
                //console.log('obj data:', data)
                //console.log('obj data 0 :', data[0])
                //console.log('obj data key :', Object.keys(data[0]))
                //let Headers = data[0].keys()
                let Headers = Object.keys(data[0])
                console.log(Headers)
                let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
                htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
                //rows
                let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
                SitesL = `<tbody>${SitesL}</tbody>`
                tb_SiteLigne.innerHTML = htmlStrH + SitesL;
                //tb_SiteLigne.appendChild(sTable)
            }
        });
}

function obj_val_to_cell_table(js_obj) {
    let Headers = Object.keys(js_obj)
    let tr_string = ""
    for (let i = 0; i < Headers.length; i += 1) {
        tr_string = tr_string + `<td>${js_obj[Headers[i]]}</td>`
    }
    return `<tr>${tr_string}<tr>`
}

function DisplayLoginform() {
    console.log("DisplyLoginform: Event")
    let loginform = document.getElementById('loginInput')
    if (loginform.style.display = "none") { loginform.style.display = "block" }
    else { loginform.style.display = "none" }


}
function LoginOperation() {
    console.log("LoginOperation: Event")
    if (document.getElementById('RB_login').checked) {
        let pwconf = document.getElementsByClassName('PWconfirm');
        console.log(pwconf);
        for (let it of pwconf) {
            it.style.visibility = 'hidden';
        }
    } else {
        let pwconf = document.getElementsByClassName('PWconfirm')
        console.log(typeof (pwconf))
        console.log(pwconf)
        for (let it of pwconf) {
            it.style.visibility = 'visible';
        }
    }
}
function LoginSendCC(){

    //let qPath = document.getElementByName('RB_login').value
    
    //let RB_Login = document.getElementsByName('RB_login')
    let RB_Login = Array.from(document.getElementsByName('RB_login')).find((radio) => radio.checked).value;
    
    console.log(RB_Login)
    console.log(document.getElementById('tb_userID').value)
    console.log(document.getElementById('tb_passwd').value)

    let qPath = RB_Login
    let tb_userID = document.getElementById('tb_userID').value
    let tb_passwd = document.getElementById('tb_passwd').value
    if (! RB_Login){return;}
    let qoptions = 
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ 'FirstName': tb_userID, 'Auth': tb_passwd })
    }
    fetch(qPath, qoptions) 
    .then((response) => {
        if (!response.ok){
            alert(response.statusText )
        }else{
            response.json()
        }})
    .then((data) => {
        console.log("login token:",data);
        
        this.AuthToken = data.AuthToken
        })
}

function New_prodLines(){
    let Site = document.getElementById('CB_SiteList').value;
    let NoLigne = document.getElementById('Line_site_header').innerText + document.getElementById('TB_lineID').value
    let Volume = document.getElementById('TB_Volume').value

    
    let qoptions = 
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': this.AuthToken
        },
        method: "POST",
        body: JSON.stringify({ 'Site': Site, 'NoLigne': NoLigne, 'Volume': Number(Volume) })
    }
    fetch('/New_Line', qoptions) 
    .then((response) => {
        if (!(response.ok)){
            alert(response.statusText )
        }else{
            response.json()
            Fetch_Site_prodLines()
        }})
    .then((data) => {
        console.log('New Line (json) data (should be empty) : ', data);
        
        this.AuthToken = data.AuthToken
        })


}




document.getElementById('loginInput').addEventListener('click', DisplayLoginform);
document.getElementById('LoginOperation').addEventListener('click', LoginOperation);
document.getElementById('BT_login_send').addEventListener('click', LoginSendCC);
document.getElementById('BT_ADDline').addEventListener('click', New_prodLines);

// document.getElementById('RB_ChPass').addEventListener('click',RB_ChPass);
 //document.getElementById('New_User').addEventListener('click',New_User);





