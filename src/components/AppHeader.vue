<template>
  <nav class="app-header">
    <div class="container">
      <a class="brand" href="#">
        <img
          class="logo"
          src="../assets/images/logo.png"
          alt="The Mac Mouse Fix logo"
        >
        Issue Helper
      </a>

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
</template>

<script>
export default {
  props: ['lang']
}
</script>

<style lang="stylus" scoped>
@import "../style/imports"

.app-header
  background lighten($mouse-fix-accent, 85%)
  // border-bottom solid 0.5px $border-color

  &,
  .container,
  .brand,
  .nav
    h-box()
    box-center()

  .container

    display: flex
    flex-direction: row

    max-width $page-width
    flex 100% 1 1
    justify-content center
    padding 24px
    box-sizing border-box

  .brand
    /*border-style: solid*/
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

</style>
