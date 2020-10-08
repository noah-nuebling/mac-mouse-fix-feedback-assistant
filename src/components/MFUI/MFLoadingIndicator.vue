<template>
  <div class="mf-ui-loading-indicator">
    <div class="animation"/>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'MFLoadingIndicator',
}
</script>

<style lang="stylus">
@import "../../style/imports"

colors($color)
  border-right-color $color
  border-bottom-color $color

.mf-ui-loading-indicator
  display flex
  &.inline
    display inline-flex
  flex-direction column
  box-center()

  > .animation
    animation rotating .7s linear infinite
    width 16px
    height @width
    border-radius 50%
    border 3px solid transparent
    colors($mf-ui-color-dark)
    .vue-ui-dark-mode &
      colors($mf-ui-color-dark-neutral)
  &.primary
    > .animation
      colors($mf-ui-color-primary)
  &.accent
    > .animation
      colors($mf-ui-color-accent)
      .vue-ui-dark-mode &
        colors(lighten($mf-ui-color-accent, 60%))
  &.small
    > .animation
      width 10px
      height @width
  &.big
    > .animation
      width 24px
      height @width
      border-width 4px

  &.overlay
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    z-index 1
    > .animation
      margin-bottom 32px
    &:not(.transparent)
      background rgba($mf-ui-color-light, .95)
      .vue-ui-dark-mode &
        background rgba($mf-ui-color-darker, .95)
    &.fixed
      position fixed

@keyframes rotating
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>
