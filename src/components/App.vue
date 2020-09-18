<template>
<div id="app" class="app">

  <!-- Header (unused) -->

  <AppHeader v-if="false" :lang="$lang" @change-lang="setLang"/>

  <!-- Container -->

  <div class="container">

    <!-- Title section-->
    <div class="title-sec">
      <div class="title-sec__brand">
        <img class="title-sec__brand--img" src="../assets/images/logo.png" alt="Mac Mouse Fix's logo">
        <h2 class="title-sec__brand--text">Mac Mouse Fix</h2>
      </div>
      <h1 class="title-sec__title"> Feedback Assistant</h1>
    </div>

    <!-- Form -->

    <form class="main-form" @submit.prevent="generate">

<!--      <FormIntro/>-->

      <div class="common-fields vue-ui-grid col-2 default-gap">

        <!-- Form type picker (Bug Report, Feature Request, ...) -->

        <MFFormField
          class="first-row span-2 test"
        >
          <VueGroup
            v-model="type"
            class="extend mmf-bg"
          >
            <MFGroupButton
              v-for="option of types"
              :key="option.id"
              :value="option.id"
            >
              {{ option.name }}
            </MFGroupButton>
          </VueGroup>
        </MFFormField>

        <!-- Main input fields -->

        <div class="card span-2">
        <!-- content component -->
        <keep-alive>
          <component :is="type" ref="content" :repo="repo"/>
        </keep-alive>

        <!-- attachments -->
  <!--      <MFFormField-->
  <!--              :title="i18n('attachments-title')"-->
  <!--      >-->
  <!--&lt;!&ndash;        <MFInput&ndash;&gt;-->
  <!--&lt;!&ndash;        type="file"&ndash;&gt;-->
  <!--&lt;!&ndash;        multiple&ndash;&gt;-->
  <!--&lt;!&ndash;        >&ndash;&gt;-->
  <!--&lt;!&ndash;          WHAT DOES THIS DOOOO&ndash;&gt;-->
  <!--&lt;!&ndash;        </MFInput>&ndash;&gt;-->

  <!--        <input type="file" multiple>-->

  <!--        <i18n v-show="this.type == 'feature-request'" slot="subtitle" id="attachments-subtitle-feature"></i18n>-->
  <!--        <i18n v-show="this.type == 'bug-report'" slot="subtitle" id="attachments-subtitle-bug"></i18n>-->
  <!--      </MFFormField>-->

        <!-- Form actions -->
        <div class="form-actions">
          <MFButton
            v-on:click=""
            class="secondary big"
            :label="i18n('submit-btn-email')"
          />
          <div class="vue-ui-spacer"></div>
          <MFButton
            type="submit"
            class="primary big"
            :label="i18n('submit-btn-gh')"
          />
        </div>
        </div>
      </div>
    </form>

    <VueModal
      v-if="show"
      :title="i18n('preview-title')"
      class="medium"
      @close="show = false"
    >
      <div class="default-body" v-html="generated.html"/>

      <div slot="footer" class="actions">
        <VueButton
          class="primary big"
          :label="i18n('create')"
          @click="create()"
        />
      </div>
    </VueModal>
  </div>

  <footer class="app-footer">
    <p>&hellip;</p>
    <small>
      Based on <a href="https://github.com/vuejs/vue-issue">Vue Issue Helper</a>
      &centerdot;
      Check out source on <a href="https://github.com/noah-nuebling/mac-mouse-fix-issue-helper">GitHub</a>
    </small>
  </footer>
</div>
</template>

<script lang="babel">
<!--<script type="text/babel">-->
import { repos } from '../config'
import { getQuery, updateQuery } from '../helpers'

import FormIntro from './FormIntro.vue'
import AppHeader from './AppHeader.vue'
import BugReport from './BugReport.vue'
import FeatureRequest from './FeatureRequest.vue'
import search from '../mixins/github-search'

import MFButton from './VueUI/MFButton.vue'
import MFGroupButton from './VueUI/MFGroupButton.vue'
import MFFormField from './VueUI/MFFormField.vue'
import MFInput from './VueUI/MFInput.vue'


export default {
  name: 'App',

  mixins: [search],

  components: {
    FormIntro,
    AppHeader,
    BugReport,
    FeatureRequest,
    MFButton,
    MFGroupButton,
    MFFormField,
    MFInput
  },

  data () {
    return {
      generated: {
        markdown: '',
        html: ''
      },
      show: false,
      preview: false,
      repo: null,
      repos,
      type: 'bug-report',
      versions: {},
    }
  },

  computed: {
    types () {
      return this.$lang && [
        { id: 'bug-report', name: this.i18n('bug-report') },
        { id: 'feature-request', name: this.i18n('feature-request') }
      ]
    }
  },

  watch: {
//    repo (value) {
//      if (value) updateQuery({ repo: value.id })
//    },

    type (value) {
      updateQuery({ type: value })
    }
  },

  created () {
    const { repo, type } = getQuery()
    // this.repo = this.repos.find(r => r.id === repo) || this.repos[0]
    this.repo = "noah-nuebling/mac-mouse-fix"
    this.type = type || 'bug-report'
  },

  methods: {
    setLang (lang) {
      this.$lang = lang
      updateQuery({ lang })
    },

    findIssues () {
      this.issues = []
      if (this.title) {
        this.fetchIssues(this.title, { is: 'issue', repo: this.repo.id })
      }
    },

    generate () {
      this.title = this.$refs.content.attrs.title
      this.generated = this.$refs.content.generate()
      this.show = true
    },

    create () {
      const title = encodeURIComponent(this.title).replace(/%2B/gi, '+')
      const body = encodeURIComponent(this.generated.markdown).replace(/%2B/gi, '+')
      const label = this.type === 'feature-request' ? '&labels=feature%20request' : ''
      // window.open(`https://github.com/${this.repo}/issues/new?title=${title}&body=${body}${label}`)
      window.open(`https://github.com/noah-nuebling/mac-mouse-fix/issues/new?title=${title}&body=${body}${label}`)
    },
  },
}
</script>

<style lang="stylus">
@import '~@vue/ui/dist/vue-ui.css'
@import "../style/vars.styl"

  a
    color $link-color

</style>

<style lang="stylus" scoped>
@import "../style/imports"

/*v Unnecessary, cause this is the same as the class span-2*/
/*.wide*/
/*  grid-column: span 2*/


.container
  max-width $page-width
  margin 0 auto
  box-sizing border-box
  padding 0 24px
  /*background-color aqua*/

.first-row
  margin-bottom 36px

.common-fields
  margin-bottom 24px

.form-actions
  h-box()
  //box-center()
  display flex
  flex-wrap wrap
  justify-content flex-end
  margin (12+24)px 0 0px 0

.app-footer
  text-align center
  margin 24px 0

.app
  // background $global-background-color

.title-sec

  //border solid

  display flex
  flex-direction column
  justify-content flex-start
  // align-items center
  margin 36px 0 42px 0
.title-sec__brand
  display flex
  flex-direction row
  align-items center
.title-sec__brand--img
  align-self center
  width 36px
  height auto
.title-sec__brand--text
  margin 0 0 0 10px
  font-size medium
  font-weight medium
.title-sec__title
  align-self flex-start // For some reason, choosing start or end makes it center aligned, and choosing center makes it not aligned at all... But only when border is set to solid.....
  font-weight bolder
  margin 12px 0 0 0

.card
  padding 24px
  margin-bottom: 48px
  border-radius $br
  //border-style solid
  border-color $border-color
  border-width 0.5px
  background $card-color-medium
  box-shadow $shadow-low

</style>
