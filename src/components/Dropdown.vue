<template>
    <a-dropdown :trigger="['click']" @visibleChange="_visible => visible = _visible">
        <div class='textBox'>
            <span class="ellipsis">{{!!text ? text : '请选择'}}</span>
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
                type: String,
                default: '请选择'
            },
            data: Array
        },
        data() {
            return {
                visible: false,
                text: this.value
            }
        },
        methods: {
            itemClick(item) {
                console.log(this.data[item.key])
                this.text = this.data[item.key]
                this.$emit('input',this.text)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .textBox{
        display: flex;
        min-width: 100px;
        height: 40px;
        background: #102D32;
        opacity: 1;
        border-radius: 5px;
        padding: 0 16px;
        box-sizing: border-box;
        align-items: center;
        span{
            flex: 1;
            font-size: 20px;
            color: rgba(255,255,255,.8);
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
