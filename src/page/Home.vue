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
                <ScrollView class="map-fixedBox-content" boxClass="map-fixedBox-scrollBox">
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
            <div class="detailsBox">
                <div class="details-left">
                    <p>当前路口编号</p>
                    <Dropdown :data="Details.list" v-model="Details.action" class="Dropdown"/>
                    <div class="crossing">
                        <div class="SZ" v-if="Details.type === 'crossroad'">
                            <CrossingItem/>
                            <CrossingItem class="SZ-last-crossing" :blur="true" :big="true"/>
                            <div class="light-box">
                                <div class="light" v-for="(item, index) in Details.element">
                                    <img v-for="light in item.passStatus" :src="light ? require('../assets/img/circle-red.png') : require('../assets/img/circle-blue.png')"/>
                                </div>
                            </div>
                           <div class="element-box">
                               <div class="element-details" v-for="(item, index) in Details.element" :style="{flexDirection: index === 0 || index === 2 ? 'column' : 'row'}">
                                   <p :style="{width: index === 0 || index === 2 ? 'auto' : '15px'}" v-if="index === 0 || index === 1">{{item.name}}</p>
                                   <div>
                                       <img :src="item.signalIcon" class="signalIcon"/>
                                       <div class="electricQuantity">
                                           <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? '#18A9C1' : item.electricQuantity > 20 ? '#C18E18' : '#C18E18',position: 'absolute',height:'78%'}"/>
                                           <span>{{item.electricQuantity}}%</span>
                                       </div>
                                       <img src="../assets/img/video.png" class="video" v-if="item.video" @click="openVideo(item)"/>
                                   </div>
                                   <p :style="{width: index === 0 || index === 2 ? 'auto' : '15px'}" v-if="index > 1">{{item.name}}</p>
                               </div>
                           </div>
                        </div>
                        <div class="TX" v-else-if="Details.type === 'TCrossing'">
                            <CrossingItem class="TX-first-crossing" size="small" :big="true" />
                            <CrossingItem class="TX-last-crossing" :blur="true" :big="true"/>
                            <div class="light-box">
                                <div class="light" v-for="(item, index) in Details.element">
                                    <img v-for="light in item.passStatus" :src="light ? require('../assets/img/circle-red.png') : require('../assets/img/circle-blue.png')"/>
                                </div>
                            </div>
                            <div class="element-box">
                                <div class="element-details" v-for="(item, index) in Details.element" :style="{flexDirection: 'row'}" v-if="index === 0">
                                    <p :style="{width: '15px'}">{{item.name}}</p>
                                    <div>
                                        <img :src="item.signalIcon" class="signalIcon"/>
                                        <div class="electricQuantity">
                                            <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? '#18A9C1' : item.electricQuantity > 20 ? '#C18E18' : '#C18E18',position: 'absolute',height:'78%'}"/>
                                            <span>{{item.electricQuantity}}%</span>
                                        </div>
                                        <img src="../assets/img/video.png" class="video" v-if="item.video"/>
                                    </div>
                                </div>
                                <div class="element-details TX-Row-Box" v-for="(item, index) in Details.element" :style="{flexDirection: 'row'}" v-if="index !== 0">
                                    <div>
                                        <p>{{item.name}}</p>
                                        <div class="electricQuantity">
                                            <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? '#18A9C1' : item.electricQuantity > 20 ? '#C18E18' : '#C18E18',position: 'absolute',height:'78%'}"/>
                                            <span>{{item.electricQuantity}}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <img :src="item.signalIcon" class="signalIcon"/>
                                        <img src="../assets/img/video.png" class="video" v-if="item.video"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="RX" v-else>
                            <CrossingItem class="RX-first-crossing" size="mini" :big="true" />
                            <CrossingItem class="RX-last-crossing" :blur="true" :big="true"/>
                            <div class="light-box">
                                <div class="light" v-for="(item, index) in Details.element">
                                    <img v-for="light in item.passStatus" :src="light ? require('../assets/img/circle-red.png') : require('../assets/img/circle-blue.png')"/>
                                </div>
                            </div>
                            <div class="element-box">
                                <div class="element-details RX-Row-Box" v-for="(item, index) in Details.element" :style="{flexDirection: 'row'}" v-if="index === 0">
                                    <div>
                                        <p>{{item.name}}</p>
                                        <img :src="item.signalIcon" class="signalIcon"/>
                                    </div>
                                    <div>
                                        <div class="electricQuantity">
                                            <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? '#18A9C1' : item.electricQuantity > 20 ? '#C18E18' : '#C18E18',position: 'absolute',height:'78%'}"/>
                                            <span>{{item.electricQuantity}}%</span>
                                        </div>
                                        <img src="../assets/img/video.png" class="video" v-if="item.video"/>
                                    </div>
                                </div>
                                <div class="element-details RX-Column-Box" v-for="(item, index) in Details.element" :style="{flexDirection: 'column'}" v-if="index !== 0">
                                    <p>{{item.name}}</p>
                                    <img :src="item.signalIcon" class="signalIcon"/>
                                    <div class="electricQuantity">
                                        <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? '#18A9C1' : item.electricQuantity > 20 ? '#C18E18' : '#C18E18',position: 'absolute',height:'78%'}"/>
                                        <span>{{item.electricQuantity}}%</span>
                                    </div>
                                    <img src="../assets/img/video.png" class="video" :style="{opacity: item.video ? 1 : 0}"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="details-right">
                    <div class="middle-box">
                        <div class="middle-box-header">实时预警检测状态更新</div>
                        <ScrollView class="middle-box-content" boxClass="details-scrollBox" type="text">
                            <div></div>
                            <p>CNN15日题为《随着消费者加入到经济复苏的行列中，中国经济摆脱了全球衰退的影响》的报道称，
                                新冠疫情大流行将全球经济推向低谷，但中国经济正在逆流而上。中国经济已经连续多个月处于复苏模式，现在，消费者也愿意出来花钱了。</p>
                        </ScrollView>
                    </div>
                    <div class="middle-box">
                        <div class="middle-box-header">运行日志信息显示</div>
                        <ScrollView class="middle-box-content" boxClass="details-scrollBox" type="text">
                            <div></div>
                            <p>CNN15日题为《随着消费者加入到经济复苏的行列中，中国经济摆脱了全球衰退的影响》的报道称，新冠疫情大流行将全球经济推向低谷，但中国经济正在逆流而上。中国经济已经连续多个月处于复苏模式，现在，消费者也愿意出来花钱了。

                                　　日本经济新闻16日报道，主要美企的高管15日先后亮相在重庆开幕的中国网上智博会，这凸显了中美科技对抗之际中国市场的战略重要性。美国科技巨头高通、英特尔、惠普在智博会开幕式上演讲，华为、腾讯和百度的高管也出席了会议。

                                　　英国《金融时报》16日报道，在中国的新冠肺炎新增病例降至很低水平，且政府基础设施项目帮助支撑经济活动之后，中国经济复苏的势头增强。

                                　　新加坡《联合早报》15日报道，亚洲开发银行15日发布报告说，中国是亚太地区少数成功摆脱经济低迷的经济体之一。CNN15日题为《随着消费者加入到经济复苏的行列中，中国经济摆脱了全球衰退的影响》的报道称，新冠疫情大流行将全球经济推向低谷，但中国经济正在逆流而上。中国经济已经连续多个月处于复苏模式，现在，消费者也愿意出来花钱了。

                                　　日本经济新闻16日报道，主要美企的高管15日先后亮相在重庆开幕的中国网上智博会，这凸显了中美科技对抗之际中国市场的战略重要性。美国科技巨头高通、英特尔、惠普在智博会开幕式上演讲，华为、腾讯和百度的高管也出席了会议。

                                　　英国《金融时报》16日报道，在中国的新冠肺炎新增病例降至很低水平，且政府基础设施项目帮助支撑经济活动之后，中国经济复苏的势头增强。

                                　　新加坡《联合早报》15日报道，亚洲开发银行15日发布报告说，中国是亚太地区少数成功摆脱经济低迷的经济体之一。</p>
                        </ScrollView>
                    </div>
                </div>
                <div class="video-box" v-if="!!playUrl">
                    <div class="video-box-header">
                        <img src="../assets/img/video.png"/>
                        <span>主单元监视器画面</span>
                        <span @click="disposeVideo">关闭</span>
                    </div>
                    <div class="video-content">
                        <video
                            ref="myVideo"
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            preload="auto"
                            style='width: 100%;height: 100%'
                            :poster="poster"
                        />
                    </div>
                </div>
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
    import CrossingItem from '../components/CrossingItem'
    import videojs from 'video.js'
    import 'videojs-contrib-hls'
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
                Details: null,
                // Details: {
                //     action: 'yuannan-01',
                //     list: ['yuannan-01','yunan-02','yunan-03'],
                //     type: 'crossroad',        //  路口类型  十字 crossroad     T形 TCrossing      人形 PCrossing
                //     element: [
                //         {
                //             name: '主单元',            //  单元名称
                //             signal: 4,                //  信号强度
                //             signalIcon: require('../assets/img/signal-4.png'),//    信号图片
                //             electricQuantity: 80,     //  电量
                //             passStatus: [false, true],//  车辆经过状态 对应每一个灯
                //             video: '123',                //  录像
                //         },
                //         {
                //             name: '一号单元',            //  单元名称
                //             signal: 3,                //  信号强度
                //             signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                //             electricQuantity: 60,     //  电量
                //             passStatus: [false, false],//  车辆经过状态 对应每一个灯
                //             video: '123',                //  录像
                //         },
                //         // {
                //         //     name: '二号单元',            //  单元名称
                //         //     signal: 1,                //  信号强度
                //         //     signalIcon: require('../assets/img/signal-1.png'),//    信号图片
                //         //     electricQuantity: 10,     //  电量
                //         //     passStatus: [false, false],//  车辆经过状态 对应每一个灯
                //         //     video: '123',                //  录像
                //         // },
                //         // {
                //         //     name: '三号单元',            //  单元名称
                //         //     signal: 3,                //  信号强度
                //         //     signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                //         //     electricQuantity: 60,     //  电量
                //         //     passStatus: [false, false],//  车辆经过状态 对应每一个灯
                //         //     video: '123',                //  录像
                //         // },
                //     ]
                // },
                playUrl: ''
            }
        },
        computed: {
            poster: function() {
                // return this.posterSrc
                //     ? this.posterSrc
                //     : require("./../assets/images/coveImg.png");
                return require('../assets/img/video.png')
            }
        },
        mounted() {
            this.initMap()
            setTimeout(() => {
                if (this.$route.name !== 'Home') return
                this.createChart1()
                this.createChart2()
            },500)
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
                    p.onclick = () => this.Details = {
                        action: 'yuannan-01',
                            list: ['yuannan-01','yunan-02','yunan-03'],
                            type: 'crossroad',        //  路口类型  十字 crossroad     T形 TCrossing      人形 PCrossing
                            element: [
                            {
                                name: '主单元',            //  单元名称
                                signal: 4,                //  信号强度
                                signalIcon: require('../assets/img/signal-4.png'),//    信号图片
                                electricQuantity: 80,     //  电量
                                passStatus: [false, true],//  车辆经过状态 对应每一个灯
                                video: '123',                //  录像
                            },
                            {
                                name: '一号单元',            //  单元名称
                                signal: 3,                //  信号强度
                                signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                                electricQuantity: 60,     //  电量
                                passStatus: [false, false],//  车辆经过状态 对应每一个灯
                                video: '123',                //  录像
                            },
                            // {
                            //     name: '二号单元',            //  单元名称
                            //     signal: 1,                //  信号强度
                            //     signalIcon: require('../assets/img/signal-1.png'),//    信号图片
                            //     electricQuantity: 10,     //  电量
                            //     passStatus: [false, false],//  车辆经过状态 对应每一个灯
                            //     video: '123',                //  录像
                            // },
                            // {
                            //     name: '三号单元',            //  单元名称
                            //     signal: 3,                //  信号强度
                            //     signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                            //     electricQuantity: 60,     //  电量
                            //     passStatus: [false, false],//  车辆经过状态 对应每一个灯
                            //     video: '123',                //  录像
                            // },
                        ]
                    },
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
                const windowWidth = document.documentElement.clientWidth
                const chart = new Chart({
                    container: 'c1',
                    autoFit: true,
                    height: windowWidth * 0.11,
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

                            const topFontSize = windowWidth * 0.00729166;
                            const bottomFontSize = windowWidth * 0.009375;
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
                const windowWidth = document.documentElement.clientWidth
                // Step 1: 创建 Chart 对象
                const chart = new Chart({
                    container: 'c2', // 指定图表容器 ID
                    height : windowWidth * 0.12, // 指定图表高度
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
            },
            //  初始化视频组件
            initVideo(){
                return new Promise(resolve => {
                    this.$nextTick(() => {
                        this.myVideo = videojs(this.$refs.myVideo, {
                            bigPlayButton: true,
                            textTrackDisplay: false,
                            posterImage: false,
                            errorDisplay: false,
                            controlBar : false,
                            hls: {
                                withCredentials: true
                            }
                        });
                        resolve()
                    });
                })
            },
            //  打开视频
            openVideo(item) {
                this.playUrl = 'http://1252093142.vod2.myqcloud.com/4704461fvodcq1252093142/48c8a9475285890781000441992/playlist.m3u8'
                if (this.myVideo) {
                    this.myVideo.src({
                        src: this.playUrl,
                        type: 'application/x-mpegURL'
                    })
                    this.myVideo.play()
                } else {
                    this.initVideo().then(() => {
                        this.myVideo.src({
                            src: this.playUrl,
                            type: 'application/x-mpegURL'
                        })
                        this.myVideo.play()
                    })
                }
            },
            //  摧毁视频
            disposeVideo() {
                this.myVideo && this.myVideo.dispose();
                this.myVideo = null
                this.playUrl = null
            }
        },
        beforeDestroy() {
            this.disposeVideo()
        },
        components: {
            Box,
            ScrollView,
            Dropdown,
            DatePicker,
            CrossingItem
        }
    }
</script>

<style lang="scss" scoped>
    .home{
        display: flex;
        align-items: center;
        position: relative;
        .map{
            width: 58%;
        }
        .chart{
            width: 40.5%;
            margin-left: 1.5%;
        }
        &>div{
            height: 85vh;
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
        width: 58%;
        position: absolute!important;
    }
    .detailsBox{
        padding: 32px;
        display: flex;
        .details-left{
            width: calc(100% - 380px);
            &>p{
                font-size: 18px;
                color: rgba(255,255,255,.5);
                margin-bottom: 9px;
            }
            .Dropdown{
                width: 200px;
            }
        }
        .details-right{
            width: 380px;
            position: relative;
        }
        .middle-box{
            /*height: 390px;*/
            margin-bottom: 5%;
            .middle-box-header{
                width: 100%;
                height: 50px;
                text-align: center;
                line-height: 50px;
                background: rgba(24, 169, 193, .15);
                backdrop-filter: blur(15px) ;
                border-radius: 15px 15px 0 0;
                border-bottom: 2px solid rgba(24, 169, 193, .3);
                box-sizing: border-box;
                position: absolute;
                z-index: 10;
                font-size: 20px;
                font-weight: bold;
                color: rgba(255,255,255,.8);
            }
            .middle-box-content{
                height: 100%;
                border: 2px solid rgba(24, 169, 193, .3);
                border-top: none;
                border-radius: 15px 15px;
                overflow: hidden;
                backdrop-filter: saturate(60%) blur(20px) brightness(0.5);
                background: #131c20;
                /*background-image: url("../assets/img/box-bg.png");*/
                background-size: 100% 100%;
                p{
                    padding: 0 20px;
                    font-size: 18px;
                    color: rgba(255,255,255,.5);
                    line-height: 24px;
                }
                div{
                    height: 62px;
                }
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
        .crossing{
            margin-top: 22px;
            margin-right: 32px;
            &>div{
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 590px;
            }
        }
        .SZ{
            .SZ-last-crossing{
                position: absolute;
                transform: rotate(90deg);
                opacity: 1;
            }
            .light-box{
                .light:nth-child(1){
                    left: 58px;
                    bottom: 221px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
                .light:nth-child(2){
                    right: 210px;
                    bottom: 75px;
                    flex-direction: column;
                    img:first-child{
                        margin-bottom: 47px;
                    }
                }
                .light:nth-child(3){
                    right: 55px;
                    top: 220px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
                .light:nth-child(4){
                    left: 210px;
                    top: 75px;
                    flex-direction: column;
                    img:first-child{
                        margin-bottom: 47px;
                    }
                }
            }
            .element-box{
                .element-details:nth-child(1){
                    left: 90px;
                    bottom: 35px;
                    &>div{
                        justify-content: flex-start;
                    }
                }
                .element-details:nth-child(2){
                    right: 85px;
                    bottom: 67px;
                    p{
                        margin-right: 10px;
                    }
                }
                .element-details:nth-child(3){
                    right: 90px;
                    top: 40px;
                    &>div{
                        justify-content: flex-end;
                    }
                }
                .element-details:nth-child(4){
                    left: 85px;
                    top: 75px;
                    p{
                        margin-left: 10px;
                    }
                }
            }
        }
        .TX{
            .TX-first-crossing{
                position: absolute;
                transform: rotate(90deg);
                margin-top: 100px;
            }
            .TX-last-crossing{
                margin-top: -150px;
            }
            .TX-Row-Box{
                &>div{
                    margin-right: 13px;
                    height: 85px;
                    justify-content: center;
                    p{
                       height: 30px;
                        width: 82px;
                        line-height: 40px;
                    }
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .light-box{
                .light:nth-child(1){
                    right: 210px;
                    bottom: 115px;
                    flex-direction: column;
                    img:first-child{
                        margin-bottom: 47px;
                    }
                }
                .light:nth-child(2){
                    left: 58px;
                    bottom: 281px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
                .light:nth-child(3){
                    right: 60px;
                    top: 130px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
            }
            .element-box{
                .element-details:nth-child(1){
                    right: 90px;
                    bottom: 102px;
                    p{
                        margin-right: 10px;
                    }
                }
                .element-details:nth-child(2){
                    left: 40px;
                    bottom: 172px;
                    &>div{
                        justify-content: flex-start;
                    }
                }
                .element-details:nth-child(3){
                    right: 40px;
                    top: 30px;
                    &>div{
                        justify-content: flex-end;
                    }
                }
            }
        }
        .RX{
            .RX-first-crossing{
                position: absolute;
                transform: rotate(130deg);
                margin-top: 100px;
                right: 0;
            }
            .RX-last-crossing{
                margin-top: -270px;
            }
            .RX-Row-Box{
                &>div{
                    margin-right: 5px;
                    height: 85px;
                    justify-content: center;
                    width: 62px;
                    p{
                        height: 30px;
                        width: 82px;
                        line-height: 40px;
                    }
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .RX-Column-Box{
                right: 0px!important;
                bottom: 50px!important;
                &>img:nth-child(2) {
                    transform: translateX(-45px);
                    margin-bottom: 16px;
                }
                &>div:nth-child(3) {
                    transform: translateX(-68px);
                    margin-bottom: 16px;
                    align-items: flex-start;
                }
                &>img:nth-child(4) {
                    transform: translateX(-100px);
                }
            }
            .light-box{
                .light:nth-child(1){
                    left: 70px;
                    bottom: 335px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
                .light:nth-child(2){
                    right: 120px;
                    bottom: 145px;
                    flex-direction: column;
                    img:first-child{
                        margin-bottom: 20px;
                    }
                    img:last-child{
                        transform: translateX(-55px);
                    }
                }
            }
            .element-box{
                .element-details:nth-child(1){
                    left: 70px;
                    bottom: 228px;
                    &>div{
                        justify-content: flex-start;
                    }
                }
                .element-details:nth-child(2){
                    right: 50px;
                    bottom: 102px;
                    p{
                        margin-right: 10px;
                    }
                }
            }
        }
        .light{
            display: flex;
            position: absolute;
            img{
                width: 40px;
            }
        }
        .element-details{
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            &>div{
                width: 70px;
                height: 130px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }
            p{
                font-size: 18px;
                color: rgba(255,255,255,.41);
                margin-bottom: 8px;
            }
            .signalIcon{
                width: 50px;
                margin-bottom: 8px;
            }
            .electricQuantity{
                width: 62px;
                height: 30px;
                background-image: url("../assets/img/cell.png");
                background-size: 100% 100%;
                padding: 4px;
                position: relative;
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                box-sizing: border-box;
                margin-bottom: 8px;
                div{
                    border-radius: 2px;
                }
                span{
                    position: absolute;
                    left: 0;
                    right: 0;
                    margin: auto;
                    text-align: center;
                }
            }
            .video{
                width: 62px;
                margin-bottom: 8px;
                cursor: pointer;
            }
        }
        .video-box{
            width: 640px;
            height: 412px;
            border-radius: 15px;
            background: rgba(24, 169, 193, .15);
            backdrop-filter: blur(15px) ;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            padding: 12px 16px 16px;
            z-index: 20;
            .video-box-header{
                display: flex;
                img{
                    width: 62px;
                }
                span:nth-child(2) {
                    font-size: 23px;
                    font-weight: bold;
                    color: rgba(255,255,255,.8);
                    margin-left: 6px;
                    flex: 1;
                }
                span:nth-child(3) {
                    font-size: 23px;
                    font-weight: bold;
                    color: rgba(24, 169, 193, 1);
                    cursor: pointer;
                }
            }
            .video-content{
                height: 342px;
                border-radius: 9px;
                margin-top: 12px;
                background: #999;
                overflow: hidden;
            }
        }
    }
</style>
