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
                    <div class="RX" v-else-if="Details.type === 'PCrossing'">
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
                    <ScrollView class="middle-box-content" boxClass="details-scrollBox" type="text" ref='testing'>
                        <div></div>
                        <p v-html="testing"></p>
                    </ScrollView>
                </div>
                <div class="middle-box">
                    <div class="middle-box-header">运行日志信息显示</div>
                    <ScrollView class="middle-box-content" boxClass="details-scrollBox" type="text" ref='running'>
                        <div></div>
                        <p v-html="running"></p>
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
        <!-- <div class="demo" @click='demo'> </div> -->
    </Box>
</template>

<script>
    import Box from '../components/Box'
    import CrossingItem from '../components/CrossingItem'
    import Dropdown from '../components/Dropdown'
    import ScrollView from '../components/ScrollView'
    import videojs from 'video.js'
    import Socket from '../common/socketclient.js'
    import 'videojs-contrib-hls'
    export default {
        name: 'Details',
        data() {
            return {
                route: this.value,
                playUrl: '',
                Details: {},
                crossing: this.$store.getters.crossing,
                testing: '',        //  检测文本
                running: '',        //  运行日志
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
            this.closeSocket()
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
            this.initSocket(this.route.code)
        },
        methods: {
            //  监控插入文本
            changeLog(key, text) {
                this[key] += `<p style="margin-bottom:5px">${text}</p>`
                this.$refs[key] && this.$refs[key].scrollEnd()
            },
            demo() {
                console.log('demo')
                this.changeLog('running', `当前监控路口ID切换为123123123}`)
            },
            //  初始化长连接
            initSocket(id) {
                var sta_d = {'1': '车辆到来', '0': '车辆离开'};
                var dir_d = {'0': '主单元', '1' : '1号单元', '2': '2号单元', '3': '3号单元'};
                var car_detect_id = {'0': {'1': '主单元车辆到来', '0': '主单元车辆离开'}, 
                                    '1': {'1': '1号单元车辆到来', '0': '1号单元车辆离开'}, 
                                    '2': {'1': '2号单元车辆到来', '0': '2号单元车辆离开'}, 
                                    '3': {'1': '3号单元车辆到来', '0': '3号单元车辆离开'}};

                this.client = new Socket("134.175.65.106", 8089, "chat");
                this.client.connect();
                this.changeLog('testing', `当前监控路口ID切换为${id}`)
                // 先发送路口id，101表示yunnan-101
                // 即切换到101路口
                const routeid_code = id.replace(/yunnan-/,'');
                this.client.sendData(routeid_code);
                this.client.onData = (text) => {
                    // 第一种信息、车辆检测状态 text="101,0,1,2019-04-12 12:12:12"
                    // 第二种信息、日志信息 text = "2019-08-17 21:27:42: 路口编号:yunnan-102 详情: 1号子单元和主单元断开了连接"
                    // 第三种信息、连接状态提醒 text="已经成功连接到后台，正在等待数据更新！"
                    // 实时预警状态更新必须要选择当前路口编号才能更新信息
                    // 日志信息无论什么路口编号，都可以获取
                    //20190817 jun
                    console.log(text);
                    if(text.indexOf('后台') == -1 && text.indexOf('详情') == -1 )
                    {
                        // 检测状态更新
                        let msg = text.split(',');
                        let data = '时间：' + msg[3] + '  单元号：' + dir_d[msg[1]] + '  检测状态：' + sta_d[msg[2]] + '\n';
                        console.log('修改车辆信号灯',data);
                        var dir_code = car_detect_id[msg[1]][msg[2]];

                        //  查询需要更新来车信号的item
                        const index = this.Details.element.findIndex(e => e.name === dir_d[msg[1]])
                        if (index !== -1) {
                            console.log(`更新${index}单元来车:${sta_d[msg[2]]}`)
                            this.setPassStatus(this.Details.element[index].passStatus, msg[2] === '1' ? 0 : 1)
                        }
                    }
                    else if(text.indexOf('详情') >= 0)
                    {
                        // 日志更新
                        let data = text;
                        console.log('日志更新',data);
                        this.changeLog('running', data)
                        //  2020-10-04 22:51:08 路口编号：yunnan-101 详情：0号单元,电池电压值：10.9V
                        if (data.indexOf('断开') === -1) {
                             try{
                                //  获取单元 电量
                                const item = data.split('详情：')[1] && data.split('详情：')[1].split(',')
                                //  截取电量
                                const _electricQuantity = item[1].replace(/电池电压值：/,'').replace(/V/,'')
                                const electricQuantity = this.getElectricQuantity(_electricQuantity)
                                //  查询是哪个单元
                                const index = this.Details.element.findIndex(e => e.name === item[0])
                                if (index !== -1) {
                                    console.log('电量刷新',index,'号单元','电量',electricQuantity)
                                    this.$set(this.Details.element[index],'electricQuantity',electricQuantity)
                                }
                            } catch(e) {
                                console.log('长连接 刷新电池信息失败:',e)
                            }
                        }
                    }
                    else
                    {
                        // 连接状态更新
                        let data = text;
                        console.log('连接状态更新',data);
                        this.changeLog('testing', data)
                    }
                }
                this.client.onClose = () => {
                    console.log('连接关闭');
                    // this.changeLog && this.changeLog('testing', '数据刷新失败，请刷新重试')
                }
            },
            //  长连接切换
            changeSocket(id) {
                this.closeSocket()
                this.initSocket(id)
            },
            closeSocket() {
                this.client && this.client.close()
            },
            //  关闭窗口
            hidden() {
                this.$emit('close')
            },
            //  修改车辆信号等
            setPassStatus(obj, key) {
                this.$set(obj,key,true)
                setTimeout(() => {
                   this.$set(obj,key,false)
                },1000)
            },
            //  根据路口名称查询编号
            getID(name) {
                return this.crossing[this.crossing.findIndex(e => e[0] === name)][1]
            },
            //  左上角选项卡切换
            change(item) {
                this.getApiData(this.getID(item))
                this.changeSocket(this.getID(item))
            },
            //  调用接口查询当前路口数据
            getApiData(id) {
                this.$fetch.Post('/connect6.php', {
                    code: id
                })
                .then(res => {
                    if (res.code === 200) {
                        console.log('connect6.php',res)
                        this.regroup(res.data)
                    }
                })
            },
            //  获取路口类型
            getRoadtype(type) {
                return type === 'T形路口' ? 'TCrossing' : type === '人形路口' ? 'PCrossing' : 'crossroad'
            },
            //  获取信号强度
            getSignal(signal) {
                return !!signal ? Math.max(1, Math.round(Math.min(4, 4 * signal))): 1
            },
            //  获取电量
            getElectricQuantity(electricQuantity) {
                const numberElectricQuantity = Number(electricQuantity)
                const _electricQuantity = (numberElectricQuantity - 10) / 2 * 100
                return parseInt(Math.max(0, Math.min(_electricQuantity, 100)))
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
                const type = this.getRoadtype(data.roadtype)
                const newArr = {
                    type: type,
                    element: []
                }
                const signalIconArr = [require('../assets/img/signal-1.png'),require('../assets/img/signal-2.png'),require('../assets/img/signal-3.png'),require('../assets/img/signal-4.png')]
                data.uint_log[0] && data.uint_log.map((e,index) => {
                    //  限制对应路口类型最大单元数
                    if (type === 'crossroad' && index > 3 || type === 'TCrossing' && index > 2 || type === 'PCrossing' && index > 1) return
                    //  计算电量剩余百分比
                    const electricQuantity = this.getElectricQuantity(e[1].replace(/V/,""))
                    //  插入单元信息
                    newArr.element.push({
                        name: e[0],                                             //  单元名称
                        signal: this.getSignal(e[3]),                           //  信号强度
                        signalIcon: signalIconArr[this.getSignal(e[3]) - 1],    //  信号图片
                        electricQuantity: electricQuantity,                     //  电量
                        passStatus: [false, false],                             //  车辆经过状态 对应每一个灯
                        video: e[4],                                            //  录像
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
                    transform: rotate(180deg);
                    img:first-child{
                        margin-bottom: 47px;
                    }
                }
                .light:nth-child(3){
                    right: 55px;
                    top: 225px;
                    transform: rotate(180deg);
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
                    transform: rotate(180deg);
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
                    transform: rotate(180deg);
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
                    transform: rotate(180deg);
                    img:first-child{
                        margin-bottom: 20px;
                        transform: translateX(55px);
                    }
                    img:last-child{
                        // transform: translateX(-55px);
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
                text-align: center;
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
    .demo{
        position: absolute;
        top: 200px;
        right: 200px;
        width: 200px;
        height: 200px;
        background: red;
        z-index: 9999;
    }
</style>
