// ==UserScript==
// @name         Orange Price
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/trade.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com

// ==/UserScript==

async function getPrice(){
    
    //-2 for row, -1 for col
    var it={'Sheep Plushie': [2, 2],
            'Teddy Bear Plushie': [3, 2],
            'Kitten Plushie': [4, 2],
            'Jaguar Plushie': [5, 2],
            'Wolverine Plushie': [6, 2],
            'Nessie Plushie': [7, 2],
            'Red Fox Plushie': [8, 2],
            'Monkey Plushie': [9, 2],
            'Chamois Plushie': [10, 2],
            'Panda Plushie': [11, 2],
            'Lion Plushie': [12, 2],
            'Camel Plushie': [13, 2],
            'Stingray Plushie': [14, 2],
            'Dahlia': [2, 5],
            'Crocus': [3, 5],
            'Orchid': [4, 5],
            'Heather': [5, 5],
            'Ceibo Flower': [6, 5],
            'Edelweiss': [7, 5],
            'Peony': [8, 5],
            'Cherry Blossom': [9, 5],
            'African Violet': [10, 5],
            'Tribulus Omanense': [11, 5],
            'Banana Orchid': [12, 5],
            'Bottle of Beer': [18, 2],
            'Erotic DVD': [19,2],
            'Can of Munster': [5,8],
            'Can of Red Cow': [6,8],
            'Can of Taurine Elite': [7,8],
            'Can of Santa Shooters': [8,8],
            'Can of Rockstar Rudolph': [9,8],
            'Can of X-MASS': [10,8],
            'Can of Goose Juice': [11,8],
            'Can of Damp Valley': [12,8],
            'Can of Crocozade': [13,8],
            'Xanax': [22,2],
            'Feathery Hotel Coupon': [20,2],
            'Drug Pack': [17,8]};

    const dat = document.getElementsByClassName("name left");

    /*
    var data;
    const url = 'https://docs.google.com/spreadsheets/d/1j8VdDWI0fMMtZQLPNWtLNznGwtM7YMfjwh6Tonh09ew/gviz/tq?';
    await fetch(url)
    .then(res => res.text())
    .then(rep =>{
        data = JSON.parse(rep.substr(47).slice(0,-2));
        console.log(data);

    })
    */
    //test
   const url = 'https://docs.google.com/spreadsheets/d/1j8VdDWI0fMMtZQLPNWtLNznGwtM7YMfjwh6Tonh09ew/gviz/tq?';
    var data;
     GM_xmlhttpRequest ( {
    method:     'GET',
    url:        url,
    onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...

                    data = JSON.parse(responseDetails.responseText.substring(47).slice(0,-2))

console.log(data);
                }
} );
    //endtest
    var sum = 0;
    var notFound = [];
    var order = "";
    for (let i = 3;i < dat.length; i++){

        var vals = dat[i].firstChild.textContent.trim('\n').split(' ');
        if (vals == ""){
        continue;}
        var num = vals[vals.length-1].substring(1);
        var name = vals.slice(0,-1).join(' ');
        var forname =name + " ".repeat(25 - name.length);
       // alert(name);
       // alert(num);
        if (name in it){
            let row = it[name][0]-2;
            let column = it[name][1]-1;
            var price = data.table.rows[row].c[column].v;
            let tot = price * num;
            let fortot ="$"+ tot.toLocaleString("en-US");
            fortot = " ".repeat(18 - fortot.length) + fortot;
            sum += tot;
            let forprice ="$" + price.toLocaleString("en-US");
            forprice = " ".repeat(15 - forprice.length) + forprice;
            let fornum = num.toLocaleString("en-US");
            fornum = " ".repeat(10 - fornum.length) + fornum;
            order += forname + fornum + " x "+forprice+fortot + "\n";
        }
        else{
            notFound.push(name);
        }

    }
    if (notFound.length > 0){
        let st = notFound.join("\n");
        alert(st);
    }
    // alert(sum);
    order += "-".repeat(71) + "\n";
    var forsum ="$" + sum.toLocaleString("en-US");
    forsum = " ".repeat(71 - forsum.length) + forsum;
    order += forsum;

    var urlPaste = "https://api.paste.ee/v1/pastes";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlPaste);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Auth-Token", "u5ZB1lQ31IMqWBcoI5m3XoNG7SKoz0UzoE6RkMzQ8");
    var response;
    var b;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
         console.log(xhr.status);
         response = xhr.responseText;
         b = JSON.parse(response);
          $('#finalAmount').html(sum);
    $('#linkPaste').html(b["link"]);


     }};
    let date = {"description":"ZTRADE",
                "sections":[{
                    "name":"ZTRADE x " + document.querySelector("#trade-container > div.trade-cont.m-top10 > div.user.right.tt-modified > div.title-black").innerText.split("\n")[0]
                    ,"syntax":"autodetect",
                    "contents":order
                }]
               };

    xhr.send(JSON.stringify(date));



    
}
function change(){

    $('#finalAmount').html('Changed');
}

function showBut(){
    if ($('#header-root').size() > 0 && $('#calculate').size() < 1){
        const button = `<div><button id="calculate" style="cursor: pointer;font-size: 24px;">Calculate</button>
                        <button id="finalAmount" style="cursor: pointer;font-size: 24px;"></button>
                        <button id="linkPaste" style="cursor: pointer;font-size: 24px;"></button></div>`;
        $('#header-root').append(button);
    //alert("done");
    $('#calculate').click(getPrice);
    $( "#finalAmount" ).click(function() {
  navigator.clipboard.writeText($("#finalAmount").text());
});
    $( "#linkPaste" ).click(function() {
  navigator.clipboard.writeText($("#linkPaste").text());
});

}
}


window.addEventListener("load", function(){
    // ....
     'use strict';
    showBut();

    
});

//$(document).ready(showBut());
//showBut();



