<template>
    <a-dropdown :trigger="['click']" @visibleChange="_visible => visible = _visible" :overlayClassName="overlayClassName">
        <div class='textBox'>
            <span :class="['ellipsis',!text ? 'defaultColor' : '']">{{!!text ? text : '请选择'}}</span>
            <img v-if="!visible" src="../assets/img/right.png">
            <img v-else src="../assets/img/down.png" class="down">
        </div>
        <a-menu slot="overlay">
            <a-menu-item v-for="(item,index) in data" :key="index" @click="itemClick">
                {{item}}
            </a-menu-item>
        </a-menu>
    </a-dropdown>
</template>

<script>
    export default {
        name: 'Dropdown',
        props: {
            value: {
                type: String | Number,
                default: '请选择'
            },
            data: Array,
            overlayClassName: String
        },
        data() {
            return {
                visible: false,
                text: this.value
            }
        },
        methods: {
            itemClick(item) {
                this.text = this.data[item.key]
                this.$emit('input',this.text)
                this.$emit('change',this.text)
            }
        },
        watch: {
            value(newValue){
                this.text = newValue
            }
        }
    }
</script>

<style lang="scss" scoped>
    .textBox{
        display: flex;
        min-width: 100px;
        height: 40px;
        background: $Default-Bg;
        opacity: 1;
        border-radius: 5px;
        padding: 0 16px;
        box-sizing: border-box;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        span{
            flex: 1;
            font-size: $Placeholder-Font-Size;
            color: $Title-Color;
        }
        .defaultColor{
            color: $Placeholder-Color;
        }
        img{
            width: 8px;
        }
        .down{
            width: 16px;
        }
    }
    /*@media screen and (max-width: 1650px){*/
    /*    .textBox{*/
    /*        span{*/
    /*            font-size: 15px;*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
