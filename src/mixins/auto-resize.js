// src: https://medium.com/@adamorlowskipoland/vue-auto-resize-textarea-3-different-approaches-8bbda5d074ce

export default {
    methods: {
        mixin_autoResize_resize(target) {

            target.style.height = "auto";
            let h = target.scrollHeight
            target.style.height = `${h}px`;
        }
    },

    // v I copied this form somewhere on the internet, not sure what it's good for. I don't seem to need it
    // mounted() {
    //     this.$nextTick(() => {
    //         this.$el.setAttribute("style", "height",
    //             `${this.$el.scrollHeight}px`);
    //     });
    // }
};