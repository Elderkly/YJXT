<template>
    <div class="amap-page-container">
<!--        <el-amap ref="map" vid="amapDemo" :center="center" :zoom="zoom"-->
<!--                 class="amap-demo" mapStyle="amap://styles/f766b09906abc805318e0c0e0f16a48f">-->
<!--            <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :events="marker.events"-->
<!--                            :vid="index">-->
<!--                <img src="https://cn.vuejs.org/images/logo.png" class="items"/>-->
<!--            </el-amap-marker>-->
<!--        </el-amap>-->
        <el-amap
            vid="amapDemo"
            :center="center"
            :zoom="zoom"
            class="amap-demo"
            mapStyle="amap://styles/f766b09906abc805318e0c0e0f16a48f"
            :zooms="[3,16]"
        >
            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :events="marker.events">
                <img src="https://cn.vuejs.org/images/logo.png" class="items"/>
            </el-amap-marker>
            <el-amap-info-window v-if="window" :offset="[5,50]" :closeWhenClickMap="true" :isCustom=true :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
        </el-amap>

        <div class="toolbar">
            <button @click="getMap()">get map</button>
            <button type="button" name="button" v-on:click="addMarker">add marker</button>
            <button type="button" name="button" v-on:click="removeMarker">remove marker</button>
        </div>
        <div class="demo">
            <div class="bg"></div>
            <span>123123</span>
        </div>
        <div id="c1"></div>
        <div id="c2"></div>
    </div>
</template>

<script>
    // import {AMapManager} from 'vue-amap';
    //
    // let amapManager = new AMapManager()
    import {Chart} from '@antv/g2'
    export default {
        data: function () {
            return {
                // zoom: 12,
                // center: [121.59996, 31.197646],
                // markers: [
                //     {
                //         position: [121.5273285, 31.21515044],
                //         events: {
                //             click: () => {
                //                 alert('click marker');
                //             },
                //         },
                //     }
                // ],
                zoom: 16,
                center: [121.59996, 31.197646],
                markers: [],
                windows: [],
                window: '',
                list: [
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
                list2: [
                    { item: '离去车辆', count: 4744, percent: 0.55 },
                    { item: '进入车辆', count: 3519, percent: 0.45 },
                ]
            };
        },
        mounted() {
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

                windows.push({
                    position: [121.601, 31.197646 + i * 0.001],
                    content: `<div class="prompt">${ i * 1000 }</div>`,
                    visible: false
                });
            }

            this.markers = markers;
            this.windows = windows;

            // this.createList()
            this.createList2()
        },
        methods: {
            createList() {
                // Step 1: 创建 Chart 对象
                const chart = new Chart({
                    container: 'c1', // 指定图表容器 ID
                    height : 500, // 指定图表高度
                    autoFit: true,
                });

                //  载入数据源
                chart.data(this.list);
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
                        <img src="https://cn.vuejs.org/images/logo.png" class="items"/>
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
                            temperature
                        };
                    })
                //  点
                chart
                    .point()
                    .position('month*temperature')
                    .color('city',['#ed6046', '#4da6bf'])
                    .shape('circle')
                    .size(5);

                //  渲染图表
                chart.render();
            },
            createList2() {
                const chart = new Chart({
                    container: 'c2',
                    autoFit: true,
                    height: 500,
                });
                chart.data(this.list2);
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
                    .label('percent', (percent) => {
                        return {
                            content: (data) => {
                                return `${data.item}: ${percent * 100}%`;
                            },
                        };
                    })

                chart.interaction('element-active');

                chart.render();
            },
            getMap() {
                // // amap vue component
                // console.log(amapManager._componentMap);
                // // gaode map instance
                // console.log(amapManager._map);
            },
            addMarker() {
                let marker = {
                    position: [121.5273285 + (Math.random() - 0.5) * 0.02, 31.21515044 + (Math.random() - 0.5) * 0.02]
                };
                this.markers.push(marker);
            },
            removeMarker() {
                if (!this.markers.length) return;
                this.markers.splice(this.markers.length - 1, 1);
            }
        }
    };
</script>

<style>
    .amap-page-container {
        height: 300px;
    }

    .amap-demo {
        height: 300px;
    }
    .prompt{
        padding: 25px;
        background: rgba(0,0,0,.9);
        border-radius: 15px;
        color: #fff;
    }
    .items{
        width: 30px;
        height: 30px;
    }
    .demo{
        width: 200px;
        height: 200px;
        position: absolute;
        top: 100px;
        left: 200px;
    }
    .demo span{
        color: #fff;
        position: relative;
    }
    .demo .bg{
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,.2);
        backdrop-filter: saturate(180%) blur(20px);
        /*background: rgba(255,255,255,.7);*/
        position: absolute;
        top: 0;
        /*filter:blur(5px);*/
    }
    .tooltip{
        background: red;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,.2);
        backdrop-filter: saturate(180%) blur(20px);
        padding: 5px 10px;
        border-radius: 3px;
    }
    .g2-tooltip{
        padding: 0!important;
        box-shadow: none!important;
    }
    .g2-tooltip-title{
        display: none
    }
</style>
