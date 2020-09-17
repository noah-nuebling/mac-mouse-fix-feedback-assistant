<template>
  <div class="bug-report" style="margin:0">
    <div class="vue-ui-grid col-2 default-gap">

      <!-- Title -->
      <MFFormField
              :title="i18n('title-title')"
              class="span-2"
      >
        <MFInput
                :placeholder="i18n('title-placeholder-bug')"
                v-model="attrs.title"
                required
                autofocus
                @blur="findIssues"
        />
      </MFFormField>

      <!-- Version -->

      <MFFormField
        :title="i18n('version-title')"
        :subtitle="i18n('version-subtitle')"
      >
        <VueTypeAhead
          v-model="attrs.version"
          :suggestions="suggestions"
          :loading="loadingVersion"
          show-all
          show-max="30"
          restrict-choice
          required
        />
      </MFFormField>

      <!-- Browser and OS-->

      <MFFormField
        v-if="false"
        :title="i18n('browser-and-os-title')"
      >
        <MFInput
          v-model="attrs.browserAndOS"
          required
        />

        <i18n
          slot="subtitle"
          id="browser-and-os-subtitle"
        />
      </MFFormField>

      <!-- Weird conditional stuff -->

      <template v-else>

        <!-- Node and OS-->
        <MFFormField
          v-if="isCLI && doesNotSupportVueInfo"
          :title="i18n('node-and-os-title')"
        >
          <MFInput
            v-model="attrs.nodeAndOS"
            required
          />

          <i18n
            slot="subtitle"
            id="node-and-os-subtitle"
          />
        </MFFormField>

        <!-- Cli env -->
        <MFFormField
          v-else-if="isCLI"
          :title="i18n('cli-envinfo-title')"
          class="span-2"
        >
          <MFInput
            v-model="attrs.cliEnvInfo"
            type="textarea"
            required
          />

          <i18n
            slot="subtitle"
            id="cli-envinfo-subtitle"
          />
        </MFFormField>

        <!-- Minimal reproduction -->
        <MFFormField :title="i18n('repro-title')">
          <MFInput
            type="url"
            v-model="attrs.reproduction"
            :disabled="isCLI && reproNotAvailable"
            required
          />

          <template slot="subtitle">
            <i18n
              :id="repo.reproSubtitleId || 'repro-subtitle'"
              @click-modal="show = true"
            />
            <VueSwitch v-if="isCLI" v-model="reproNotAvailable">
              <i18n id="cli-no-repro"/>
            </VueSwitch>
          </template>
        </MFFormField>
      </template>

      <!-- Steps to reproduce -->

      <MFFormField
        class="span-2"
        :title="i18n('steps-title')"
      >
        <MFInput
          type="textarea"
          rows="4"
          v-model="attrs.steps"
          required
        />
        <i18n slot="subtitle" id="steps-subtitle"/>
      </MFFormField>

      <!-- Expected outcome -->

      <MFFormField
        :title="i18n('expected-title')"
      >
        <MFInput
          type="textarea"
          rows="4"
          v-model="attrs.expected"
          required
        />
      </MFFormField>

      <!-- Actual outcome -->

      <MFFormField
        :title="i18n('actual-title')"
      >
        <MFInput
          type="textarea"
          rows="4"
          v-model="attrs.actual"
          required
        />
      </MFFormField>

      <!-- Additional comments -->

      <MFFormField
        class="span-2"
        :title="i18n('extra-title')"
        :subtitle="i18n('extra-subtitle')"
      >
        <MFInput
          type="textarea"
          rows="4"
          v-model="attrs.extra"
        />
      </MFFormField>
    </div>

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
        version: '',
        reproduction: '',
        steps: '',
        expected: '',
        actual: '',
        extra: '',
        browserAndOS: '',
        nodeAndOS: '',
        cliEnvInfo: '',
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
        version,
        reproduction,
        steps,
        expected,
        actual,
        extra,
        browserAndOS,
        nodeAndOS,
        cliEnvInfo
      } = this.attrs

      return generate(`
### Version
${version}

${reproduction ? `### Reproduction link
[${reproduction}](${reproduction})` : ``}

${browserAndOS ? `### Browser and OS info
${browserAndOS}` : ``}

${nodeAndOS ? `### Node and OS info
${nodeAndOS}` : ``}

${cliEnvInfo ? `### Environment info
\`\`\`
${cliEnvInfo}
\`\`\`
` : ``}

### Steps to reproduce
${steps}

### What is expected?
${expected}

### What is actually happening?
${actual}

${extra ? `---\n${extra}` : ''}
  `.trim())
    }
  },
}
</script>
