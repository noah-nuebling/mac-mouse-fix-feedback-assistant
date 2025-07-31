<template>
    <!--
    [Jul 30 2025] The v-popover seems to render the popover in the wrong position in Edge and Firefox.
        I think this caused several people (See https://github.com/noah-nuebling/mac-mouse-fix/issues/1462) recently failing to submit feedback and saying that the form is broken.
        I tried to fix this for a while today but couldn't make any progress on that.

    I could begin to customize the position through `applyStyle`. Something like this: `:popper-options="{ modifiers: { computeStyle: { enabled: false }, applyStyle: { ... } } }"`
    But couldn't figure out how to get the window size and position of other elements etc. Claude gave me this code and I barely know what's going on.

    It might also be helpful to update v-popover. I tried doing that by updating the @vue/ui library, which depends on the v-tooltip library, which contains the v-popover component. I tried updating to the latest version but that broke the project cause v-tooltip wasn't importable anymore. Not sure what I could've done to fix that.

    [Jul 30 2025] Will abandon this for now. Sorry Edge and Firefox users!

    Update: [Jul 31 2025] Tried to update @vue/ui to latest version (^0.12.5) and importing newer version of v-tooltip myself (^2.1.3)
        However, this however, this only caused additional issues (transparent popover, in Safari, and popover-arrow missing) and doesn't improve the positioning in Edge.
        Also checked https://new-issue.vuejs.org/?repo=vuejs/core&type=bug-report in Edge and it doesn't have the issue. In their package json, they're still using `"@vue/ui": "^0.5.2"` just like us. -> So perhaps the issues we're seeing stem from some of our customizations?
        Maybe we can bisect where we broke things. 
            We introduced the MFTypeAhead in d0a41bd206a7ec5d9e82c849db37dbac72ef069e. 
            ... I tried rolling back those changes by switching MFTypeAhead to VueTypeAhead (in BugReport.vue) and switching .mf-ui-select-button -> .vue-ui-select-button
+                but it seemed to me like the positioning issues in Edge persisted.
    -->
  <v-popover
          ref="popover"
          class="mf-ui-dropdown"
          v-bind="$attrs"
          v-on="$listeners"
          :popover-class="popoverClass"
          :auto-hide="autoHide"
          :offset="offset"
          :disabled="finalDisabled"
          @update:open="onUpdateOpen"
          @keydown.native.tab="onKeyTab"
  >
    <div class="dropdown-trigger">
      <slot name="trigger">
        <MFButton
                :class="buttonClass"
                :icon-left="iconLeft"
                :icon-right="iconRight"
                :disabled="finalDisabled"
        >{{ label }}
        </MFButton>
      </slot>
    </div>

    <VueDisable
            slot="popover"
            ref="popoverContent"
            class="mf-ui-dropdown-content"
            :class="contentClass"
            :style="{
        minWidth: forceMinSize ? `${width}px` : '0',
      }"
            :disabled="!isOpen"
            @mousedown.native="onPopoverContentMousedown"
    >
      <slot/>
    </VueDisable>

    <resize-observer
            v-if="forceMinSize"
            @notify="onResize"
    />
  </v-popover>
</template>

<script>
    import DisabledChild from '../../../node_modules/@vue/ui/src/mixins/DisabledChild'
    import MFButton from "./MFButton";

    export default {
        name: 'MFDropdown',
        components: {MFButton},
        inheritAttrs: false,

        mixins: [
            DisabledChild,
        ],

        props: {
            autoHide: {
                type: Boolean,
                default: true,
            },

            buttonClass: {
                type: [String, Array, Object],
                default: null,
            },

            contentClass: {
                type: [String, Array, Object],
                default: null,
            },

            forceMinSize: {
                type: Boolean,
                default: false,
            },

            iconLeft: {
                type: String,
                default: null,
            },

            iconRight: {
                type: String,
                default: null,
            },

            label: {
                type: [String, Number],
                default: null,
            },

            offset: {
                default: 4,
            },

            noPopoverFocus: {
                type: Boolean,
                default: false,
            },

            popoverClass: {
                type: [String, Array, Object],
                default: undefined,
            },
        },

        data() {
            return {
                isOpen: false,
                width: 0,
            }
        },

        mounted() {
            if (this.forceMinSize) {
                this.$nextTick(this.onResize)
            }
        },

        beforeDestroy() {
            this.removeGlobalMouseEvents()
        },

        methods: {
            onKeyTab(event) {
                // Focus the first focusable element in the popover instead of cycling through the whole app
                // (popover content will be appened at the end of the body)
                if (this.isOpen && !this.noPopoverFocus) {
                    const el = this.$refs.popoverContent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]')
                    if (el) {
                        event.preventDefault()
                        el.focus()
                    }
                }
            },

            onPopoverContentMousedown(event) {
                this.$emit('popover-mousedown', event)
                window.addEventListener('mouseup', this.onPopoverContentMouseup)
            },

            onPopoverContentMouseup(event) {
                this.$emit('popover-mouseup', event)
                this.removeGlobalMouseEvents()
            },

            onResize() {
                this.width = this.$el.offsetWidth
            },

            onUpdateOpen(value) {
                this.isOpen = value
            },

            removeGlobalMouseEvents() {
                window.removeEventListener('mouseup', this.onPopoverContentMouseup)
            },
        },
    }
</script>

<style lang="stylus">
  @import "../../../node_modules/@vue/ui/src/style/imports"
  @import "../../style/vars.styl"

  .tooltip.popover:not(.force-tooltip) .popover-inner // Styling for the popup

    border $mf-dropdown-border
    box-shadow none

    border-radius ($br + ($mf-dropdown-spacing/1))
    //border-radius $br

    padding 0

    background-color $mf-ui-color-light

  .tooltip-arrow
    //box-shadow none

  .popover .wrapper
    filter $mf-dropdown-drop-shadow
    box-shadow $card-highlight

  .mf-ui-dropdown

    display inline-block
    vertical-align middle
    position relative

    .trigger
      &:focus
        outline none

      &::-moz-focus-inner
        border 0

    .trigger,
    .dropdown-trigger,
    .dropdown-trigger > *
      width 100%

  .mf-ui-dropdown-content.vue-ui-disable

    $sp-v = $mf-dropdown-spacing + 1
    $sp-h = $mf-dropdown-spacing
    padding $sp-v $sp-h

    //border-radius $br
    //border 2px solid aquamarine

    box-sizing border-box

    > *
      display block
      width 100%

    > .section-title
      padding 6px 14px
      opacity .8
</style>
