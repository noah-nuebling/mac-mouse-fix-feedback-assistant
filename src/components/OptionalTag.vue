<template>
    <div class="content">
        <div class="bg">
            <p class="text">
                Optional
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OptionalTag.vue"
    }
</script>

<style lang="stylus" scoped>

    @import '../style/imports.styl'

    .content

        margin-left 8px
        margin-right 0px
        align-self flex-center
        justify-self flex-end

        position relative
        top 1px

    .bg
        margin 0
        padding 3px 4px

        background darken($mf-ui-color-accent, 5%)

        border-radius 4px

    .text
        margin 0

        color white
        //color $mf-ui-color-dark

        font-size 9px

</style>