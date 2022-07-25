import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import ViewDemo from "@/views/Demo.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "demo",
        component: ViewDemo
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
