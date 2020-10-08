<template>
  <div
    class="mf-ui-input"
    :class="[
      `type-${type}`,
      {
        disabled: finalDisabled,
        focused,
        'show-suggestion': showSuggestion,
        [`status-${status}`]: status,
      },
    ]"
    @click="focus()"
  >
    <div class="content">
      <VueLoadingIndicator
        v-if="loadingLeft"
        class="small left"
      />

      <VueIcon
        v-else-if="iconLeft"
        :icon="iconLeft"
        class="input-icon left"
      />

      <slot name="left"/>

      <div
          class="input-wrapper"
          v-resize @resize="autoResize ? mixin_autoResize_resize($refs.input) : null"
           >
        <!-- Using @resize directly on the child component doesn't work for some reason, so we're using it above. -->
        <component
          :is="type === 'textarea' ? type : 'input'"
          ref="input"
          class="input"
          :type="type"
          :value.prop="valueModel"
          :placeholder="placeholder"
          :disabled="finalDisabled"
          v-bind="$attrs"
          v-on="listeners"
          @input="valueModel = $event.currentTarget.value; autoResize ? mixin_autoResize_resize($event.currentTarget) : null"
          @focus="onFocus"
          @blur="onBlur"
          @keydown.tab="onKeyTab"
        />

          <input
            v-if="showSuggestion"
            class="input suggestion"
            :value="suggestion"
            disabled
          >
      </div>

      <slot name="right"/>

      <VueIcon
        v-if="iconRight"
        :icon="iconRight"
        class="input-icon right"
      />

      <VueLoadingIndicator
        v-if="loadingRight"
        class="small right"
      />

      <!-- Focus animation -->
      <div class="border"/>
    </div>
  </div>
</template>

<script>
import DisabledChild from '../../../node_modules/@vue/ui/src/mixins/DisabledChild'
import autoResize from '../../mixins/auto-resize'

export default {
  name: 'MFInput',

  inheritAttrs: false,

  mixins: [
    DisabledChild,
    autoResize
  ],

  inject: {
    VueFormField: { default: null },
  },

  props: {

    autoResize: {
      type: Boolean,
      default: true,
    },

    iconLeft: {
      type: String,
      default: null,
    },

    iconRight: {
      type: String,
      default: null,
    },

    loadingLeft: {
      type: Boolean,
      default: false,
    },

    loadingRight: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      default: undefined,
    },

    selectAll: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: undefined,
    },

    suggestion: {
      type: [String, Number],
      default: null,
    },

    type: {
      type: String,
      default: 'text',
    },

    value: {},
  },

  data () {
    return {
      focused: false,
    }
  },

  computed: {
    listeners () {
      return Object.keys(this.$listeners).filter(
        key => key !== 'input' && key !== 'focus' && key !== 'blur'
      ).reduce((obj, key) => {
        obj[key] = this.$listeners[key]
        return obj
      }, {})
    },

    showSuggestion () {
      return this.suggestion !== null && this.suggestion !== this.value && this.focused && this.value
    },

    valueModel: {
      get () { return this.value },
      set (value) { this.$emit('input', value) },
    },
  },

  watch: {
    focused: {
      handler (value) {
        if (this.VueFormField) {
          this.VueFormField.data.focused = value
        }
      },
      immediate: true,
    },

    status: {
      handler (value) {
        if (this.VueFormField) {
          this.VueFormField.data.status = value
        }
      },
      immediate: true,
    },
  },

  methods: {
    focus () {
      const input = this.$refs.input
      input.focus()
      if (this.selectAll) {
        input.setSelectionRange(0, input.value.length)
      }
    },
    onBlur (event) {
      this.focused = false
      this.$emit('blur', event)
    },

    onFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },

    onKeyTab (event) {
      if (this.showSuggestion) {
        this.valueModel = this.suggestion
        event.preventDefault()
        event.stopPropagation()
      }
    },
  },

  mounted() {
    if (this.$props.autoResize) {
      this.mixin_autoResize_resize(this.$refs.input)
    }
  }
}
</script>

<style lang="stylus">
@import "../../style/imports.styl"

colors($color)
  > .content
    > .border
      background $color
  &.focused
    > .content
      > .mf-ui-loading-indicator
        .animation
          border-right-color $color
          border-bottom-color $color
      > .input-icon
        svg
          fill darken($color, 20%)

.mf-ui-input

  $lightened = lighten($mf-ui-color-dark-neutral, 50%)
  display inline-block
  vertical-align middle
  box-sizing border-box
  width auto
  min-width 200px
  border-radius $br
  border 1.2px solid $border-color

  overflow hidden

  > .content
    box-shadow $shadow-inner
    h-box()
    box-center()
    padding 0px 10px
    //border solid 1px $mf-ui-color-light-neutral
    color $mf-ui-color-dark-neutral
    border-radius $br
    transition background .3s
    position relative
    .vue-ui-dark-mode &
      border-color $mf-ui-color-dark
      color $mf-ui-color-light

    > .input-wrapper
      position relative
      width 0
      flex auto 1 1

      > .input
        max-height 300px // Would be nice to be able to override this by setting a prop
        //margin 0px !important
        //border 1px solid black !important
        position relative
        z-index 1
        font-family inherit
        font-size 13px
        line-height 14px
        color @color
        padding 0
        width 100%
        display block
        border none
        background transparent
        .vue-ui-dark-mode &
          color $mf-ui-color-light
        &:not(textarea)
          height 33px
        &::placeholder
          //border 1px solid black
          color $lightened
          padding-bottom 7px
          // ^ Needed to make textarea auto-resizing look right
          //     Need to use padding for Safari, margin only works on Chrome
          .vue-ui-dark-mode &
            color lighten($lightened, 30%)
        // Disable noisy browser styles
        outline none
        &::-moz-focus-inner
          border 0

      > textarea.input
        padding 8px 10px
        resize none //resize vertical
        min-height 30px
        box-sizing border-box
        line-height 17px

      > .suggestion
        position absolute
        z-index 0
        top 0
        left 0
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        color $lightened
        pointer-events none

    > .input-icon
      &.left
        margin-right 6px
      &.right
        margin-left 6px
      svg
        fill $lightened
        transition fill .3s

    > .mf-ui-loading-indicator
      &.left
        margin-right 8px
      &.right
        margin-left 8px
      .animation
        border-right-color $lightened
        border-bottom-color $lightened

    > .border
      position absolute
      bottom -1px
      left 30%
      right @left
      opacity 0
      height 2px
      pointer-events none
      transition left .15s, right .15s, opacity .15s

  &.type-textarea
    > .content
      padding 0

  &:not(.flat)
    > .content
      background $mf-ui-color-light // Background color when unfocused
      .vue-ui-dark-mode &
        background $mf-ui-color-darker

  &.show-suggestion
    > .content > .input-wrapper > .input
      &::placeholder
        color transparent

  // Colors
  colors($mf-ui-color-primary)
  &.accent
    colors($mf-ui-color-accent)
    .vue-ui-dark-mode &
      colors(lighten($mf-ui-color-accent, 40%))
  &.danger,
  &.status-danger
    colors($mf-ui-color-danger)
  &.warning,
  &.status-warning
    colors($mf-ui-color-warning)
  &.info,
  &.status-info
    colors($mf-ui-color-info)
  &.success,
  &.status-success
    colors($mf-ui-color-success)

  transition $mf-border-glow-transition
  &.focused
    box-shadow $mf-border-glow-shadow
    &:not(.flat)
      > .content
        background $mf-ui-color-light
        .vue-ui-dark-mode &
          background $mf-ui-color-dark
        > .border
          left 0
          right @left
          opacity 0 // Setting this to 1 enabled Material design-y bottom border when field is focused.
      &.round
        > .content > .border
          display none

  &.flat
    > .content
      border-color transparent
      > .border
        display none

  &.big
    > .content
      padding 0 14px
      > .input-wrapper
        > .input
          font-size 16px
          &:not(textarea)
            height 42px
        > textarea.input
          padding 14px 0

      > .input-icon
        width 20px
        height @width
        &.left
          margin-right 10px
        &.right
          margin-left 10px

  &.round
    > .content
      border-radius 17px
    // Big button
    &.big
      > .content
        border-radius 22px

  &:not(.disabled)
    cursor text

  &.disabled
    opacity .5

  .mf-ui-dropdown-content > &
    min-width 200px
    padding 0 4px 4px
</style>
