<template>
  <div class="form-intro">
    <i18n
      id="intro"
      class="intro bg-faded"
      @click-modal="show = true"
    />

    <VueModal
      v-if="show"
      :title="i18n('intro-modal-title')"
      class="medium"
      @close="show = false"
    >
      <div class="default-body">
        <i18n id="intro-modal"/>
      </div>
    </VueModal>
  </div>
</template>

<script>
import modal from '../mixins/check-modal'

export default {
  mixins: [modal],

  data () {
    return {
      show: false
    }
  },

  created () {
    this.checkModal('why-strict')
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/imports"



.form-intro
  padding 24px
  margin 24px 0
  border-radius $br
  background lighten($mouse-fix-accent, 85%)



p
  color aqua

a
  $mouse-fix-accent
  color aqua

li
  font-weight bolder
  color aqua

</style>
