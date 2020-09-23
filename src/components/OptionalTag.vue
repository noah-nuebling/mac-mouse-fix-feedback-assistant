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

        position relative
        margin-left 4px
        bottom 4px

    .bg
        padding 3px 4px
        margin 0

        background darken($mf-ui-color-accent, 5%)
        border-radius $br

    .text
        margin 0
        color white

        font-size 9px

</style>