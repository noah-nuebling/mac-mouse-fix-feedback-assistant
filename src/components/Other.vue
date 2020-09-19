<template>
    <div class="other">
        <div class="vue-ui-grid col-1 default-gap">
            <MFFormField
                    :title = "i18n('title-title-other')"
            >
                <MFInput
                        :placeholder="i18n('title-placeholder-other')"
                        v-model="attrs.title"
                        required
                        autofocus
                        @blur="findIssues"
                ></MFInput>
            </MFFormField>

            <MFFormField
                    :title = "i18n('body-title-other')"
            >
                <MFInput
                        :placeholder="i18n('body-placeholder-other')"
                        type="textarea"
                        v-model="attrs.body"
                        rows="6"
                ></MFInput>
            </MFFormField>
        </div>
    </div>
</template>

<script>
    import { generate } from '../helpers'

    import MFFormField from "./VueUI/MFFormField";
    import MFInput from "./VueUI/MFInput";

    export default {
        name: 'Other.vue',
        components: {
            MFFormField,
            MFInput
        },
        data () {
            return {
                attrs: {
                    title: '',
                    body: '',
                },
                label: 'other'
            }
        },

        methods: {
            generate () {
                const { body } = this.attrs

                return generate(`${body}`.trim())
            }
        }
    }
</script>

<style scoped>

</style>