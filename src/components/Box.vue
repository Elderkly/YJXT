<template>
    <div class="dt-box">
        <div class="dt-header">
            <img src="../assets/img/biling.png"/>
            <img :src="icon">
            <span>{{title}}</span>
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
            hiddenFloat: Boolean
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
            img:nth-child(1){
                width: 56%;
                height: 80%;
                position: absolute;
                top: -25px;
            }
            img:nth-child(2){
                width: 34px;
                margin-right: 9px;
            }
            span{
                font-size: 24px;
                font-weight: bold;
            }
        }
        .dt-content{
            /*height: 936px;*/
            height: 85vh;
            border: 2px solid rgba(24, 169, 193, .3);
            border-top: none;
            border-radius: 15px 15px;
            overflow: hidden;
            /*background: rgba(24, 169, 193, .15);*/
            backdrop-filter: saturate(180%) blur(20px);
            background-image: url("../assets/img/box-bg.png");
            background-size: 100% 100%;
        }
        .hiddenFloat{
            padding-top: 60px;
            box-sizing: border-box;
        }
    }
</style>
