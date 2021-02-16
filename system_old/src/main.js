import Vue from "vue";
import VueRouter from "vue-router";
import Router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const vueRouter = new VueRouter({
    mode: "history",
    routes: Router.page
});

vueRouter.beforeEach((to, from, next) => {
    document.title = to.meta.title;

    next();
});

new Vue({
    router: vueRouter,
    render: h => h(App),
}).$mount('#app');
