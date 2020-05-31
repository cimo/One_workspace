"use strict";

/* global */

class Ajax {
	// Properties

	// Functions public
	constructor() {
	}

	// Functions private
	sendPost = (target) => {
        let popupBack = document.createElement("div");
        let popup = document.createElement("div");
        let popupContent = document.createElement("div");
        let popupText = document.createElement("pre");
        let popupButton = document.createElement("button");
        
        popupBack.style.cssText = "position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #000000; opacity: 0.7; position: fixed;";

        popup.style.cssText = "position: absolute; top: 25%; left: 50%; transform: translate(-50%, -25%); padding: 10px; background-color: #ffffff; width: 300px; max-height: 200px;";

        popupText.innerHTML = "Waiting...";
        popupText.style.cssText = "color: #000000; max-height: 150px; overflow-y: auto;";

        popupButton.innerHTML = "Close";

        popupContent.appendChild(popupText);
        popupContent.appendChild(popupButton);

        popup.appendChild(popupContent);
        
        document.body.appendChild(popupBack);
        document.body.appendChild(popup);

        let dataEvent = target.getAttribute("data-event");
        let dataPath = target.getAttribute("data-path");
        
        let formData = new FormData();
        
        if (dataPath !== undefined)
            formData.append("path", dataPath);
        
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                popupText.innerHTML = xhr.response;

                popupButton.onclick = (event) => {
                    popupBack.remove();
                    popup.remove();
                }
            }
        };
        
        xhr.open("post", window.location.origin + "/_system/module/" + dataEvent + ".php");
        xhr.send(formData);
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
	let ajax = new Ajax();
	
    let button = document.querySelectorAll(".command");
    
    for (const [key, value] of Object.entries(button)) {
        value.addEventListener("click", (event) => {
            ajax.sendPost(value);
        });
    }
}, false);