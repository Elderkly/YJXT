<template>
    <div :class="[size === 'large' ? 'crossing-items large-size' : size === 'mini' ? 'crossing-items mini-size' : 'crossing-items small-size', blur ? 'blur' : '',big ? 'big' : '']">
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
            blur: Boolean,
            big: Boolean
        }
    }
</script>

<style lang="scss" scoped>
    .crossing-items{
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            background: linear-gradient(90deg, rgba(0, 119, 255, 0) 0%, #0077FF 51%, rgba(0, 119, 255, 0) 100%);;
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
    .blur div:last-child{
        background: linear-gradient(90deg, rgba(0, 119, 255, 0) 0%, #0077FF 27%, #0077FF 49%, #0077FF 71%, rgba(0, 119, 255, 0) 100%);
    }
    .big{
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
        width: 400px;
    }
    .mini-size{
        width: 380px;
    }
</style>
