<template>
  <div class="bug-report" style="margin:0">
    <div class="vue-ui-grid col-2 small-gap">

      <!-- Title -->
      <MFFormField
          :title="i18n('title-title')"
          class="span-2"
      >
        <MFInput
            :placeholder="i18n('title-placeholder-bug')"
            v-model="attrs.title"
            autofocus
            @blur="$emit('findIssues')"
            required
        />
      </MFFormField>

      <!--      <p-->
      <!--          v-for="i in $data._issues"-->
      <!--      >-->
      <!--        {{i}}-->
      <!--      </p>-->

      <!-- Description -->

      <MFFormField
          :title="i18n('bug-description-title')"
          class="span-2"
      >
        <MFInput
            :placeholder="i18n('bug-description-placeholder')"
            type="textarea"
            rows="3"
            v-model="attrs.description"
            required
        />

        <!--        <i18n slot="subtitle" id="feature-description-subtitle"/>-->
      </MFFormField>

      <!-- Actionability box -->

      <div class="card-flat padding-small padding-small-forehead card-elevation-low actionability-box span-2">

        <div class="actionability-box__desc">
          <div class="actionability-box__desc__content">
            <i18n class="actionability-box__desc__content__text" id="actionability-note-bug"></i18n>
          </div>
          <hr class="actionability-box__desc__rule">
        </div>

        <div class="actionability-box__content vue-ui-grid col-2 small-gap">

          <!-- Steps to reproduce -->

          <MFFormField
              class="span-2"
              :title="i18n('steps-title')"
          >
            <MFInput
                :placeholder="i18n('steps-placeholder')"
                type="textarea"
                rows="6"
                v-model="attrs.steps"
            />
          </MFFormField>

          <!-- Console Logs -->

          <MFFormField
              :title="i18n('console-logs-title')"
              class="span-1"
          >
            <MFInput
                :placeholder="i18n('console-logs-placeholder')"
                type="textarea"
                rows="3"
                v-model="attrs.consoleLogs"
            />
            <i18n id="console-logs-subtitle" slot="subtitle"/>
          </MFFormField>

          <!-- Crash logs -->

          <MFFormField
              :title="i18n('crash-logs-title')"
              class="span-1"
          >
            <MFInput
                :placeholder="i18n('crash-logs-placeholder')"
                type="textarea"
                rows="3"
                v-model="attrs.crashReports"
            />
            <i18n id="crash-logs-subtitle" slot="subtitle"/>
          </MFFormField>
        </div>
      </div>

      <!-- MMF Version -->

      <MFFormField
          :title="i18n('mmf-ver-title')"
          class="span-1"
      >
        <MFTypeAhead
            v-model="attrs.version"
            :suggestions="suggestions"
            :loading="loadingVersion"
            show-all
            show-max="30"
            restrict-choice
            required
        />
      </MFFormField>

      <!-- macOS Version -->

      <MFFormField
          :title="i18n('macos-ver-title')"
          class="span-1"
      >
        <MFInput
            :placeholder="i18n('macos-ver-placeholder')"
            v-model="attrs.macOSVersion"
            required
        />
      </MFFormField>

      <!-- Mouse model -->

      <MFFormField
          :title="i18n('mouse-title')"
          class="span-2"
      >
        <MFInput
            :placeholder="i18n('mouse-placeholder')"
            v-model="attrs.mouse"
        />

      </MFFormField>

      <!-- Additional comments -->

      <MFFormField
          :title="i18n('additional-info-title')"
          class="span-2"
      >
        <MFInput
            :placeholder="i18n('additional-info-placeholder-bug')"
            type="textarea"
            rows="3"
            v-model="attrs.additional"
        />

      </MFFormField>

      <!-- ModalSheet -->

      <VueModal
          v-if="show"
          :title="i18n('repro-modal-title')"
          class="medium"
          @close="show = false"
      >
        <div class="default-body">
          <i18n id="repro-modal"/>
        </div>
      </VueModal>
    </div>
  </div>
</template>

<script>

// Imports

import {gt} from 'semver'
// ^ I don't use semantic versioning, and the "0.9" version name is so far from semVer that this library breaks on it.
// Make sure to use x.x.x format for tag names of github releases, or this will break
import {generate} from '../helpers'
import modal from '../mixins/check-modal'

import MFFormField from "./VueUI/MFFormField";
import MFInput from "./VueUI/MFInput";
import MFTypeAhead from "./VueUI/MFTypeAhead";
import {emptyReplaced} from "../helpers/emptyReplaced";
import {getPastebinWithTimeout} from "@/helpers/getPastebin";

// Constants

const PB_TIMEOUT = 3 * 1000 // In ms // using 5s the browser blocks popup

// Export

export default {
  components: {
    MFTypeAhead,
    MFFormField,
    MFInput
  },
  props: {
    repo: {
      type: Object,
      required: true
    }
  },

  mixins: [modal],

  data() {
    return {
      show: false,
      attrs: {
        title: '',
        description: '',
        version: '',
        steps: '',
        additional: '',
        macOSVersion: '',
        mouse: '',
        consoleLogs: '',
        crashReports: '',
      },
      label: 'bug',
      versions: [],
      loadingVersion: false,
    }
  },

  computed: {
    suggestions() {
      let out = this.versions.slice()
      try {
        return out.sort((a, b) => gt(a.tag_name, b.tag_name) ? -1 : 1)
        // ^ !All github release tag names have to follow semantic versioning for this stuff to work.
        //     So no x.x, always x.x.x - three parts to the version number, otherwise this breaks
      } catch (e) {
        console.log("Couldn't sort release versions by semantic version number. " +
            "This might be because not all releases tag names follow semantic versioning. " +
            "Sorting by commit date instead. Error: ", e)
        return out.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        })
      }
    },
  },

  watch: {
    repo() {
      this.versions = []
      this.attrs.version = ''
      this.fetchVersions()
    }
  },

  created() {
    this.fetchVersions()
    this.checkModal('why-repro')
  },

  methods: {
    async fetchVersions(page = 1) {
      this.loadingVersion = true
      const repoId = this.repo.id
      const response = await fetch(`https://api.github.com/repos/${repoId}/releases?page=${page}&per_page=100`)
      const releases = await response.json()

      // console.log("RELEASES:", releases)

      if (this.repo.id !== repoId) return

      if (!releases || !(releases instanceof Array)) return false

      this.versions = this.versions.concat(releases.map(
          r => ({
            tag_name: r.tag_name,
            value: r.name,
            created_at: r.created_at,
            published_at: r.published_at,
          })
      ))

      const link = response.headers.get('Link')

      if (link && link.indexOf('rel="next"') > -1) {
        await this.fetchVersions(page + 1)
      } else {
        this.loadingVersion = false
      }

      // set current version to the latest
      if (this.suggestions.length) {
        this.attrs.version = this.suggestions[0].value
      }
    },

    async generate() {

      // Practical max length for URLs is 2000 chars (src: https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)
      // So we're uploading some stuff to pastebin if it's too long
      const MAX_LENGTH = 500

      let a = Object.assign({}, this.attrs)

      // Upload stuff to pastebin
      try {
        if (a.consoleLogs.length > MAX_LENGTH) {
          const x = await getPastebinWithTimeout(a.consoleLogs, PB_TIMEOUT)
          if (typeof x === 'string') {
            a.consoleLogs = x
          }
        }
        if (a.crashReports.length > MAX_LENGTH) {
          const x = await getPastebinWithTimeout(a.crashReports, PB_TIMEOUT)
          if (typeof x === 'string') {
            a.crashReports = x
          }
        }
      } catch (e) {
        console.log("An error occured while trying to upload to pastebin. Putting strings into generated message directly.", e)
      }

      a = emptyReplaced(a, '–')

      const {
        description,
        steps,
        consoleLogs,
        crashReports,
        version,
        macOSVersion,
        mouse,
        additional
      } = a

      return generate(`
## Description

${description}

## Steps to reproduce

${steps}

## Context

Mac Mouse Fix Version: ${version}
macOS Version: ${macOSVersion}
Mouse Model: ${mouse}

## Additional Comments

${additional}

---

### Console Logs

${consoleLogs}

### Crash Reports

${crashReports}

`.trim())
    }
  },
}
</script>

<style lang="stylus" scoped>

@import "./../style/vars.styl"

.actionability-box
  margin 6px 0 16px 0


  display flex
  flex-direction column

.actionability-box__content
  padding 0

//  .actionability-box__footer
//    display flex
//    flex-direction column
//
//  .actionability-box__footer__rule
//
//    margin 8px 0px 9px 0px
//    border-radius $br
//    border-top 1.5px solid darken($border-color, 5%)
//    width 100%
//
//  .actionability-box__footer__text
//
//    margin 0px 12px 0px 12px
//
//    font-size 13px
//    font-weight bold
//    color #7f7f7f
//
.actionability-box__desc
  display flex
  flex-direction column

.actionability-box__desc__rule

  margin 12px 0px 16px 0px
  background none
  border-top 1.5px solid darken($border-color, 5%)
  width 100%

.actionability-box__desc__content
  padding 0

// margin 10px 12px 10px 12px

.actionability-box__desc__content__text

  font-size 13px
  // height @font-size // Need to set height and line-height to the same value to center vertically for some reason
  // line-height @font-size

  color #7f7f7f

</style>