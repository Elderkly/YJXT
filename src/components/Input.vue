<template>
    <input :type="type" :placeholder="placeholder" @input="input" :value="this.text" :disabled="disabled ? 'disabled' : null"/>
</template>

<script>
    export default {
        name: 'Input',
        props: {
            type: {
                type: String,
                default: 'text'
            },
            placeholder: {
                type: String,
                default: '请输入'
            },
            value: String | Number,
            disabled: Boolean
        },
        data() {
            return {
                text: this.value
            }
        },
        methods: {
            input() {
                this.$emit('input', event.target.value)
            }
        },
        watch: {
            value(newValue) {
                this.text = newValue
            }
        }
    }
</script>

<style lang="scss" scoped>
    input{
        width: 100%;
        height: 40px;
        border-radius: 5px;
        border: 0;
        background: $Default-Bg;
        text-indent: 17px;
        color: $Title-Color;
        font-size: $Placeholder-Font-Size;
        outline:none;
    }
    input::-webkit-input-placeholder{
        color: $Placeholder-Color;
        font-size: $Placeholder-Font-Size;
    }
</style>
