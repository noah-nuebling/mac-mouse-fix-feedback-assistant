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
        name: "OptionalTag"
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
        top 2px
        //top -2px


    .bg

        $clr = darken($mf-ui-color-accent, 0%)
        margin 0
        padding 3px 6px

        background $clr

        //border-radius 10px
        border-radius 5px

        &:after
            content: "";
            width: 0px;
            height: 0px;
            position: absolute;

            $bw = 5px
            $bw-top = ($bw + $bw) * 0.866

            border-top: $bw-top solid $clr;
            border-right: $bw solid transparent;
            border-bottom: $bw solid transparent;
            border-left: $bw solid transparent;
            left: 18.4px
            bottom: -9.5px

            z-index -1

    .text
        margin 0

        color white
        //color $mf-ui-color-dark

        font-size 9px

</style>