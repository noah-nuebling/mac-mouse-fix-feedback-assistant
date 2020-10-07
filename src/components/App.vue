<template>
  <div id="app" class="app">

    <!-- Header (unused) -->

    <AppHeader v-if="false" :lang="$lang" @change-lang="setLang"/>

    <!-- Container -->

    <div class="container">

      <!-- Start region -->

      <div class="start-region">

        <!-- Title section-->

        <div class="title-sec">
          <div class="title-sec__brand">
            <img class="title-sec__brand--img" src="../assets/images/logo.png" alt="Mac Mouse Fix's logo">
            <h2 class="title-sec__brand--text">Mac Mouse Fix</h2>
          </div>
          <h1 class="title-sec__title"> Feedback Assistant</h1>
        </div>

        <!-- Type picker (Bug Report, Feature Request, ...) -->

        <MFGroup
            v-model="type"
            class="type-picker span-2 extend card-elevation-high"
        >
          <MFGroupButton
              v-for="option of types"
              :key="option.id"
              :value="option.id"
          >
            {{ option.name }}
          </MFGroupButton>
        </MFGroup>

        <!-- More indicator -->
        <!--        <div class="more-indicator">-->
        <!--&lt;!&ndash;          <img class="more-indicator__img" src="../assets/images/chevron.down.svg" alt="More indicator">&ndash;&gt;-->
        <!--          <img class="more-indicator__img"-->
        <!--                  src="../assets/images/chevron.down.circle.color.svg"-->
        <!--                  alt="More indicator"/>-->
        <!--        </div>-->

      </div>

      <!-- Form -->
      <form class="main-form" @submit.prevent="submit()">

        <!--      <FormIntro/>-->

        <!-- Grid -->
        <div class="vue-ui-grid col-2 small-gap">

          <!-- Card -->
          <div class="card form-card-padding card-elevation-high span-2">

            <!-- Content component -->
            <keep-alive>
              <component
                  :is="type"
                  ref="content"
                  :repo="repo"
                  @findIssues="findIssues()"
              />
            </keep-alive>

            <!-- Form actions -->
            <div class="form-actions">
              <MFButton
                  @click="submitAction = 'email'"
                  type="submit"
                  class="secondary medium mf-submit-btn"
                  :label="i18n('submit-btn-email')"
                  ref="submitEmail"
                  :loading="uploadingPastebin && submitAction === 'email'"
              />
              <!--          <div class="vue-ui-spacer"></div>-->
              <MFButton
                  @click="submitAction = 'issue'"
                  type="submit"
                  class="primary medium mf-submit-btn"
                  :label="i18n('submit-btn-gh')"
                  :loading="uploadingPastebin && submitAction === 'issue'"
              />
            </div>
          </div>
        </div>
      </form>

      <div class="card-flat card-elevation-low footer">
        <div class="footer-container">
          <i18n
              v-if="this.type == 'bug-report'"
              id="thank-you-bug"
              class="footer__text"
          />
          <i18n
              v-if="this.type == 'feature-request'"
              id="thank-you-feature"
              class="footer__text"
          />
          <i18n
              v-if="this.type == 'other'"
              id="thank-you-other"
              class="footer__text"
          />
          <hr>

          <div class="vue-ui-grid col-2 footer-links">
            <small class="span-1 footer-links__col">
              <a class='footer-links__line' href="https://noah-nuebling.github.io/mac-mouse-fix-website/">Visit the Mac Mouse Fix <span class="link-accent">Website</span></a>
              <a class="footer-links__line" href="https://github.com/noah-nuebling/mac-mouse-fix-feedback-assistant">Check out the source code on <span class="link-accent">GitHub</span></a>
            </small>
            <small class="span-1 footer-links__col">
              <a class="footer-links__line" href="https://new-issue.vuejs.org/?repo=vuejs/vue">Based on <span class="link-accent">Vue Issue Helper</span></a>
              <!--
                          <span class="footer__line">
                            Powered by <a
                              href="https://pastebin.com/">Pastebin</a>
                          </span>
              -->
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- Need to use `<script>` for syntax highlighting and stuff, but `<script lang="babel">` is what is was originally. Both seem to work fine -->

<!--<script lang="babel">-->
<script>

import {getQuery, updateQuery} from '../helpers'

import FormIntro from './FormIntro.vue'
import AppHeader from './AppHeader.vue'
import BugReport from './BugReport.vue'
import FeatureRequest from './FeatureRequest.vue'
import Other from './Other.vue'
import search from '../mixins/github-search'

import MFButton from './VueUI/MFButton.vue'
import MFGroup from "./VueUI/MFGroup";
import MFGroupButton from './VueUI/MFGroupButton.vue'
import MFFormField from './VueUI/MFFormField.vue'
import MFInput from './VueUI/MFInput.vue'

// Define constants

// Practical max length for URLs is 2000 chars (src: https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)
const URL_LIMIT = 2000

// Export

export default {
  name: 'App',

  mixins: [search],

  components: {
    FormIntro,
    AppHeader,
    BugReport,
    FeatureRequest,
    Other,
    MFButton,
    MFGroup,
    MFGroupButton,
    MFFormField,
    MFInput
  },

  data() {
    return {
      title: '',
      label: '',
      generated: {
        markdown: '',
        html: ''
      },
      show: false,
      preview: false,
      repo: null,
      type: 'feature-request',
      versions: {},
      submitAction: '',
      uploadingPastebin: false,
    }
  },

  computed: {
    types() {
      return this.$lang && [
        {id: 'feature-request', name: this.i18n('feature-request')},
        {id: 'bug-report', name: this.i18n('bug-report')},
        {id: 'other', name: this.i18n('other')}
      ]
    }
  },

  watch: {
    // repo(value) {
    //     if (value) updateQuery({repo: value.id})
    // },

    type(value) {
      updateQuery({type: value})
    }
  },

  created() {
    const {type} = getQuery()
    this.repo = {
      id: "noah-nuebling/mac-mouse-fix"
    }
    this.type = type || 'feature-request'
  },

  methods: {
    setLang(lang) {
      this.$lang = lang
      updateQuery({lang})
    },

    findIssues() {
      this.issues = []
      if (this.$refs.content.attrs.title) {
        this.fetchIssues(this.title, {is: 'issue', repo: this.repo.id})
      }
    },

    async submit() {

      console.log("Submitting...")

      // Display loading indicator
      this.uploadingPastebin = true

      // Generate all the necessary values for submitting
      await this.generate() // This uploads to pastebins and is therefore async

      // Disable loading indicator
      this.uploadingPastebin = false

      console.log("Finished submitting.")

      // Create a new email or GH Issue depending on which submit button the user clicked

      if (this.submitAction == 'issue') {
        this.createIssue()
      } else if (this.submitAction == 'email') {
        this.createEmail()
      }
    },

    async generate() {
      this.title = this.$refs.content.attrs.title
      this.label = this.$refs.content.label
      this.generated = await this.$refs.content.generate()
    },

    createIssue() {

      const {title, body, label} = this.creationHelper()
      const url = `https://github.com/noah-nuebling/mac-mouse-fix/issues/new?title=${title}&body=${body}&labels=${label}`

      if (url.length > URL_LIMIT) {
        alert(this.i18n('alert-url-too-long')) // This is a horrible user experience, try to avoid at all cost
        // TODO: Send automatic email with debug info
        window.open(url) // If we used window.location.href here, the alert wouldn't be shown
      } else {
        window.location.href = url
      }
      //window.open(url)
    },
    createEmail() {
      const {title, body, label} = this.creationHelper()
      const url = `mailto:noah.n.public@gmail.com?subject=${title}%20-%20Mac%20Mouse%20Fix%20Feedback%20%5b${label}%5d&body=${body}`
      //window.open(url)
      window.location.href = url
    },
    creationHelper() {
      const title = encodeURIComponent(this.title).replace(/%2B/gi, '+')
      var label = encodeURIComponent(this.label).replace(/%2B/gi, '+')
      const body = encodeURIComponent(this.generated.markdown).replace(/%2B/gi, '+')

      return {title, body, label}
    },
  },

  mounted() {


    // Trying to change the layout when the canvas is smaller, to support smaller screen sizes.
    // This approach almost worked, but it's kinda janky and has some weird edge cases
    // So I resorted to using media queries to do the same thing

    // window.addEventListener("resize", function () {
    //   if (window.innerWidth < 850) {
    //
    //
    //     console.log("HII")
    //
    //     console.log("LIST", document.getElementsByClassName("span-1"))
    //
    //     for (var e of document.getElementsByClassName("span-1")) {
    //
    //       console.log("Element: ", e)
    //
    //       e.classList.remove("span-1")
    //       e.classList.add("used-to-be-span-1", "span-2")
    //     }
    //   }
    //   else {
    //     for (var e of document.getElementsByClassName("used-to-be-span-1")) {
    //       e.classList.remove("span-2", "used-to-be-span-1")
    //       e.classList.add("span-1")
    //     }
    //   }
    // })

  }
}
</script>

<style lang="stylus">
// @import '~@vue/ui/dist/vue-ui.css'
// ^ This interfered with styling v-popover - Should maybe consider removing all vue-ui stuff, as it leads to confusion and interference

@import "../style/vars.styl"

a
  color $link-color

html
  background $global-background-color
  zoom $global-zoom
  min-width $page-width-min

hr
  background-color transparent
  //border-top 1px solid lighten(black, 85%)
  border-top 1px solid lighten(black, 70%)

  //margin 0px $br 0px $br
  margin 0

.small-gap
  grid-gap: 8px

.card-flat
  display flex
  justify-content flex-start
  padding 0
  margin: 0
  border-radius $br
  //border-style solid
  border-color $border-color
  border-width 0.5px
  // background lighten($mouse-fix-accent, 85%)
  background $card-color-dark

// box-shadow $shadow-high

.card-elevation-high
  box-shadow $shadow-card-high, $card-highlight
  border-radius $br

.card-elevation-low
  box-shadow $shadow-card-low, $card-highlight
  border-radius $br

.card
  padding 0
  margin 0
  background $card-color-light

  border-radius $br
  border $card-border

.form-card-padding
  padding 16px
  padding-top 20px

.actionability-card-padding
  padding 12px
  padding-top 16px

@media only screen and (max-width: 700px)
  html
    zoom $global-zoom-mobile
  body
    //background aqua
  .mf-ui-group-button
    font-size 12px
  .span-1
    grid-column: span 2 !important // Didn't use to need !important here, not sure what happened
  .form-card-padding
    padding 12px
    padding-top 16px
  .actionability-card-padding
    padding 8px
    padding-top 16px

</style>

<style lang="stylus" scoped>
@import "../style/imports"

/*v Unnecessary, cause this is the same as the class span-2*/
/*.wide*/
/*  grid-column: span 2*/


.container

  max-width $page-width-max
  margin 0 auto
  box-sizing border-box
  padding 0 8px
  padding-bottom 9px

//.common-fields
//  margin-bottom 20px

.form-actions
  //h-box()
  //box-center()
  display flex
  flex-direction row
  flex-wrap wrap
  justify-content flex-end
  margin 24px 0 0px 0

.app
  // background $global-background-color
.start-region

  display flex
  flex-direction column
  //justify-content flex-start
  align-items stretch

.type-picker
  margin-bottom 46px

.title-sec

  display flex
  flex-direction column
  justify-content flex-start
  // align-items center
  margin 40px 0 38px 0

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
  align-self flex-start
  font-weight bolder
  margin 10px 0 0 0

.mf-submit-btn
  margin 12px 0 0 18px


.footer

  display flex
  flex-direction column
  //border-radius 0

  margin 0 auto
  width 100%
  max-width $page-width-max

  // Margin
  $m = 52px
  $cw-m = 4px // Counterweight for top margin, so it looks evenly spaced from top and bottom
  margin ($m + $cw-m) 0 8px  0

.footer-container
  //margin 0 auto
  //width 100%
  //max-width $page-width-max
  box-sizing border-box

  // Padding
  $pv = 16px
  $ph = 16px
  padding $pv $ph $pv $ph

.footer__text
  //text-align center
  font-size 13px

  $cw = 12px // counterweight
  $m = 2px // margin
  margin-top $m
  margin-bottom $m + $cw

.footer-links
  margin 0 0 0px 0

.footer-links__col
  //margin-left 8px

.footer-links__line
  font-size 11px
  color lighten($mf-ui-color-dark-neutral, 20%)
  display: block
  //text-align center
  margin-left $br
  margin-right $br
  padding-top 8px
  padding-bottom 8px
  border-bottom 1px solid lighten($mf-ui-color-dark-neutral, 70%)

.link-accent
  //color $link-color

// Need this to make some text vertically aligned for some reason


/*.more-indicator*/

/*  visibility hidden*/

/*  display flex*/
/*  justify-content center*/

/*  margin 28px 0 28px 0*/

/*.more-indicator__img*/
/*  fill aqua*/
/*  height 20px*/
/*  width auto*/


</style>
