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

        <div class="common-fields vue-ui-grid col-2 small-gap">

          <!-- Main input fields -->

          <div class="card card-large-forehead card-elevation-high span-2">

            <!-- content component -->


            <keep-alive>
              <component
                      :is="type"
                      ref="content"
                      :repo="repo"
                      @findIssues="findIssues()"
              />
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

      <div class="card-flat">
        <i18n
                v-if="this.type == 'bug-report'"
                id="thank-you-bug"
                class="thank-you-text"
        />
        <i18n
                v-if="this.type == 'feature-request'"
                id="thank-you-feature"
                class="thank-you-text"
        />
        <i18n
                v-if="this.type == 'other'"
                id="thank-you-other"
                class="thank-you-text"
        />
      </div>

      <footer class="app-footer">
        <p>&hellip;</p>
        <small>
          <span class="line">
            Visit the Mac Mouse Fix <a href="https://noah-nuebling.github.io/mac-mouse-fix-website/">Website</a>
          </span>
          &centerdot;
          <span class="line">
            Check out the source code on <a href="https://github.com/noah-nuebling/mac-mouse-fix-issue-helper">GitHub</a>
          </span>
          &centerdot;
          <span class="line">
            Based on <a href="https://new-issue.vuejs.org/?repo=vuejs/vue">Vue Issue Helper</a>
          </span>
        </small>
      </footer>
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
                window.open(url)

            },
            createEmail() {
                const {title, body, label} = this.creationHelper()
                const url = `mailto:noah.n.public@gmail.com?subject=${title}%20-%20Mac%20Mouse%20Fix%20Feedback%20%5b${label}%5d&body=${body}`
                window.open(url)
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
  // ^ This interfered with styling v-popover - Should maybe consider removing all vue-ui stuff, as I don't think I need it

  @import "../style/vars.styl"

  a
    color $link-color

  html

    background $global-background-color
    zoom 122%
    min-width $page-width-min

  .small-gap
    grid-gap: 8px


  .card-flat
    display flex
    justify-content flex-start
    padding 12px 12px 12px 12px
    margin-bottom: 48px
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
    padding 16px 16px 16px 16px

    margin-bottom: 48px
    background $card-color-light

    border-radius $br
    border $card-border

    //
    @media (max-width: 700px)
      .span-1
        grid-column: span 2

        body
          background aqua
  .line
    display: inline-block

  .card-large-forehead
    padding-top 20px

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

  /*background-color aqua*/

  .common-fields
    margin-bottom 20px

  .form-actions
    //h-box()
    //box-center()
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content flex-end
    margin 24px 0 0px 0

  .app-footer

    text-align center
    margin 24px 0

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
    margin 38px 0 38px 0

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


  .thank-you-text
    //border solid
    font-size 14px
    padding-top: 8px  // Need this to make some text vertically aligned for some reason



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
