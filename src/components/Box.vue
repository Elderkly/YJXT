<template>
    <div class="dt-box">
        <div class="dt-header">
            <img src="../assets/img/biling.png"/>
            <img :src="icon" v-if="icon">
            <span>{{title}}</span>
            <button v-if="rightButton" @click="$emit('hidden')">
                {{rightButton}}
                <img src="../assets/img/right.png"/>
            </button>
        </div>
        <div :class="hiddenFloat ? 'hiddenFloat dt-content' : 'dt-content'">
            <slot/>
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
            rightButton: String
        }
    }
</script>

<style lang="scss" scoped>
    .dt-box{
        position: relative;
        .dt-header{
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,.13);
            backdrop-filter: saturate(180%) blur(20px);
            border-radius: 15px 15px 0 0;
            border: 2px solid rgba(24, 169, 193, .3);
            box-sizing: border-box;
            position: absolute;
            z-index: 10;
            &>img:nth-child(1){
                width: 56%;
                height: 80%;
                position: absolute;
                top: -25px;
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
                width: 96px;
                height: 40px;
                background: rgba(24, 169, 193, 1);
                border: none;
                border-radius: 5px;
                font-size: 20px;
                box-shadow: 0px 6px 12px rgba(24, 169, 193, 0.4);
                cursor: pointer;
                position: absolute;
                right: 32px;
                line-height: 40px;
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
                background: rgba(24, 169, 193, .7);
            }
            button:active{
                background: rgba(24, 169, 193, .2);
            }
        }
        .dt-content{
            /*height: 936px;*/
            height: 85vh;
            border: 2px solid rgba(24, 169, 193, .3);
            border-top: none;
            border-radius: 15px 15px;
            overflow: hidden;
            backdrop-filter: saturate(180%) blur(20px);
            background: rgba(24, 169, 193, .15);
            /*background-image: url("../assets/img/box-bg.png");*/
            background-size: 100% 100%;
        }
        .hiddenFloat{
            padding-top: 60px;
            box-sizing: border-box;
        }
    }
</style>
