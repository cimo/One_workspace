import { mount } from "@vue/test-utils";
import Body from "../../src/components/Body.vue";

describe("Body.vue", () => {
    it("Body element exists", () => {
        const wrapper = mount(Body);
        const bodyElement = wrapper.find(".body_component");

        expect(bodyElement.exists()).toBeTruthy();
    });
});
