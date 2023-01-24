// ==UserScript==
// @name         New Userscript
// @include      /^https?://shinden.pl/*/
// @version      0.1
// @author       MaGi5ter
// @match        https://www.tampermonkey.net/index.php?version=4.16.6160&ext=mfdh&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_webRequest
// ==/UserScript==

console.log(window.location.href)

console.log("GM_webRequest start");

var currently_active_webrequest_rule = JSON.stringify(GM_info.script.webRequest); // == @webRequst header from above

GM_webRequest([
    { selector: { include: '*', exclude: '*shinden.pl/*' }, action: 'cancel' },
], function(info, message, details) {
    console.log(info, message, details);
});

if(window.location.href.includes('episode') || window.location.href.includes('epek') ) {} else return


let palyersID = await getIDS()

let list = document.getElementById('player-block')

list.innerHTML = '<h1> ODCINKI ZE SKRYPTU</h1> <div id="odcinki_skrypt" > </div>'

getPlayerLInk(palyersID[0][2])

for (let i = 0; i < 7; i++) {
    if(palyersID[i][0] == 'sibnet') continue
    if(palyersID[i][0] == 'Vk') continue
    if(palyersID[i][0] == 'Streamsb') continue
    if(palyersID[i][0] == 'Myvitv') continue
    if(palyersID[i][0] == 'Hqq') continue
    if(palyersID[i][0] == 'Yourupload') continue
    if(palyersID[i][0] == 'Dood') continue

    getPlayerLInk(palyersID[i][2])
    await sleep(500)
}

async function getPlayerLInk(id) {

    console.log(id)

    let playerlink = ''

    let sleeptime = await fetchLink(`xhr/${id}/player_load?auth=${_Storage.basic}`) * 1000

    await sleep(sleeptime)

    let playerdata = await fetchLink(`xhr/${id}/player_show?auth=${_Storage.basic}`)

    playerlink = playerdata.split('\n')

    let odcinki = document.getElementById('odcinki_skrypt')

    odcinki.innerHTML = `${odcinki.innerHTML} ${playerlink[1]}`

}

async function getIDS(){
   let list = await document.querySelector('.table-responsive').innerHTML
   list = list.split('\n')

    let data = []
    let start = []
    let end = []

    for (let index = 0; index < list.length; index++) {
        if(list[index].includes('<tr>')) start.push(index)
        else if(list[index].includes('</tr>')) end.push(index)
    }

    for (let index = 1; index < start.length; index++) { //index 1 bcs first tr contains table names

        let hosting = await list[start[index]+1].split('>') ; hosting = hosting[1] ;hosting = await hosting.replace('</td','')
        let res = await list[start[index]+2].replace('<td class="ep-pl-res"><span title="','') ;res = await res.split("<") ; res = res[1] ; res = await res.replace(`/span>`,"")
        let player = await list[end[index]-1].split('"',6); player = player[5];player = player.replace('player_data_','')

        data.push([hosting,res,player])
    }

   return data
}

function fetchLink(url) {
    return new Promise((resolve,reject) => {
    $.ajax({
        type: "GET",
        url: `https://api4.shinden.pl/${url}`,
        success: function (result) {
          resolve(result)
        },
      });
})
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}