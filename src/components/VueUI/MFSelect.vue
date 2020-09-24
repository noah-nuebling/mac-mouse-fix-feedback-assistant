<template>
  <MFDropdown
          ref="dropdown"
          class="mf-ui-select"
          v-bind="$attrs"
          v-on="$listeners"
          :disabled="finalDisabled"
          :icon-left="displayedIcon"
          :icon-right="iconRight"
          :label="displayedLabel"
          :popover-class="['popover', 'select-popover', popoverClass]"
          content-class="mf-ui-select-popover-content"
          force-min-size
  >
    <template slot="trigger">
      <slot name="trigger" :label="displayedLabel"/>
    </template>

    <MFGroup
            v-model="valueModel"
            class="vertical"
    >
      <slot/>
    </MFGroup>
  </MFDropdown>
</template>

<script>
    import DisabledChild from '../../../node_modules/@vue/ui/src/mixins/DisabledChild'
    import MFGroup from "./MFGroup";
    import MFDropdown from "./MFDropdown";

    export default {
        name: 'MFSelect',
        components: {MFDropdown, MFGroup},
        inheritAttrs: false,

        mixins: [
            DisabledChild,
        ],

        provide() {
            return {
                MFSelect: {
                    setCurrentChild: this.setCurrentChild,
                },
            }
        },

        props: {
            iconLeft: {
                type: String,
                default: null,
            },

            iconRight: {
                type: String,
                default: 'keyboard_arrow_down',
            },

            label: {
                type: [String, Number],
                default: null,
            },

            placeholder: {
                type: String,
                default: 'Select...',
            },

            popoverClass: {
                type: String,
                default: undefined,
            },

            value: {},
        },

        data() {
            return {
                currentChild: null,
            }
        },

        computed: {
            displayedLabel() {
                if (this.label) {
                    return this.label
                } else if (this.currentChild) {
                    return this.currentChild.selectLabel ||
                        this.currentChild.$attrs.label ||
                        this.value
                } else if (this.placeholder) {
                    return this.placeholder
                } else {
                    return this.value
                }
            },

            displayedIcon() {
                if (this.iconLeft) {
                    return this.iconLeft
                } else if (this.currentChild) {
                    return this.currentChild.$attrs.icon ||
                        this.currentChild.$attrs['icon-left']
                }
            },

            valueModel: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                },
            },
        },

        methods: {
            setCurrentChild(vm) {
                this.currentChild = vm
            },
        },
    }
</script>

<style lang="stylus">

  @import "../../style/imports.styl"

  .mf-ui-select
    .dropdown-trigger
      .mf-ui-button
        > .content > .default-slot
          flex auto 1 1

  .mf-ui-select-popover-content
    max-height 220px
    overflow-y auto

</style>
