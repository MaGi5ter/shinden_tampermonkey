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

let tabledata = document.querySelectorAll('.table-responsive tr')

//console.log(tabledata)
//console.log(tabledata[2])

let palyersID = await getIDS()

let list = document.getElementById('player-block')


//console.log(newTablebody.innerHTML)

//getPlayerLInk(palyersID[0][2])

for (let el of document.querySelectorAll('.fansub-ad-info')) el.innerHTML = '';
for (let el of document.querySelectorAll('.error')) el.innerHTML = '';

for (let i = 0; i < palyersID.length; i++) {

    getPlayerLInk(palyersID[i][2],i)
    await sleep(2500)
}

async function getPlayerLInk(id,i) {

    console.log(id)

    let playerlink = ''

    let sleeptime = await fetchLink(`xhr/${id}/player_load?auth=${_Storage.basic}`) * 1000 

    console.log(sleeptime)
    await sleep(sleeptime)

    let playerdata = await fetchLink(`xhr/${id}/player_show?auth=${_Storage.basic}`)

    playerlink = playerdata.split('\n')

    //console.log(player_data[1]) //LINK
    let link = playerlink[1].split(' ')

    link.forEach(element => {
        if(element.includes('src')) {
            link = element
        }
    });

    link = await link.replace('src="',"")
    link = await link.replace('"',"")

    playerlink[3] = playerlink[3].replace('<input type="hidden" name="json" value="','')
    playerlink[3] = playerlink[3].replace('"','')
    playerlink[3] = playerlink[3].replace(/&quot;/g,'"')
    playerlink[3] = playerlink[3].replace(/&lt;/g,'<')
    playerlink[3] = playerlink[3].replace(/&gt;/g,'>')
    playerlink[3] = playerlink[3].replace(' />',"")

    playerlink[3] = JSON.parse(playerlink[3])    
    
    console.log(link)
    // console.log(playerlink[3])

    console.log(tabledata[i+1].querySelector('.ep-buttons').innerHTML )
    tabledata[i+1].querySelector('.ep-buttons').innerHTML = `${tabledata[i+1].querySelector('.ep-buttons').innerHTML}<a href="${link}" target="blank" class="button">OTWÓRZ LINK </a>`

    //newTablebody.innerHTML = `${newTablebody.innerHTML} ${tabledata[i+1].outerHTML}`


    // let odcinki = document.getElementById('odcinki_skrypt')

    // odcinki.innerHTML = `${odcinki.innerHTML} ${playerlink[1]}`

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

    console.log(data)
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