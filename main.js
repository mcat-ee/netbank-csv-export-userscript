// ==UserScript==
// @name         Netbank Transaction CSV Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Export Commonwealth Bank user transactions to CSV format from the webpage
// @author       https://github.com/mcat-ee
// @match        https://www.commbank.com.au/retail/netbank/accounts/?account=*
// @icon         https://www.google.com/s2/favicons?domain=commbank.com.au
// @grant        none
// ==/UserScript==

/*
Notes:
    - All TX marked with classname "transaction-item"
    - Pending transactions ID: "pending-transactions-table"
    - All non-pending transactions (container ID): "non-pending-transactions-table"
        - Each day contained in tbody classname: "transactions-table"
        - Date nested within container with classname: "transactions-table__title"

*/

(function() {
    'use strict';

        const clickMoreTransactionsButtonPromise = () => {return new Promise((resolve, reject) => {
            var transactionsButton = document.getElementById("load-more-transactions-btn");
            if(transactionsButton == undefined){
                reject("Transaction button not initialised");;
            }
            console.log("Clicking transaction button");

            setTimeout(() => {
                transactionsButton.click()
                console.log("Clicked, waiting...");
                    setTimeout(() => {
                    resolve("success");
                }, 1000);
            }, 500);
        });
     };


    function expandTransactions() {
        console.log("Expanding transactions");
            return clickMoreTransactionsButtonPromise().then(()=> {
                return clickMoreTransactionsButtonPromise();
            }).then(() => {
                setTimeout(()=> {
                    console.log("Clicking menu button");
                    var exportMenuButton = document.getElementById("export-link");
                    exportMenuButton.click();
                    return;
                }, 1000);
            }).then(() => {
                console.log("About to select CSV export option");
                setTimeout(() => {
                    console.log("Clicking CSV option");
                    var probableCSVOption = document.getElementById("export-format-type-CSV");
                    probableCSVOption.click();
                },500);
            }).catch( err => {
                console.log("error occurred");
                console.log(err);
            });
    }


    function csvExportClick() {
        alert("Display modal");
        var modalElement = document.createElement("div");
        modalElement.style = "position:fixed;z-index:1;width:80%;height:80%;left:10%;top:10%;overflow:auto;background-color: rgba(255,255,255,0.99);"
        modalElement.innerHTML = "MMMMF";
        var bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.appendChild(modalElement);
    }


    window.addEventListener('load', function() {
        setTimeout(() => {
            var navBarList = document.getElementsByClassName("nav nav-tabs");
            if(navBarList.length>0) {
                var navBarElement = navBarList[0];
                var newNavButton = document.createElement("button");
                newNavButton.className = "nav-link";
                newNavButton.innerHTML = "Export CSV";
                navBarElement.appendChild(newNavButton);
                console.log("Button should appear");
                navBarElement.onclick = () => {return expandTransactions()};
            } else {
                console.log("No candidates....");
            }
        }, 2500);
    }, false);

})();
