<template>
  <VueButton
    class="mf-ui-group-button"
    :class="{
      selected,
      flat: flat && !selected,
    }"
    :aria-selected="selected"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot/>
  </VueButton>
</template>

<script>

import MFGroup from './MFGroup.vue'

export default {

  name: 'MFGroupButton',

  inheritAttrs: false,

  inject: [
    'MFGroup',
  ],

  props: {
    value: {},

    flat: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    selected () {
      return this.value === this.MFGroup.data.value
    },
  },

  watch: {
    selected (value, oldValue) {
      if (value !== oldValue) {
        this.$emit('selected', value)
      }
    },
  },

  methods: {
    handleClick (...args) {
      this.$emit('click', ...args)
      this.MFGroup.setValue(this.value)
    },
  },
}
</script>

<style lang="stylus">
@import "../../../node_modules/@vue/ui/src/style/imports"
@import "../../style/vars.styl"

.mf-ui-group-button.vue-ui-button

  border-radius $br

  button-transitions()
  &:not(.selected):not(.flat)
    border solid 1px #e8e8e8
    button-colors($mf-ui-color-dark-neutral, $mf-ui-color-light) // This is the color scheme of an unselected button
    .vue-ui-dark-mode &
      button-colors($mf-ui-color-light, $mf-ui-color-dark)
      &.vue-ui-select-button
        button-colors($mf-ui-color-light, $mf-ui-color-dark-neutral)

  &.selected
    .vue-ui-group.has-indicator.primary &
      button-colors($mf-ui-color-primary, $mf-ui-color-light-neutral)
      .vue-ui-dark-mode &
        button-colors($mf-ui-color-primary, $mf-ui-color-dark)
    .vue-ui-group.has-indicator.accent &
      button-colors($mf-ui-color-accent, $mf-ui-color-light-neutral)
      .vue-ui-dark-mode &
        button-colors(lighten($mf-ui-color-accent, 60%), $mf-ui-color-dark)

  .vue-ui-group:not(.has-indicator) &
    &.selected
      &:not(.primary):not(.accent):not(.danger):not(.warning):not(.info):not(.success):not(.flat)
        button-colors($mf-ui-color-light, $mf-ui-color-dark)
        .vue-ui-dark-mode &
          button-colors($mf-ui-color-light, $mf-ui-color-dark-neutral)
          &.vue-ui-select-button
            background lighten($mf-ui-color-dark-neutral, 30%)

  &,
  &.selected
    .vue-ui-group.has-indicator &
      &.flat
        &,
        .vue-ui-dark-mode &
          background transparent

  .vue-ui-group:not(.vertical) &
    &:not(.flat)
      &:not(:first-child)
        border-top-left-radius 0
        border-bottom-left-radius 0
      &:not(:last-child)
        border-top-right-radius 0
        border-bottom-right-radius 0
      &.round
        &:first-child
          padding-left 18px
        &:last-child
          padding-right 18px
        &.icon-button
          &:first-child
            padding-left 12px
          &:last-child
            padding-right 12px

  .vue-ui-group.vertical &
    display flex
    width 100%
    &:not(.flat)
      &:not(:first-child)
        border-top-left-radius 0
        border-top-right-radius 0
      &:not(:last-child)
        border-bottom-left-radius 0
        border-bottom-right-radius 0
      &.round.selected
        background $mf-ui-color-light-neutral !important
        .vue-ui-dark-mode &
          background $mf-ui-color-dark !important
        &::before
          content ''
          display block
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          z-index 0
          border-radius 17px
        > .content
          position relative
          z-index 1
</style>
