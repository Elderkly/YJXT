<template>
    <div class="home">
        <Box :icon="require('../assets/img/icon-map.png')" title="地图概览" class="map">
            <el-amap
                vid="amapDemo"
                :center="center"
                :zoom="zoom"
                class="amap-demo"
                mapStyle="amap://styles/f766b09906abc805318e0c0e0f16a48f"
                :zooms="[3,16]"
            >
                <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :events="marker.events">
                    <img src="../assets/img/map-markers.png" style="width: 122px"/>
                </el-amap-marker>
                <el-amap-info-window v-if="window" :offset="[5,50]" :closeWhenClickMap="true" :isCustom=true :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
            </el-amap>
            <div class="map-fixedBox">
                <div class="map-fixedBox-header">路口列表</div>
                <ScrollView class="map-fixedBox-content" height='221'>
                    <div></div>
                    <div class="ellipsis">路口1123123112312323</div>
                    <div>路口2</div>
                    <div>路口3</div>
                    <div>路口4</div>
                    <div>路口5</div>
                    <div>路口6</div>
                    <div>路口7</div>
                </ScrollView>
            </div>
        </Box>
        <Box :icon="require('../assets/img/icon-chart.png')" title="数据分析图" class="chart" :hiddenFloat=true>
            <div class="chartBox">
                <div>
                    <div class="chartItemBox">
                        <p>路口</p>
                        <Dropdown :data="['item1','item2','item3']" v-model="LK"/>
                    </div>
                    <div class="chartItemBox">
                        <p>数据类型</p>
                        <Dropdown :data="['预警次数','预警类型','预警demo']" v-model="YJLX"/>
                    </div>
                    <div class="chartItemBox">
                        <p>分辨率</p>
                        <Dropdown :data="['1分钟','1小时','1天']" v-model="FBL"/>
                    </div>
                </div>
                <div>
                    <div class="chartItemBox">
                        <p>时段</p>
                        <DatePicker v-model="SD"/>
                    </div>
                    <div class="line"/>
                    <div class="chartItemBox">
                        <p></p>
                        <DatePicker v-model="ED"/>
                    </div>
                    <div class="chartItemBox">
                        <p></p>
                        <button @click="submit">提交</button>
                    </div>
                </div>
                <div id="c1"></div>
                <div id="c2"></div>
            </div>
        </Box>
        <Box title="车辆检测实时监控" class="details" :hiddenFloat=true rightButton="收起" @hidden="Details = null" v-if="Details">
            <div class="chartBox">

            </div>
        </Box>
    </div>
</template>

<script>
    import Box from '../components/Box'
    import ScrollView from '../components/ScrollView'
    import Dropdown from '../components/Dropdown'
    import DatePicker from '../components/DatePicker'
    import {Chart,getEngine} from "@antv/g2";

    export default {
        data() {
            return {
                zoom: 16,
                center: [121.59996, 31.197646],
                markers: [],
                windows: [],
                window: '',
                LK: null,
                YJLX: '预警次数',
                FBL: '1分钟',
                SD: null,
                ED: null,
                list1: [
                    { item: '离去车辆', count: 4744, percent: 0.55 },
                    { item: '进入车辆', count: 3519, percent: 0.45 },
                ],
                list2: [
                    { month: 'Jan', city: 'Tokyo', temperature: 7 },
                    { month: 'Jan', city: 'London', temperature: 3.9 },
                    { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
                    { month: 'Feb', city: 'London', temperature: 4.2 },
                    { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
                    { month: 'Mar', city: 'London', temperature: 5.7 },
                    { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
                    { month: 'Apr', city: 'London', temperature: 8.5 },
                    { month: 'May', city: 'Tokyo', temperature: 18.4 },
                    { month: 'May', city: 'London', temperature: 11.9 },
                    { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
                    { month: 'Jun', city: 'London', temperature: 15.2 },
                    { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
                    { month: 'Jul', city: 'London', temperature: 17 },
                    { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
                    { month: 'Aug', city: 'London', temperature: 16.6 },
                    { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
                    { month: 'Sep', city: 'London', temperature: 14.2 },
                    { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
                    { month: 'Oct', city: 'London', temperature: 10.3 },
                    { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
                    { month: 'Nov', city: 'London', temperature: 6.6 },
                    { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
                    { month: 'Dec', city: 'London', temperature: 4.8 },
                ],
                Details: null
            }
        },
        mounted() {
            this.initMap()
            this.createChart1()
            this.createChart2()
        },
        methods: {
            initMap() {
                let markers = [];
                let windows = [];

                let num = 10;
                let self = this;

                for (let i = 0 ; i < num ; i ++) {
                    markers.push({
                        position: [121.59996, 31.197646 + i * 0.001],
                        events: {
                            click() {
                                self.windows.forEach(window => {
                                    window.visible = false;         //  窗体是否显示
                                });

                                self.window = self.windows[i];
                                self.$nextTick(() => {
                                    self.window.visible = true;
                                });
                            }
                        }
                    });


                    const dom = document.createElement('div')
                    dom.className = 'prompt'
                    dom.innerHTML = `
                        <p>路口1</p>
                        <p>路口编号：yuannan-101</p>
                        <p>路口地址：广东省深圳市龙岗区五和路口</p>
                    `
                    const p = document.createElement('p')
                    p.innerHTML = '了解详情'
                    p.onclick = () => this.Details = {}
                    dom.appendChild(p)

                    windows.push({
                        position: [121.6035, 31.197646 + i * 0.001 - 0.0035],
                        content: dom,
                        visible: false
                    });
                }
                this.markers = markers;
                this.windows = windows;
            },
            submit() {
                console.log(this.LK,this.YJLX,this.FBL,this.SD,this.ED)
            },
            //  环图
            createChart1() {
                const chart = new Chart({
                    container: 'c1',
                    autoFit: true,
                    height: 200,
                });
                chart.data(this.list1);
                chart.scale('percent', {
                    formatter: (val) => {
                        val = val * 100 + '%';
                        return val;
                    },
                });
                chart.coordinate('theta', {
                    radius: 0.75,
                    innerRadius: 0.6,
                });

                //  提示
                chart.tooltip(false);

                //  图例
                chart.legend(false);

                chart
                    .interval()
                    .adjust('stack')
                    .position('percent')
                    .color('item',['#4da6bf','#ed6046'])
                    // .label('percent', (percent) => {
                    //     return {
                    //         content: (data) => {
                    //             return `${data.item}: <span>${percent * 100}%</span>`;
                    //         },
                    //     };
                    // })
                    .label('percent', {
                        layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
                        offset: 35,
                        labelHeight: 38,
                        content: (obj, item) => {
                            const G = getEngine('canvas');
                            const group = new G.Group({});
                            // 了解 shape 的绘制原理：y0 左下起点 y1 右上起点
                            const [y0, y1] = item.y || [0, 0];
                            const inRight = y0 < y1;
                            const textAlign = inRight ? 'left' : 'right';

                            const topFontSize = 14;
                            const bottomFontSize = 18;
                            group.addShape({
                                type: 'text',
                                attrs: {
                                    x: 0,
                                    y: 0,
                                    text: obj.item,
                                    fill: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: topFontSize,
                                    textAlign,
                                },
                            });

                            group.addShape({
                                type: 'text',
                                attrs: {
                                    x: 0,
                                    y: 4,
                                    text: `${obj.count}(${(obj.percent * 100).toFixed(2)}%)`,
                                    textAlign,
                                    textBaseline: 'top',
                                    fill: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: 700,
                                    fontSize: bottomFontSize,
                                },
                            });

                            if (!inRight) {
                                group.translate(group.getBBox().width, 0);
                            }
                            group.translate(0, topFontSize);
                            return group;
                        },
                        labelLine: {
                            style: {
                                lineWidth: 1.5,
                                stroke: 'rgba(255, 255, 255, .8)',
                            },
                        },
                    })

                chart.interaction('element-active');

                chart.render();
            },
            //  折线图
            createChart2() {
                // Step 1: 创建 Chart 对象
                const chart = new Chart({
                    container: 'c2', // 指定图表容器 ID
                    height : 300, // 指定图表高度
                    autoFit: true,
                });

                //  载入数据源
                chart.data(this.list2);
                //  刻度
                chart.scale({
                    month: {
                        range: [0, 1],
                        nice: true,
                    },
                    temperature: {
                        nice: true,
                    },
                });
                //  刻度线
                chart.axis('month', {tickLine: false})
                chart.axis('temperature', {grid: null,line: {
                        style: {
                            lineWidth: 0.5,
                            stroke: '#BFBFBF',
                        },
                    },})

                //  辅助线
                chart.tooltip({
                    showTitle: false,   //  是否显示标题
                    itemTpl: `<div class="tooltip">
                        <img src='https://alipic.lanhuapp.com/xd5f119bbd-a2db-4d5d-a40d-2f02216ea1f5'/>
                        <span>{temperature}</span>
                    </div>`,
                });

                //  图例
                chart.legend(false);

                //  线条
                chart
                    .line()
                    .position('month*temperature')
                    .color('city',['#ed6046', '#4da6bf'])
                    .shape('smooth')
                    .size(6)
                    .tooltip('temperature', (temperature, value) => {
                        return {
                            temperature,
                        };
                    })
                //  点
                chart
                    .point()
                    .position('month*temperature')
                    .color('city',['#ed6046', '#4da6bf'])
                    .shape('circle')
                    .size(5)
                    .tooltip('temperature', (temperature, value) => {
                        return {
                            temperature
                        };
                    })

                //  渲染图表
                chart.render();
            }
        },
        components: {
            Box,
            ScrollView,
            Dropdown,
            DatePicker
        }
    }
</script>

<style lang="scss" scoped>
    .home{
        display: flex;
        align-items: center;
        .map{
            width: 58.75%;
            margin-right: 32px;
        }
        .chart{
            width: 41.25%;
        }
    }

    .chartBox{
        padding: 16px 36px;
        &>div{
            display: flex;
            margin-bottom: 16px;
            .chartItemBox{
                flex: 1;
                margin-right: 32px;
                p{
                    font-size: 18px;
                    color: rgba(255,255,255,.5);
                    margin-bottom: 4px;
                    height: 26px;
                }
                div{
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
                }
                &:last-child{
                    margin-right: 0;
                }
            }
            .line{
                position: absolute;
                width: 14px;
                height: 2px;
                border-radius: 4px;
                left: 33%;
                top: 212px;
                background: rgba(255,255,255,.8);;
            }
            button{
                width: 100%;
                height: 40px;
                background: rgba(24, 169, 193, 1);
                border: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                box-shadow: 0px 6px 12px rgba(24, 169, 193, 0.4);
                cursor: pointer;
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
    }
    .map-fixedBox{
        position: absolute;
        top: 102px;
        right: 28px;
        width: 194px;
        height: 221px;
        text-align: center;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(24, 169, 193, .3);
        box-sizing: border-box;
        .map-fixedBox-header{
            height: 50px;
            background: rgba(255,255,255,.13);
            backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(24, 169, 193, .3);
            box-sizing: border-box;
            font-size: 24px;
            font-weight: bold;
            line-height: 50px;
            position: absolute;
            width: 100%;
            z-index: 10;
        }
        .map-fixedBox-content{
            padding: 0 22px;
            background: #161f23;
            div{
                height: 50px;
                font-size: 20px;
                color: rgba(255,255,255,.6);
                border-bottom: 1px solid rgba(24, 169, 193, .3);
                line-height: 50px;
                cursor: pointer;
                &:first-child{
                    border: none
                }
            }
        }
    }
    #c2{
        margin-top: 5%;
    }
    .details{
        width: calc(58.75% - 32px);
        position: absolute!important;
    }
</style>
