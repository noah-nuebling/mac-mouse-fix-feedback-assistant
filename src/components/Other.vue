<template>
    <div class="other">
        <div class="vue-ui-grid col-1 small-gap">
            <MFFormField
                    :title = "i18n('title-title-other')"
            >
                <MFInput
                        type='textarea'
                        rows="1"
                        :placeholder="i18n('title-placeholder-other')"
                        v-model="attrs.title"
                        required
                        autofocus
                        @blur="$emit('findIssues')"
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
                        required
                ></MFInput>
            </MFFormField>
        </div>
    </div>
</template>

<script>
    import { generate } from '../helpers'

    import MFFormField from "./MFUI/MFFormField";
    import MFInput from "./MFUI/MFInput";
    import {emptyReplaced} from "../helpers/emptyReplaced";

    import { getQuery } from "../helpers"

    export default {
        name: 'Other',
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
        async created() {
            const { title, body } = getQuery();
            if (title) this.attrs.title = title
            if (body)  this.attrs.body = body
        },
        methods: {
            generate () {
                const a = emptyReplaced(this.attrs, '–')
                const { body } = a

                return generate(`${body}`.trim())
            }
        }
    }
</script>

<style scoped>
</style>