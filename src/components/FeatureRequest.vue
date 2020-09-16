<template>
    <div class="feature-request">
        <div class="vue-ui-grid col-1 default-gap">

            <MFFormField
                    :title="i18n('feature-description-title')"
            >
                <MFInput
                        class="test"
                        :placeholder="i18n('feature-description-placeholder')"
                        type="textarea"
                        rows="3"
                        v-model="attrs.description"
                        required/>
                <!--        <i18n slot="subtitle" id="feature-description-subtitle"/>-->
            </MFFormField>

            <MFFormField
                    :title="i18n('rationale-title')"
            >
                <MFInput
                        :placeholder="i18n('rationale-placeholder')"
                        type="textarea"
                        rows="6"
                        v-model="attrs.rationale"
                        required
                />
                <!--        <i18n slot="subtitle" id="rationale-subtitle"/>-->
            </MFFormField>

            <!--      <MFFormField-->
            <!--        :title="i18n('proposal-title')"-->
            <!--      >-->
            <!--        <MFInput-->
            <!--          placeholder="Describe how you propose to solve the problem and provide code samples of how the API would work once implemented. Note that you can use Markdown to format your code blocks."-->
            <!--          type="textarea"-->
            <!--          rows="4"-->
            <!--          v-model="attrs.proposal"-->
            <!--          required-->
            <!--        />-->
            <!--        <i18n slot="subtitle" id="proposal-subtitle"/>-->
            <!--      </MFFormField>-->

            <MFFormField
                    :title="i18n('additional-info-title')"
            >
                <MFInput
                        :placeholder="i18n('additional-info-placeholder-feature')"
                        type="textarea"
                        rows="4"
                        v-model="attrs.additional"
                />

            </MFFormField>

        </div>
    </div>
</template>

<script>
    import { generate } from '../helpers'

    import MFFormField from "./VueUI/MFFormField";
    import MFInput from "./VueUI/MFInput";

    export default {
        components: {
            MFFormField,
            MFInput
        },
        data () {
            return {
                attrs: {
                    description: '',
                    rationale: '',
                    additional: ''
                },
            }
        },

        methods: {
            generate () {
                const { description, rationale, additional } = this.attrs

                return generate(`
### Description
${description}

### Rationale
${rationale}

### Additional info
${additional}
  `.trim())
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .test
        background-color aqua
        font-weight bolder
        font-size small
</style>