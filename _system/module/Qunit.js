"use strict";

/* global */

class Qunit {
	// Properties

	// Functions public
	constructor() {
	}

	// Functions private
	start = (event) => {
        let page = JSON.stringify({'page': document.body.innerHTML});
        let iframe = document.querySelectorAll("#qunit_iframe")[0];
        
        iframe.onload = () => {
            iframe.contentWindow.postMessage(page, iframe.src);
        };
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    let qunit = new Qunit();
	qunit.start(event);
}, false);