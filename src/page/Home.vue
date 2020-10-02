<template>
    <div class="home">
        <Box :icon="require('../assets/img/icon-map.png')" title="地图概览" class="map" :headerBlur="true">
            <el-amap
                vid="amapDemo"
                :center="center"
                :zoom="zoom"
                class="amap-demo"
                mapStyle="amap://styles/972a61b58d5599688686f405ac78c956"
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
                    <div class="ellipsis" v-for="item in crossing" @click="center = [item[2],item[3]]">{{item[0]}}}</div>
                </ScrollView>
            </div>
        </Box>
        <Box :icon="require('../assets/img/icon-chart.png')" title="数据分析图" class="chart" :hiddenFloat=true boxClass="chartBigBox">
            <div class="chartBox">
                <div>
                    <div class="chartItemBox">
                        <p>路口</p>
                        <Dropdown :data="crossingList" v-model="LK"/>
                    </div>
                    <div class="chartItemBox">
                        <p>数据类型</p>
                        <Dropdown :data="['流入流出','预警次数']" v-model="YJLX"/>
                    </div>
                    <div class="chartItemBox">
                        <p>分辨率</p>
                        <Dropdown :data="[10,30,60]" v-model="FBL"/>
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
        <Box title="车辆检测实时监控" class="details" :hiddenFloat=true rightButton="收起" @hidden="Details = null" v-if="Details" contentClass="detailsContent">
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
                                           <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? 'rgba(0, 119, 255, 1)' : item.electricQuantity > 20 ? 'rgba(193, 142, 24, 1)' : 'rgba(255, 79, 64, 1)',position: 'absolute',height:'78%'}"/>
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
                                            <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? 'rgba(0, 119, 255, 1)' : item.electricQuantity > 20 ? 'rgba(193, 142, 24, 1)' : 'rgba(255, 79, 64, 1)',position: 'absolute',height:'78%'}"/>
                                            <span>{{item.electricQuantity}}%</span>
                                        </div>
                                        <img src="../assets/img/video.png" class="video" v-if="item.video"/>
                                    </div>
                                </div>
                                <div class="element-details TX-Row-Box" v-for="(item, index) in Details.element" :style="{flexDirection: 'row'}" v-if="index !== 0">
                                    <div>
                                        <p>{{item.name}}</p>
                                        <div class="electricQuantity">
                                            <div :style="{width: item.electricQuantity > 78 ? '78%' : item.electricQuantity + '%', background: item.electricQuantity > 50 ? 'rgba(0, 119, 255, 1)' : item.electricQuantity > 20 ? 'rgba(193, 142, 24, 1)' : 'rgba(255, 79, 64, 1)',position: 'absolute',height:'78%'}"/>
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
    import moment from 'moment';
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
                center: [114.06055,22.540582],
                markers: [],
                windows: [],
                window: '',
                LK: null,
                YJLX: null,
                FBL: null,
                SD: null,
                ED: null,
                crossing: this.$store.getters.crossing,
                list1: [],
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
                playUrl: ''
            }
        },
        computed: {
            poster: function() {
                // return this.posterSrc
                //     ? this.posterSrc
                //     : require("./../assets/images/coveImg.png");
                return require('../assets/img/video.png')
            },
            crossingList() {
                const newList = []
                this.crossing.map(e => newList.push(e[0]))
                return newList
            }
        },
        mounted() {
            this.initMap()
            if (!this.LK) this.initCrossing()
        },
        methods: {
            initMap() {
                /**
                 * 0: "哚基交叉口"
                 1: "yunnan-101"
                 2: "101.554234"
                 3: "25.472808"
                 * */
                let markers = [];
                let windows = [];
                let self = this;

                for (let i = 0 ; i < this.crossing.length ; i ++) {
                    markers.push({
                        position: [Number(this.crossing[i][2]), Number(this.crossing[i][3])],
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
                        <p>${this.crossing[i][0]}</p>
                        <p>路口编号：${this.crossing[i][1]}</p>
                        <p>路口地址：广东省深圳市龙岗区五和路口</p>
                    `
                    const p = document.createElement('p')
                    p.innerHTML = '了解详情'
                    p.onclick = () => this.Details = {
                        action: this.crossing[i][1],
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
                        position: [Number(this.crossing[i][2]) + 0.0028, Number(this.crossing[i][3]) - 0.0023],
                        content: dom,
                        visible: false
                    });
                }
                this.markers = markers;
                this.windows = windows;
                this.center = markers[0] ? markers[0].position : this.center
            },
            initCrossing() {
                if (this.crossing.length > 0) {
                    this.$nextTick(() => {
                        this.LK = this.crossing[0][0]
                        this.YJLX = '预警次数'
                        this.FBL = 10
                        this.SD = moment().format('YYYY-MM-DD')
                        this.ED = moment().format('YYYY-MM-DD')
                        this.submit()
                    })
                }
            },
            //  环图
            createChart1() {
                const windowWidth = document.documentElement.clientWidth
                const chart = new Chart({
                    container: 'c1',
                    autoFit: true,
                    height: windowWidth * 0.13,
                });
                this.chart1 = chart
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
                    .interval({
                        theme: {
                            background: "#000",
                            geometries: {           //  投影
                                interval: {
                                    rect: {
                                        default: {
                                            style: {
                                                lineWidth: 0,
                                                shadowBlur: 20,
                                                shadowOffsetY: 15,
                                                shadowColor: "rgba(86, 165, 255, .4)"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .adjust('stack')
                    .position('percent')
                    .color('item',['rgba(0, 119, 255, 1)','rgba(255, 79, 64, 1)'])
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
                const self = this
                const windowWidth = document.documentElement.clientWidth
                // Step 1: 创建 Chart 对象
                const chart = new Chart({
                    container: 'c2', // 指定图表容器 ID
                    height : windowWidth * 0.145, // 指定图表高度
                    autoFit: true,
                });
                this.chart2 = chart
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
                chart.axis('time', {tickLine: false,label:{
                    autoEllipsis: true,
                    style: {
                        fill: 'rgba(255, 255, 255, 0.8)',
                    }
                }})
                chart.axis('num', {
                    grid: null,
                    line: {
                        style: {
                            lineWidth: 0.5,
                            stroke: '#BFBFBF',
                        },
                    },
                    label: {
                        autoEllipsis: true,
                        style: {
                            // x: 0,
                            fill: 'rgba(255, 255, 255, 0.8)',
                        }
                    }
                })

                //  辅助线
                chart.tooltip({
                    showTitle: false,   //  是否显示标题
                    // marker: {        //  配置鼠标移入时的圆点
                    //     r: 1
                    // },
                    itemTpl: `<div class="tooltip">
                        <img src='https://alipic.lanhuapp.com/xd5f119bbd-a2db-4d5d-a40d-2f02216ea1f5'/>
                        <span>{num}</span>
                    </div>`,
                });

                //  图例
                chart.legend(false);

                //  线条
                chart
                    .line()
                    .position('time*num')
                    .color('type',['rgba(0, 119, 255, 1)','rgba(255, 79, 64, 1)'])
                    .shape('smooth')
                    .size(5)
                    .style({
                        lineCap: 'round',
                        position: 'right',
                        showCrosshairs: false,
                    })
                    .tooltip('num*time', (num, time) => {
                        return {
                            num,
                            time,
                        };
                    })

                //  点
                chart
                    .point()
                    .position('time*num')
                    .color('type',['rgba(0, 119, 255, 1)','rgba(255, 79, 64, 1)'])
                    .shape('circle')
                    .style({
                        fields: [ 'time', 'num' ], // 数据字段
                        callback: (xVal, yVal) => {
                            if (xVal === self.list2[0].time || xVal === self.list2[self.list2.length - 1].time) {
                                return {r: 0}
                            }
                            return {strokeOpacity: 0}
                        }
                    })
                    .size(4.5)
                    .tooltip('num', (num, value) => {
                        return {
                            num
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
            },
            submit() {
                const num = !moment(this.SD).isSame(this.ED) && !moment(this.SD).isBefore(this.ED) ? '结束时间不能小于开始时间' :
                    !this.LK ? '请选择路口' :
                        !this.YJLX ? '请选择预警类型' :
                            !this.FBL ? '请选择分辨率' : null
                if (num) {
                    alert(num)
                } else {
                    this.$fetch.Post('/connect2.php',{
                        start_time: this.SD,
                        end_time: this.ED,
                        datatype: this.YJLX,
                        ratio: String(this.FBL),
                        routename: this.crossing[this.crossing.findIndex(e => e[0] === this.LK)][1]
                    })
                    .then(res => {
                        if (res.code === 200) {
                            this.setChartData(res.data)
                        }
                    })
                    .catch(e => {
                        alert('请求出错')
                    })
                }
            },
            //  重组图标数据
            setChartData(data) {
                if (data.all_out === 0 && data.all_in === 0) {
                    this.list1 = []
                    this.list2 = []
                    this.chart1 && this.chart1.changeData(this.list1)
                    this.chart2 && this.chart2.changeData(this.list2)
                } else {
                    const renderSwitch = this.list1.length === 0
                    const list1 = [
                            { item: '离去车辆', count: data.all_out, percent: data.all_out === 0 && data.all_in === 0 ? 0 : Number((data.all_out / (data.all_out + data.all_in)).toFixed(2)) },
                            { item: '进入车辆', count: data.all_in, percent: data.all_out === 0 && data.all_in === 0 ? 0 : Number((data.all_in / (data.all_out + data.all_in)).toFixed(2)) },
                    ]
                    const list2 = []
                    data.x_time.map((e, index) => {
                        list2.push({
                            time: e,
                            type: 'in',
                            num: data.in[index]
                        })
                        list2.push({
                            time: e,
                            type: 'out',
                            num: data.out[index]
                        })
                    })
                    this.list1 = list1
                    this.list2 = list2
                    if (renderSwitch) {
                            setTimeout(() => {
                                if (this.$route.name !== 'Home') return
                                this.createChart1()
                                this.createChart2()
                            },500)
                    } else {
                        this.chart1.changeData(this.list1)
                        this.chart2.changeData(this.list2)
                    }
                }
            }
        },
        beforeDestroy() {
            this.disposeVideo()
        },
        watch: {
            '$store.getters.crossing': function(newValue) {
                if (newValue.length !== this.crossing.length) {
                    this.crossing = newValue
                    this.initMap()
                    if (!this.LK) this.initCrossing()
                }
            }
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
            width: 1096px;
        }
        .chart{
            margin-left: 32px;
            width: 728px;
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
                    /*background: #102D32;*/
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
                top: 152px;
                background: rgba(255,255,255,.8);;
            }
            button{
                width: 100%;
                height: 40px;
                background: $Button-Color;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                box-shadow: 0px 6px 12px $Button-Shadow-Color;
                cursor: pointer;
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
        border: 1px solid $Border-Color;
        box-sizing: border-box;
        .map-fixedBox-header{
            height: 50px;
            background: $BG;
            backdrop-filter: blur(20px);
            border-bottom: 1px solid $Border-Color;
            box-sizing: border-box;
            font-size: 24px;
            font-weight: bold;
            line-height: 50px;
            position: absolute;
            width: 100%;
            z-index: 10;
            border-radius: 15px 15px 0 0;
        }
        .map-fixedBox-content{
            padding: 0 22px;
            background: $BG;
            backdrop-filter: $Backdrop-Filter;
            border-radius: 22px;
            div{
                height: 50px;
                font-size: 20px;
                color: rgba(255,255,255,.6);
                border-bottom: 1px solid $Border-Color;
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
        width: 1096px;
        position: absolute!important;
    }
    .detailsBox{
        padding: 32px;
        display: flex;
        .details-left{
            width: calc(100% - 380px);
            &>p{
                font-size: 18px;
                color: $Title-Color;
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
            margin-bottom: 5%;
            border: 2px solid $Border-Color;
            border-radius: 15px;
            box-sizing: border-box;
            position: relative;
            .middle-box-header{
                width: calc(100% - 3px);
                height: 50px;
                text-align: center;
                line-height: 50px;
                backdrop-filter: blur(15px);
                border-radius: 15px 15px 0 0;
                border-bottom: 2px solid $Border-Color;
                box-sizing: border-box;
                position: absolute;
                z-index: 10;
                font-size: 20px;
                font-weight: bold;
                color: rgba(255,255,255,.8);
            }
            .middle-box-content{
                height: 100%;
                border-top: none;
                border-radius: 15px 15px;
                overflow: hidden;
                /*backdrop-filter: blur(15px) brightness(0.1);*/
                background-size: 100% 100%;
                p{
                    padding: 0 20px;
                    font-size: 18px;
                    color: rgba(255,255,255,.6);
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
                    right: 220px;
                    bottom: 75px;
                    flex-direction: column;
                    img:first-child{
                        margin-bottom: 47px;
                    }
                }
                .light:nth-child(3){
                    right: 55px;
                    top: 225px;
                    img:first-child{
                        margin-right: 47px;
                    }
                }
                .light:nth-child(4){
                    left: 220px;
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
                    right: 220px;
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
                margin-top: 80px;
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
                    bottom: 340px;
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
