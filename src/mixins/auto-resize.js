// src: https://medium.com/@adamorlowskipoland/vue-auto-resize-textarea-3-different-approaches-8bbda5d074ce

export default {
    methods: {
        mixin_autoResize_resize(target) {

            console.log('RESISIZNG AUTOMATICALLY')

            target.style.height = "auto";
            let h = target.scrollHeight
            if (target.value === '') { // Placeholders seem to have a smaller bottom margin so we're adding some extra height
                //h += 8;
            }
            target.style.height = `${h}px`;
        }
    },
    // mounted() {
    //     this.$nextTick(() => {
    //         this.$el.setAttribute("style", "height",
    //             `${this.$el.scrollHeight}px`);
    //     });
    // }
};