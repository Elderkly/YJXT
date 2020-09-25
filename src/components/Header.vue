<template>
    <div class="header">
        <span class="header-left">预警系统管理平台</span>
        <div class="header-middle">
            <div :class="selectIndex === 0 ? 'action' : ''" @click="jump(0)">
                <span>主页</span>
                <div/>
            </div>
            <div :class="selectIndex === 1 ? 'action' : ''" @click="jump(1)">
                <span>预警管理</span>
                <div/>
            </div>
        </div>
        <div class="header-right">
            <span>admin，欢迎登录管理系统</span>
            <img src="../assets/img/exit.png">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        data() {
            return {
                selectIndex: this.$route.path === '/' ? 0 : 1
            }
        },
        methods: {
            jump(index) {
                if (index === this.selectIndex) return
                this.selectIndex = index
                const router = index === 0 ? '/' : '/Administer'
                this.$router.push(router)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header{
        height: 80px;
        display: flex;
        align-items: center;
        background-image: url("../assets/img/header-bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: bottom;
        padding: 0 32px;
        box-sizing: border-box;
        justify-content: center;
        .header-left{
            font-size: 30px;
            font-weight: bold;
        }
        .header-middle{
            flex: 1;
            color: rgba(255,255,255,.5);
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            div:first-child{
                margin-right: 28px;
            }
            div{
                cursor: pointer;
                div{
                    width: 100%;
                    height: 4px;
                    background: rgba(0,0,0,0);
                    border-radius: 4px;
                    margin-top: 4px;
                    display: none;
                }
            }
            .action{
                font-size: 24px;
                color: #fff;
                font-weight: bold;
                div{
                    background: #18A9C1;
                    display: block;
                }
            }
        }
        .header-right{
            display: flex;
            align-items: center;
            span{
                font-size: 20px;
                color: rgba(255,255,255,.8);
                margin-right: 32px;
            }
            img{
                width: 34px;
                cursor: pointer;
            }
        }
    }
</style>
