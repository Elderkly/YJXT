<template>
    <div @click="visible = true" class="calendarBox" ref="calendarBox">
        <div class='textBox'>
            <span :class="['ellipsis',!text ? 'defaultColor' : '']">{{!!text ? text : '请选择'}}</span>
            <img src="../assets/img/calendar.png" class="calendar">
        </div>
        <a-date-picker :allowClear="false" :locale="locale" :style="{position:'absolute',left:0,opacity:visible ? 1 : 0,zIndex:visible ? 10 : -1}" class="data-picker" :open="visible" @change="panelChange" :disabled-date="disabledDate"/>
    </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
    export default {
        name: 'DatePicker',
        props: {
            value: {
                type: String,
                default: '请选择'
            }
        },
        data() {
            return {
                moment,
                locale,
                text: this.value,
                visible: false,
            }
        },
        methods: {
            disabledDate(current) {
                // Can not select days before today and today
                // return current && current < moment().endOf('day');
            },
            panelChange(date, dateString) {
                this.text = dateString
                this.visible = false
                this.$emit('input',dateString)
            },
            setUpVisible(e) {
                const _con = this.$refs.calendarBox;   // 设置目标区域
                const calendar = document.querySelector('.ant-calendar')
                if (_con !== e.target && !_con.contains(e.target) && !calendar.contains(e.target)) {
                    this.visible = false
                }
            }
        },
        watch: {
            visible(newValue) {
                if (newValue) {
                    document.body.addEventListener('mouseup',this.setUpVisible)
                } else {
                    document.body.removeEventListener('mouseup',this.setUpVisible)
                }
            },
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
        width: 100%;
        cursor: pointer;
        span{
            flex: 1;
            font-size: 20px;
            color: $Title-Color;
        }
        .calendar{
            width: 18px;
        }
    }
    .calendarBox{
        position: relative;
        padding: 0!important;
    }
    .defaultColor{
        color: $Placeholder-Color!important;
    }
    /*@media screen and (max-width: 1650px){*/
    /*    .textBox{*/
    /*        span{*/
    /*            font-size: 13px;*/
    /*        }*/
    /*    }*/
    /*}*/
    /*@media screen and (max-width: 1450px){*/
    /*    .textBox{*/
    /*        span{*/
    /*            font-size: 10px;*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
