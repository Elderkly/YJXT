<template>
    <div class="scroll-box">
        <div class="scroll-view" :style="{height: this.height + 'px'}" ref="scrollView">
            <div ref="slot">
                <slot/>
            </div>
        </div>
        <div :class="!type ? 'scrollBar miniBar' : 'scrollBar'" ref="scrollBar">
            <div class="thumb" ref="thumb"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ScrollView',
        props: ['height','type','itemNum'],
        mounted() {
            //  动态计算滑块高度
            const itemHeight = 51
            const itemNum = this.itemNum
            const headerHeight = 50
            const contentHeight = this.type === 'text' ? this.$refs.slot.clientHeight : itemHeight * itemNum
            //  如果内容高度小于窗口高度则隐藏滚动条
            if (contentHeight < Number(this.height)) {
                this.$refs.scrollBar.style.opacity = 0
            } else {
                const nums = (Number(this.height) - headerHeight) / contentHeight
                this.$refs.thumb.style.height = `${nums * 100}%`
                console.log(nums)
                this.createListen()
            }
        },
        methods: {
            createListen() {
                this.$refs.scrollView.onscroll = e => {
                    /**
                     * 滑块滑行距离 = 滚动高度 / （内容高度 - 盒子高度）
                     * */
                    const {scrollBar,thumb,slot,scrollView} = this.$refs
                    const scrollHeight = scrollView.scrollTop / (slot.clientHeight - Number(this.height))
                    const scrollBoxHeight = scrollBar.clientHeight - thumb.clientHeight
                    const moveHeight = Math.min(scrollHeight * scrollBoxHeight, scrollBoxHeight)
                    this.$refs.thumb.style.cssText += `margin-top:${moveHeight}px`
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
        height: 75%;
        width: 2px;
        background: rgba(255,255,255,.3);
        border-radius: 2px;
        position: absolute;
        right: 14px;
        top: 18%;
        .thumb{
            width: 4px;
            /*height: 60px;*/
            background: #18A9C1;
            border-radius: 4px;
            margin-left: -1px;
        }
    }
    .miniBar{
        height: 62%;
        top: 30%;
    }
</style>
