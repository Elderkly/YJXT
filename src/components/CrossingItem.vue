<template>
    <div :class="[size === 'large' ? 'crossing-items large-size' : 'crossing-items small-size', blur ? 'blur' : '']">
        <div v-for="(item, index) in [0,1]" :class="[index === 0 ? 'first-crossing' : 'second-crossing']"/>
    </div>
</template>

<script>
    export default {
        name: 'CrossingItem',
        props: {
            size: {
                type: String,
                default: 'large',       //  large/small
            },
            blur: Boolean
        }
    }
</script>

<style lang="scss" scoped>
    .crossing-items{
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            background: linear-gradient(90deg, rgba(37, 66, 72, 0) 0%, rgba(37, 66, 72, 0.8) 52%, rgba(37, 66, 72, 0) 100%);
            &:first-child{
                height: 178px;
                width: 100%;
            }
            &:last-child{
                height: 156px;
                width: 100%;
                position: absolute;
            }
        }
    }
    .blur{
        background: linear-gradient(90deg, rgba(37, 66, 72, 0) 0%, #254248 27%, #254248 49%, #254248 72%, rgba(37, 66, 72, 0) 100%);
        div{
            &:first-child{
                height: 210px;
            }
            &:last-child{
                height: 190px;
            }
        }
    }
    .large-size{
        width: 590px
    }
    .small-size{

    }
</style>
