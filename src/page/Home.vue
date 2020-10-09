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
                    <div class="ellipsis" v-for="item in crossing" @click="moveMap([item[2],item[3]])">{{item[0]}}</div>
                </ScrollView>
            </div>
        </Box>
        <Box :icon="require('../assets/img/icon-chart.png')" title="数据分析图" class="chart" :hiddenFloat=true boxClass="chartBigBox">
            <div class="chartBox">
                <div>
                    <div class="chartItemBox">
                        <p>路口</p>
                        <Dropdown :data="crossingList" v-model="LK" overlayClassName="HomeDropDown" class="HomeDropDownBox"/>
                    </div>
                    <div class="chartItemBox">
                        <p>数据类型</p>
                        <Dropdown :data="['预警次数','方向流量','电压变化','车速变换']" v-model="YJLX"/>
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
        <Details v-model="crossingDetails" v-if="crossingDetails.code" @close="crossingDetails = {}"/>
    </div>
</template>

<script>
    import moment from 'moment';
    import Box from '../components/Box'
    import ScrollView from '../components/ScrollView'
    import Dropdown from '../components/Dropdown'
    import DatePicker from '../components/DatePicker'
    import {Chart,getEngine} from "@antv/g2";
    import Details from './Details'
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
                list2: [],
                crossingDetails: {},     //  当前显示详情的路口信息
            }
        },
        computed: {
            // poster: function() {
            //     // return this.posterSrc
            //     //     ? this.posterSrc
            //     //     : require("./../assets/images/coveImg.png");
            //     return require('../assets/img/video.png')
            // },
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
            moveMap(center) {
                if (this.window.visible) {
                    this.windows.forEach(window => {
                        window.visible = false;
                    });
                    this.window.visible = false
                }
                setTimeout(() => {
                    this.center = center
                },100)
            },
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
                        <p>路口地址：${this.crossing[i][0]}</p>
                    `
                    const p = document.createElement('p')
                    p.innerHTML = '了解详情'
                    p.onclick = () =>  this.crossingDetails = {
                        code: this.crossing[i][1],
                        name: this.crossing[i][0]
                    }
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
                    // height: windowWidth * 0.10,
                    height: this.getPx(230)
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

                 chart.tooltip(false)
                //  提示
                // chart.tooltip({
                //     showTitle: false,   //  是否显示标题
                //     itemTpl: `<div class="tooltip">
                //         <img src='https://alipic.lanhuapp.com/xd5f119bbd-a2db-4d5d-a40d-2f02216ea1f5'/>
                //         <span>{item}: {percent}%</span>
                //     </div>`,
                // });

                //  图例
                // chart.legend(false);
                chart.legend({
                    position: 'left',
                    background: {
                        padding: [this.getPx(10),0,0,this.getPx(200)],
                        style: {
                            strokeOpacity: 0
                        }
                    },
                    itemHeight: this.getPx(40),
                    itemName: {
                        style: {
                            fontSize: this.getPx(15),
                            fill: 'rgba(255, 255, 255, 0.7)',
                        }
                    },
                });
                chart.removeInteraction('legend-filter')

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
                                                shadowBlur: this.getPx(20),
                                                shadowOffsetY: this.getPx(10),
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
                    .color('item',['#0077FF','#FF4F40','#FF8640','#57CFE3'])
                    // .tooltip('item*percent', (item, percent) => {
                    //     return {
                    //         item,
                    //         percent: percent * 100,
                    //     };
                    // })
                    // .label('percent', {
                    //     offset: -40,
                    //     style: {
                    //         textAlign: 'center',
                    //         fontSize: 12,
                    //         shadowBlur: 2,
                    //         shadowColor: 'rgba(0, 0, 0, .45)',
                    //         fill: '#fff',
                    //     },
                    // })
                    .label('percent', (percent) => {
                        const obj = percent === 0 ? {
                            offset: -40,
                            style: {
                                textAlign: 'center',
                                fontSize: 0,
                                shadowBlur: 2,
                                shadowColor: 'rgba(0, 0, 0, .45)',
                                fill: '#fff',
                            }
                        } : {
                            offset: this.getPx(-18),
                            style: {
                                textAlign: 'center',
                                fontSize: this.getPx(13),
                                fill: 'rgba(255, 255, 255, .6)',
                            },
                            autoRotate: false
                        }
                        return obj
                    })
                    // .label('percent', {
                    //     layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
                    //     offset: 5,
                    //     labelHeight: 38,
                    //     content: (obj, item) => {
                    //         const G = getEngine('canvas');
                    //         const group = new G.Group({});
                    //         // 了解 shape 的绘制原理：y0 左下起点 y1 右上起点
                    //         const [y0, y1] = item.y || [0, 0];
                    //         const inRight = y0 < y1;
                    //         const textAlign = inRight ? 'left' : 'right';
                    
                    //         const topFontSize = windowWidth * 0.006;
                    //         const bottomFontSize = windowWidth * 0.009375;
                    //         group.addShape({
                    //             type: 'text',
                    //             attrs: {
                    //                 x: 0,
                    //                 y: 0,
                    //                 text: obj.item,
                    //                 fill: 'rgba(255, 255, 255, 0.5)',
                    //                 fontSize: topFontSize,
                    //                 textAlign,
                    //             },
                    //         });
                    
                    //         group.addShape({
                    //             type: 'text',
                    //             attrs: {
                    //                 x: 0,
                    //                 y: 4,
                    //                 text: `${obj.count}(${(obj.percent * 100).toFixed(2)}%)`,
                    //                 textAlign,
                    //                 textBaseline: 'top',
                    //                 fill: 'rgba(255, 255, 255, 0.8)',
                    //                 fontWeight: 700,
                    //                 fontSize: bottomFontSize,
                    //             },
                    //         });
                    
                    //         if (!inRight) {
                    //             group.translate(group.getBBox().width, 0);
                    //         }
                    //         group.translate(0, topFontSize);
                    //         return group;
                    //     },
                    //     labelLine: {
                    //         style: {
                    //             // lineWidth: 1.5,
                    //             stroke: 'rgba(255, 255, 255, .8)',
                    //         },
                    //     },
                    // })

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
                    // height : windowWidth * 0.125, // 指定图表高度
                    height: this.getPx(250),
                    autoFit: true,
                });
                this.chart2 = chart
                //  载入数据源
                chart.data(this.list2);
                let maxNum = 0
                this.list2.map(e => maxNum = e.num > maxNum ? e.num : maxNum)
                //  刻度
                chart.scale({
                    num: {
                        min: 0,
                        max: maxNum + 5,
                    },
                    time: {
                        type: 'time'
                    },
                });
                //  刻度线
                chart.axis('time', {
                    tickLine: false,
                    label:{
                        autoHide: true,
                        autoEllipsis: true,
                        autoRotate: false,
                        style: {
                            fill: 'rgba(255, 255, 255, 0.8)',
                            fontSize: 10
                        },
                        formatter: (text, item, index) => {
                            // console.log(this.list2[index].time.split(' ')[1])
                            return this.list2[index].time.split(' ')[1]
                        }
                    },
                    line: {
                        style: {
                            lineWidth: 0.5,
                            stroke: '#BFBFBF',
                        },
                    },
                    grid: 'line'
                })
                chart.axis('num', {
                    grid: null,
                    line: {
                        style: {
                            lineWidth: 0.5,
                            stroke: '#BFBFBF',
                        },
                    },
                    label: {
                        autoHide: true,
                        autoEllipsis: true,
                        style: {
                            fill: 'rgba(255, 255, 255, 0.8)',
                        }
                    }
                })

                //  辅助线
                chart.tooltip({
                    showTitle: false,   //  是否显示标题
                    marker: {        //  配置鼠标移入时的圆点
                        r: 3
                    },
                    itemTpl: `<div class="tooltip">
                        <img src='https://alipic.lanhuapp.com/xd5f119bbd-a2db-4d5d-a40d-2f02216ea1f5'/>
                        <span>{num}</span>
                    </div>`,
                });

                //  图例
                // chart.legend(false);
                chart.legend({
                    itemName: {
                        style: {
                            fontSize: this.getPx(15),
                            fill: 'rgba(255, 255, 255, 0.7)',
                        }
                    },
                });

                //  线条
                chart
                    .line()
                    .position('time*num')
                    .color('type',['#0077FF','#FF4F40','#FF8640','#57CFE3'])
                    .shape('smooth')
                    .size(3.5)
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
                    .color('type',['#0077FF','#FF4F40','#FF8640','#57CFE3'])
                    .shape('circle')
                    // .style({
                    //     fields: [ 'time', 'num' ], // 数据字段
                    //     callback: (xVal, yVal) => {
                    //         if (xVal === self.list2[0].time || xVal === self.list2[self.list2.length - 1].time) {
                    //             return {r: 0}
                    //         }
                    //         return {strokeOpacity: 0}
                    //     }
                    // })
                    .size(0)
                    .tooltip('num', (num, value) => {
                        return {
                            num
                        };
                    })

                //  渲染图表
                chart.render();
            },
            submit() {
                const num = !moment(this.SD).isSame(this.ED) && !moment(this.SD).isBefore(this.ED) ? '结束时间不能小于开始时间' :
                    !this.LK ? '请选择路口' :
                        !this.YJLX ? '请选择预警类型' :
                            !this.FBL ? '请选择分辨率' : null
                if (num) {
                    this.$message.warning(num);
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
                        console.log('connect2请求出错:',e)
                        this.$message.error('connect2请求出错');
                    })
                }
            },
            //  截取时间
            getTime(time){
                return time
                try{
                    return time.split(' ')[0].split('-')[2] + '日' + time.split(' ')[1].split(':')[0] + '时'
                    // return time.split(':')[0] + ':' +time.split(':')[1]
                } catch (e) {
                    console.log('getTimeError',time,e)
                    return time
                }
            },
            //  重组图标数据
            setChartData(data) {
                console.log(data)
                let [allNum,all_in,all_out] = [0,0,0]
                if (this.YJLX === '车速变换') {
                    allNum = data.average_speed.reduce((p,c) => p + c)
                } else if (this.YJLX === '电压变化') {
                    allNum = 100
                } else {
                    [all_in, all_out] = [
                        data.all_in.reduce((p,c) => p + c),
                        data.all_out.reduce((p,c) => p + c),
                    ]
                    allNum = all_in + all_out
                }
                // console.log(data, allNum,all_in,all_out,this.YJLX)

                if (allNum === 0 || (this.YJLX === '电压变化' && data.voltage[0].length === 0)) {
                    this.chart1 && this.chart1.destroy()
                    this.chart2 && this.chart2.destroy()
                    this.chart1 = null
                    this.chart2 = null
                    this.$message.warning('暂无数据');
                } else {
                    const [list1, list2] = [[],[]]
                    if (this.YJLX === '车速变换') {
                        data.average_speed.map((e,index) => {
                            const percent = Number((e / allNum).toFixed(2))
                            percent !== '0.00' && list1.push({
                                item: `${index}号单元`,
                                count: e,
                                percent
                                // percent: percent === '0.00' ? 0.01 : percent === '1.00' ? 0.99 : percent
                            })
                        })
                        data.speed.map((x,xIndex) => {
                            data.x_time.map((e, index) => {
                                if (data.x_time.length > 6 && index % Math.floor(data.x_time.length / 5) !== 0) return
                                list2.push({
                                    time: e,
                                    type: `${xIndex}号单元`,
                                    num: data.speed[xIndex][index],
                                })
                            })
                        })
                    } else if (this.YJLX === '电压变化') {
                        data.voltage.map((x,xIndex) => {
                            data.x_time.map((e, index) => {
                                if (data.x_time.length > 6 && index % Math.floor(data.x_time.length / 5) !== 0) return
                                list2.push({
                                    time: e,
                                    type: `${xIndex}号单元`,
                                    num: data.voltage[xIndex][index],
                                })
                            })
                        })
                    } else {
                        data.all_in.map((e, index) => {
                            const count = e + data.all_out[index]
                            const percent = Number((count / allNum).toFixed(2))
                            percent !== '0.00' && list1.push({
                                item: `${index}号单元`,
                                count: count,
                                percent
                                // percent: 0.25
                            })
                        })
                        data.in.map((x,xIndex) => {
                            data.x_time.map((e, index) => {
                                if (data.x_time.length > 6 && index % Math.floor(data.x_time.length / 5) !== 0) return
                                list2.push({
                                    time: e,
                                    type: `${xIndex}号单元`,
                                    num: data.in[xIndex][index] + data.out[xIndex][index],
                                })
                            })
                        })
                    }
                    this.list1 = list1
                    this.list2 = list2

                    this.chart1 && this.chart1.destroy()
                    this.chart2 && this.chart2.destroy()
                    setTimeout(() => {
                        this.createChart1()
                        this.YJLX === '电压变化' && this.chart1 && this.chart1.hide()
                        this.createChart2()
                    }, 500)
                }
                console.log(this.list1)
            },
            getPx(num) {
                return document.documentElement.clientWidth * (num / 1920)
            }
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
            Details
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
            margin-bottom: 12px;
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
                    height: 35px;
                    /*background: #102D32;*/
                    opacity: 1;
                    border-radius: 5px;
                    padding: 0 16px;
                    box-sizing: border-box;
                    align-items: center;
                    span{
                        flex: 1;
                        font-size: 18px;
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
                top: 142px;
                background: rgba(255,255,255,.8);;
            }
            button{
                width: 100%;
                height: 35px;
                background: $Button-Color;
                border: none;
                border-radius: 5px;
                font-size: 16px;
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
    .HomeDropDownBox{
        width: 200px;
    }
</style>
