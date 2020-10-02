<template>
    <Box title="车辆检测实时监控" class="details" :hiddenFloat=true rightButton="收起" @hidden="hidden" contentClass="detailsContent">
        <div class="detailsBox">
            <div class="details-left">
                <p>当前路口编号</p>
                <Dropdown :data="crossingList" v-model="route.name" class="Dropdown" @change="change" overlayClassName="HomeDropDown" />
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
                    />
                </div>
            </div>
        </div>
    </Box>
</template>

<script>
    import Box from '../components/Box'
    import CrossingItem from '../components/CrossingItem'
    import Dropdown from '../components/Dropdown'
    import ScrollView from '../components/ScrollView'
    import videojs from 'video.js'
    import 'videojs-contrib-hls'
    export default {
        name: 'Details',
        data() {
            return {
                route: this.value,
                playUrl: '',
                Details: {},
                crossing: this.$store.getters.crossing,
            }
        },
        props: ['value'],
        components: {
            Box,
            CrossingItem,
            Dropdown,
            ScrollView
        },
        beforeDestroy() {
            this.disposeVideo()
            //  长链接-页面销毁 关闭长链接回收资源
            //  ...
        },
        computed: {
            crossingList() {
                const newList = []
                this.crossing.map(e => newList.push(e[0]))
                return newList
            }
        },
        mounted() {
            this.getApiData(this.route.code)
            //  长链接-创建长链接监听
            //  ...
        },
        methods: {
            //  关闭窗口
            hidden() {
                this.$emit('close')
            },
            //  根据路口名称查询编号
            getID(name) {
                return this.crossing[this.crossing.findIndex(e => e[0] === name)][1]
            },
            //  左上角选项卡切换
            change(item) {
                this.getApiData(this.getID(item))
            },
            //  调用接口查询当前路口数据
            getApiData(id) {
                this.$fetch.Post('/connect6.php', {
                    code: id
                })
                .then(res => {
                    if (res.code === 200) {
                        this.regroup(res.data)
                    }
                })
            },
            //  重组api返回的数据
            regroup(data) {
                /**
                 *  数据结构重组函数   需按以下顺序进行数据重组
                 type: 'crossroad',        //  路口类型  十字 crossroad     T形 TCrossing      人形 PCrossing
                 element: [                //  路口单元   有几个单元返回几个obj
                            {
                                name: '主单元',                                      //  单元名称
                                signal: 4,                                          //  信号强度
                                signalIcon: require('../assets/img/signal-4.png'),  //  信号图片
                                electricQuantity: 80,                               //  电量
                                passStatus: [false, true],                          //  车辆经过状态 对应每一个灯
                                video: '123',                                       //  录像  如果为null则不显示录像图标
                            },
                            {
                                name: '一号单元',            //  单元名称
                                signal: 3,                //  信号强度
                                signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                                electricQuantity: 60,     //  电量
                                passStatus: [false, false],//  车辆经过状态 对应每一个灯
                                video: '123',                //  录像
                            },
                            {
                                name: '二号单元',            //  单元名称
                                signal: 1,                //  信号强度
                                signalIcon: require('../assets/img/signal-1.png'),//    信号图片
                                electricQuantity: 10,     //  电量
                                passStatus: [false, false],//  车辆经过状态 对应每一个灯
                                video: '123',                //  录像
                            },
                            {
                                name: '三号单元',            //  单元名称
                                signal: 3,                //  信号强度
                                signalIcon: require('../assets/img/signal-3.png'),//    信号图片
                                electricQuantity: 60,     //  电量
                                passStatus: [false, false],//  车辆经过状态 对应每一个灯
                                video: '123',                //  录像
                            }
                 ]
                 * */
                const newArr = {
                    type: 'crossroad',
                    element: []
                }
                data.voltage_log.map(e => {
                    //  计算电量剩余百分比
                    const numberElectricQuantity = Number(e[1].replace(/V/,""))
                    const _electricQuantity = (numberElectricQuantity - 10) / 2 * 100
                    const electricQuantity = parseInt(Math.max(0, Math.min(_electricQuantity, 100)))
                    //  插入单元信息
                    newArr.element.push({
                        name: e[0],                                             //  单元名称
                        signal: 3,                                              //  信号强度
                        signalIcon: require('../assets/img/signal-3.png'),      //  信号图片
                        electricQuantity: electricQuantity,                     //  电量
                        passStatus: [false, false],                             //  车辆经过状态 对应每一个灯
                        video: '123',                                           //  录像
                    })
                })
                //  写入重组后的数组
                this.Details = newArr
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
                console.log('真实视频地址',item.video)
                //  示例视频
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
        },
        watch: {
            value(newValue) {
                this.route = newValue
            },
            '$store.getters.crossing': function(newValue) {
                if (newValue.length !== this.crossing.length) {
                    this.crossing = newValue
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
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
