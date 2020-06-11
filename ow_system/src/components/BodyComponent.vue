<template>
    <div id="body_component">
        <WindowComponent/>
    </div>
</template>

<script>
    import {Helper} from "@/assets/js/Helper.js";
    import WindowComponent from "@/components/WindowComponent.vue";
    
    export default {
        name: "BodyComponent",
        components: {
            WindowComponent
        },
        computed: {},
        methods: {
            findParent: Helper.findParent,
            windowLogic: function(event) {
                const findParentA = this.findParent(event.target, "window_opener");
                
                if (findParentA !== null) {
                    let name = findParentA.getAttribute("data-name");
                    
                    let windows = document.querySelectorAll(".window");
                    
                    let isOpen = false;
                    
                    windows.forEach((value) => {
                        if (name === value.getAttribute("data-origin"))
                            isOpen = true;
                    });
                    
                    if (isOpen === false) {
                        let newWindowComponent = this.windowComponent.cloneNode(true);
                        document.querySelector("#body_component").appendChild(newWindowComponent);
                        
                        let title = newWindowComponent.querySelector(".left_column p");
                        title.innerHTML = name;
                        
                        newWindowComponent.setAttribute("data-origin", name);
                        newWindowComponent.style.display = "block";
                        
                        let leftColumn = document.querySelector("#footer_component .left_column");
                        
                        let alt = findParentA.querySelector("img").getAttribute("alt");
                        
                        let newMainbarElement = document.querySelector("#footer_component .left_column .mainbar_element.empty").cloneNode(true);
                        newMainbarElement.classList.remove("empty");
                        newMainbarElement.querySelector("img").setAttribute("src", require(`@/assets/images/${alt}`));
                        newMainbarElement.querySelector("img").setAttribute("alt", alt);
                        leftColumn.appendChild(newMainbarElement);
                    }
                }
                
                if (event.target.classList.contains("button_minimize") === true) {
                    //const findParent = this.findParent(event.target, "window");
                    
                    
                }
                else if (event.target.classList.contains("button_maximize") === true) {
                    const findParent = this.findParent(event.target, "window");
                    
                    if (findParent.classList.contains("maximized") === false) {
                        findParent.style.width = "calc(100% - 2px)";
                        findParent.style.height = "calc(100% - 42px)";
                    }
                    else {
                        findParent.style.width = this.windowWidth;
                        findParent.style.height = this.windowHeight;
                    }
                    
                    findParent.classList.toggle("maximized");
                }
                else if (event.target.classList.contains("button_close") === true) {
                    const findParent = this.findParent(event.target, "window");
                    
                    findParent.parentNode.removeChild(findParent);
                }
            }
        },
        data() {
            return {
                body: null,
                windowComponent: null,
                windowWidth: "60%",
                windowHeight: "80%"
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");
                this.windowComponent = document.querySelector("#window_component");
                
                this.body.addEventListener("click", (event) => {
                    this.windowLogic(event);
                }, {passive: true});
            });
        },
        beforeDestroy() {
            if (this.body !== null)
                this.body.removeEventListener("click", () => {}, false);
        }
    }
</script>

<style>
    #body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>