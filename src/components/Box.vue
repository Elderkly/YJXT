<template>
    <div :class="['dt-box',boxClass ? boxClass : '']">
        <div :class="['dt-header',headerBlur ? 'headerBlur' : '']">
            <img src="../assets/img/biling.png"/>
            <img :src="icon" v-if="icon">
            <span>{{title}}</span>
            <button v-if="rightButton" @click="$emit('hidden')">
                {{rightButton}}
                <img v-if="rightButton === '收起'" src="../assets/img/right.png"/>
            </button>
        </div>
        <div :class="[hiddenFloat ? 'hiddenFloat dt-content' : 'dt-content',contentClass ? contentClass : '']">
            <div class="contentBox">
                <slot/>
            </div>
            <div :style="{backgroundImage: 'url('+ bottomBackground +')'}" class="bottom-biling"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Box',
        props: {
            icon: String,
            title: String,
            hiddenFloat: Boolean,
            rightButton: String,
            contentClass: String,
            boxClass: String,
            bottomBackgroundSize: {
                type: Number,
                default: 2
            },
            headerBlur: {
                type: Boolean,
                deafult: false
            }
        },
        computed: {
            bottomBackground() {
                return this.bottomBackgroundSize === 1 ? require('../assets/img/bottom-biling-1.png') : this.bottomBackgroundSize === 2 ? require('../assets/img/bottom-biling-2.png') : require('../assets/img/bottom-biling-3.png')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dt-box{
        position: relative;
        background: $BG;
        backdrop-filter: $Backdrop-Filter;
        border-radius: 15px;
        // overflow: hidden;
        .dt-header{
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            //background: $BG;
            //backdrop-filter: blur(20px) brightness(0.9);
            border-radius: 15px 15px 0 0;
            border: 2px solid $Border-Color;
            box-sizing: border-box;
            position: absolute;
            z-index: 15;
            &>img:nth-child(1){
                width: 100%;
                height: 100%;
                position: absolute;
                top: -28px;
            }
            &>img:nth-child(2){
                width: 34px;
                margin-right: 9px;
            }
            span{
                font-size: 24px;
                font-weight: bold;
            }
            button{
                min-width: 74px;
                height: 40px;
                background: $Button-Color;
                border: none;
                border-radius: 5px;
                font-size: 20px;
                box-shadow: 0px 6px 12px $Button-Shadow-Color;
                cursor: pointer;
                position: absolute;
                right: 32px;
                line-height: 40px;
                padding: 0 16px;
                img{
                    width: 8px;
                    transform: rotate(-90deg);
                    margin-left: 3px;
                    margin-top: -5px;
                }
            }
            button:focus{
                outline:0;
            }
            button:hover{
                background: $Button-Hover-Color;
            }
            button:active{
                background: $Button-Action-Color;
            }
        }
        .dt-content{
            height: 100%;
            border: 2px solid $Border-Color;
            border-top: none;
            border-radius: 15px 15px;
            overflow: hidden;
            //background: $BG;
            //backdrop-filter: $Backdrop-Filter;
        }
        .hiddenFloat{
            padding-top: 60px;
            box-sizing: border-box;
        }
    }
    .contentBox{
        position: relative;
        z-index: 10;
        height: 100%;
    }
    .bottom-biling{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 70px;
        /*z-index: 5;*/
        background-size: 100%;
        background-position: bottom;
        background-repeat: no-repeat;
    }
    .headerBlur{
        background: $BG;
        backdrop-filter: $Backdrop-Filter;
    }
</style>
