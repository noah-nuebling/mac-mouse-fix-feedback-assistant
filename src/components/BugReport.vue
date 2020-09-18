<template>
  <div class="bug-report" style="margin:0">
    <div class="vue-ui-grid col-2 default-gap">

      <!-- Title -->
      <MFFormField
              :title="i18n('title-title')"
              class="span-3"
      >
        <MFInput
                :placeholder="i18n('title-placeholder-bug')"
                v-model="attrs.title"
                required
                autofocus
                @blur="findIssues"
        />
      </MFFormField>

      <!-- Description -->

      <MFFormField
              :title="i18n('bug-description-title')"
              class="span-3"
      >
        <MFInput
                :placeholder="i18n('bug-description-placeholder')"
                type="textarea"
                rows="3"
                v-model="attrs.description"
                required/>
        <!--        <i18n slot="subtitle" id="feature-description-subtitle"/>-->
      </MFFormField>

      <!-- Steps to reproduce -->

      <MFFormField
              class="span-3"
              :title="i18n('steps-title')"
      >
        <MFInput
                :placeholder="i18n('steps-placeholder')"
                type="textarea"
                rows="6"
                v-model="attrs.steps"
                required
        />
      </MFFormField>

<!--      &lt;!&ndash; Expected outcome &ndash;&gt;-->

<!--      <MFFormField-->
<!--              :title="i18n('expected-title')"-->
<!--      >-->
<!--        <MFInput-->
<!--                type="textarea"-->
<!--                rows="4"-->
<!--                v-model="attrs.expected"-->
<!--                required-->
<!--        />-->
<!--      </MFFormField>-->

<!--      &lt;!&ndash; Actual outcome &ndash;&gt;-->

<!--      <MFFormField-->
<!--              :title="i18n('actual-title')"-->
<!--      >-->
<!--        <MFInput-->
<!--                type="textarea"-->
<!--                rows="4"-->
<!--                v-model="attrs.actual"-->
<!--                required-->
<!--        />-->
<!--      </MFFormField>-->

<!--      &lt;!&ndash; Version &ndash;&gt;-->

<!--      <MFFormField-->
<!--              :title="i18n('version-title')"-->
<!--              :subtitle="i18n('version-subtitle')"-->
<!--              class="span-3"-->
<!--      >-->
<!--        <VueTypeAhead-->
<!--                v-model="attrs.version"-->
<!--                :suggestions="suggestions"-->
<!--                :loading="loadingVersion"-->
<!--                show-all-->
<!--                show-max="30"-->
<!--                restrict-choice-->
<!--                required-->
<!--        />-->
<!--      </MFFormField>-->

      <!-- Context -->

      <MFFormField
              :title="i18n('context-title')"
              class="span-3"
      >
        <MFInput
                :placeholder="i18n('context-placeholder')"
                type="textarea"
                rows="4"
                v-model="attrs.context"
                required
        />
        <i18n slot="subtitle" id="context-subtitle"></i18n>
      </MFFormField>

      <!-- Additional comments -->

      <MFFormField
              :title="i18n('additional-info-title')"
              class="span-3"
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
import { gt, lt } from 'semver'
import { generate } from '../helpers'
import modal from '../mixins/check-modal'

import MFFormField from "./VueUI/MFFormField";
import MFInput from "./VueUI/MFInput";

export default {
  components: {
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

  data () {
    return {
      show: false,
      attrs: {
        title: '',
        description: '',
        version: '',
        context: '',
        steps: '',
        additional: '',
      },
      versions: [],
      loadingVersion: false,
      reproNotAvailable: false
    }
  },

  computed: {
    suggestions () {
      return this.versions
        .slice()
        .sort((a, b) => gt(a.value, b.value) ? -1 : 1)
    },

    isCLI () {
      return this.repo.id === 'vuejs/vue-cli'
    },

    doesNotSupportVueInfo () {
      return this.attrs.version && lt(this.attrs.version, '3.2.0')
    }
  },

  watch: {
    repo () {
      this.versions = []
      this.attrs.version = ''
      this.fetchVersions()
    }
  },

  created () {
    this.fetchVersions()
    this.checkModal('why-repro')
  },

  methods: {
    async fetchVersions (page = 1) {
      this.loadingVersion = true
      const repoId = this.repo.id
      const response = await fetch(`https://api.github.com/repos/${repoId}/releases?page=${page}&per_page=100`)
      const releases = await response.json()

      if (this.repo.id !== repoId) return

      if (!releases || !(releases instanceof Array)) return false

      this.versions = this.versions.concat(releases.map(
        r => ({ value: /^v/.test(r.tag_name) ? r.tag_name.substr(1) : r.tag_name })
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

    generate () {
      const {
        //version,
        description,
        steps,
        context,
        additional
      } = this.attrs

      return generate(`
### Description
${description}

### Steps to reproduce
${steps}

### Context
${context}

### Additional Comments
${additional}
  `.trim())
    }
  },
}
</script>
