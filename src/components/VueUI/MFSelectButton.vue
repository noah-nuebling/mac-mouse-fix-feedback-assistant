<template>
  <MFGroupButton
    ref="groupButton"
    class="mf-ui-select-button"
    v-bind="$attrs"
    v-on="$listeners"
    v-close-popover="!keepOpen"
    flat
    @selected="onSelect"
  >
    <slot/>
  </MFGroupButton>
</template>

<script>
import VueDropdownButton from '../../../node_modules/@vue/ui/src/components/VueDropdownButton'
import MFGroupButton from "./MFGroupButton";

export default {
  name: 'MFSelectButton',
  components: {
    MFGroupButton
  },
  //extends: VueDropdownButton,

  inject: [
    'MFSelect',
  ],

  props: {
    selectLabel: {
      type: String,
      default: null,
    },
  },

  mounted () {
    this.onSelect(this.$refs.groupButton.selected)
  },

  methods: {
    onSelect (selected) {
      if (selected) {
        this.MFSelect.setCurrentChild(this)
      }
    },
  },
}
</script>

<style lang="stylus">
  @import "../../style/imports.styl"

  .mf-ui-select-button
    border-radius $br !important

    margin-bottom $mf-dropdown-spacing // Item gap
    &:last-child
      margin-bottom 0

</style>
