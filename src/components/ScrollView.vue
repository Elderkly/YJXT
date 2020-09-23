<template>
    <div class="scroll-box">
        <div class="scroll-view" :style="{height: this.height + 'px'}" ref="scrollView">
            <slot/>
        </div>
        <div class="scrollBar" ref="scrollBar">
            <div class="thumb" ref="thumb"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ScrollView',
        props: ['height'],
        mounted() {
            //  动态计算滑块高度
            const itemHeight = 51
            const itemNum = 7
            const headerHeight = 50
            const nums = (Number(this.height) - headerHeight) / (itemHeight * itemNum)
            this.$refs.thumb.style.height = `${nums * 100}%`
            console.log(nums)
            this.createListen()
        },
        methods: {
            createListen() {
                // console.log(this.$refs.scrollView)
                this.$refs.scrollView.onscroll = e => {
                    //  可滚动高度 滚动区域高度-滚动条高度
                    const scrollBoxHeight = this.$refs.scrollBar.clientHeight - this.$refs.thumb.clientHeight
                    const bz = this.$refs.scrollBar.clientHeight / (Number(this.height) + 140)
                    const nums = Math.min(this.$refs.scrollView.scrollTop * bz,scrollBoxHeight)
                    console.log(bz,nums)
                    this.$refs.thumb.style.cssText += `margin-top:${nums}px`
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .scroll-view{
        overflow-y: scroll;
    }

    /* 定义滚动条样式 */
    ::-webkit-scrollbar {
        display: none;
    }
    .scrollBar{
        height: 60%;
        width: 2px;
        background: rgba(255,255,255,.3);
        border-radius: 2px;
        position: absolute;
        right: 14px;
        top: 63px;
        .thumb{
            width: 4px;
            /*height: 60px;*/
            background: #18A9C1;
            border-radius: 4px;
            margin-left: -1px;
        }
    }
</style>
