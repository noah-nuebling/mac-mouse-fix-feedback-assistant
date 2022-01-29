
<!-- This whole template is unused I think. The actual header is in App.vue -->

<template>
  <div class="root">

    <nav class="app-header">
      <div class="container">

        <a class="brand" href="#">
          <img
                  class="logo"
                  src="../assets/images/app_icon_round.png"
                  alt="The Mac Mouse Fix logo"
          >
          Mac Mouse Fixxxx
        </a>
        <p class="title">
          Feedback Assistant
        </p>

        <!--      <ul class="nav">-->
        <!--        <li-->
        <!--          v-for="(locale, key) in $root.$locales"-->
        <!--          :key="key"-->
        <!--          class="nav-item"-->
        <!--        >-->
        <!--          <a-->
        <!--            class="nav-link"-->
        <!--            :class="{ active: lang === key }"-->
        <!--            @click="$emit('change-lang', key)"-->
        <!--          >-->
        <!--            {{ locale._label }}-->
        <!--          </a>-->
        <!--        </li>-->
        <!--      </ul>-->
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['lang']
}
</script>

<style lang="stylus" scoped>
@import "../style/imports"

.app-header
  // background lighten($mouse-fix-accent, 85%)
  background white
  border-bottom solid 0.5px $border-color

  &,
  .container,
  .brand,
  .nav
    h-box()
    box-center()

  .container

    position relative

    display: flex
    flex-direction: row

    width 100%
    max-width $page-width
    align-items center
    align-content center
    // flex 100% 1 1
    justify-content center
    padding 20px
    box-sizing border-box

  .brand
    // border-style solid
    // margin-left 20px
    color $vue-ui-color-dark
    font-size: 20px
    font-weight bolder
    .logo
      margin-right 12px
      height 48px

  .nav
    margin 0

  .nav-item
    list-style none
  .nav-item + .nav-item
    margin-left 8px

  .nav-link
    cursor default
    &:not(.active)
      cursor pointer
      color $vue-ui-color-dark

  .title
    visibility hidden
    font-size 16px
    position absolute
    right 0
    margin-right 20px


</style>
