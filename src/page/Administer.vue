<template>
    <div>
        <div class="A-top">
            <Box title="预警参数配置" class="top-left" rightButton="保存参数设置" :hiddenFloat=true :bottomBackgroundSize="2" @hidden="submit">
                <div class="top-box">
                    <div class="TB-left">
                        <div class="items">
                            <p>显示规则</p>
                            <Input v-model="submitConfig.config"/>
                        </div>
                        <div class="items">
                            <p>路口编号</p>
                            <Input v-model="submitConfig.number"/>
                        </div>
                        <div class="items">
                            <p>路口形状选择</p>
                            <Dropdown :data="['十字路口','T形路口','人形路口']" v-model="submitConfig.shape"/>
                        </div>
                        <div class="fixed-map-box" v-if="openMap" ref="fixedBox">
                            <Box class="fixed-map" title="坐标选点" right-button="确定" @hidden="hiddenMap" :headerBlur="true">
                                <el-amap-search-box class="search-box" :searchOption="{citylimit: false}" :on-search-result="onSearchResult"></el-amap-search-box>
                                <el-amap
                                    vid="amapDemo"
                                    :zoom="13"
                                    :center="center"
                                    class="amap-demo"
                                    mapStyle="amap://styles/972a61b58d5599688686f405ac78c956"
                                    :events="events"
                                >
                                    <el-amap-marker :position="center" >
                                        <img src="../assets/img/map-markers.png" class="marker"/>
                                    </el-amap-marker>
                                </el-amap>
                                <div class="mapText">
                                    <p class="ellipsis">{{address.name}} ({{address.center[0]}},{{address.center[1]}})</p>
                                </div>
                            </Box>
                        </div>
                    </div>
                    <div class="TB-right">
                        <div class="items">
                            <p>位置坐标</p>
                            <div>
                                <Input v-model="submitConfig.coord" :disabled="true"/>
                                <button class="commonButton" @click="getCoord">坐标选点</button>
                            </div>
                        </div>
                        <div class="items">
                            <p>布设单元个数</p>
                            <Dropdown :data="['1','2','3','4']" v-model="submitConfig.element"/>
                        </div>
                    </div>
                </div>
            </Box >
            <Box title="当前连接到服务器的预警设备" class="top-right" :bottomBackgroundSize="1">
                <div class="right-box">
                    <div class="placeholder"></div>
                    <div class="header">
                        <span>设备编号</span>
                        <span>硬件地址</span>
                        <span>路口编号</span>
                        <span>查看配置</span>
                    </div>
                    <ScrollView boxClass="serverFacilityBox" barClass="serverFacilityBarClass">
                        <div class="items" v-for="(item,index) in serverFacility">
                            <span class="ellipsis">{{index + 1}}</span>
                            <span class="ellipsis">{{item[0]}}</span>
                            <span class="ellipsis">{{item[1]}}</span>
                            <span @click="selectMoreElement(item)">查看</span>
                        </div>
                    </ScrollView>
                </div>
            </Box>
        </div>
        <Box title="显示规则设置" class="A-bottom" :bottomBackgroundSize="3" :hiddenFloat="true">
            <div class="A-bottom-box">
                <div class="B-left">
                    <Dropdown :data="getVoltage_log" v-model="displayRuleSettings.target"/>
                </div>
                <ScrollView class="B-right" boxClass="displayRuleSettingsBox">
                    <div class="placeholder"></div>
                    <div class="B-right-items-box">
                        <div class="B-right-items ellipsis" v-for="(item,index) in displayRuleSettings.ruleList" @click="send(item)">
                            {{item}}
                        </div>
                    </div>
                </ScrollView>
            </div>
            <div class="cover" v-if="voltage_log.length === 0"></div>
        </Box>
    </div>
</template>

<script>
    import Box from '../components/Box'
    import Input from '../components/Input'
    import Dropdown from '../components/Dropdown'
    import ScrollView from '../components/ScrollView'
    export default {
        name: 'Administer',
        components: {
            Box,
            Input,
            Dropdown,
            ScrollView
        },
        data() {
            const self = this;
            return {
                //  参数配置
                submitConfig: {
                    config: null,       //  参数配置
                    coord: null,        //  坐标
                    number: null,       //  编号
                    element: null,      //  单元个数
                    shape: null,        //  路口形状
                    loc: null,          //  详细地址
                },
                //  连接到服务器的预警设备
                serverFacility: [],
                //  显示规则设置
                displayRuleSettings: {
                    target: null,
                    routeid: null,
                    ruleList: ['主路来车，停车让行','左侧来车，减速慢行','右侧来车，减速慢行','两侧来车减速慢行','减速慢行，主路优先','主路来车，注意避让','减速慢行','备用','夜间模式','白天模式','停止显示','显示逻辑1','显示逻辑2','显示逻辑3']
                },
                //  打开小地图默认坐标
                center: [114.06055,22.540582],  
                //  选取的地图信息
                address: {
                    center: [],
                    name: '',
                },
                //  是否打开小地图
                openMap: false,
                //  地图事件
                events: {
                    //  初始化完成
                    complete() {
                        if (!!self.address.name) return
                        self.address = {
                            center: [114.06055,22.540582],
                            name: '市民广场',
                        }
                    },
                    //  点击事件
                    click(e) {
                        let { lng, lat } = e.lnglat;
                        self.lng = lng;
                        self.lat = lat;
                        self.getAddress(lng,lat)
                            .then(res => {
                                self.center = [lng,lat]
                                self.address = {
                                    center: [lng,lat],
                                    name: res,
                                }
                            })
                    },
                },
                voltage_log: []
            }
        },
        mounted() {
            //  获取连接到服务器的设备
            this.$fetch.Get('/connect4.php')
                .then(res => {
                    if (res.code === 200) {
                        this.serverFacility = res.data
                    }
                })
        },
        computed: {
            getVoltage_log() {
                const newArr = []
                this.voltage_log && this.voltage_log.map(e => newArr.push(e[0]))
                return newArr
            }
        },
        methods: {
            //  获取详细地址
            getAddress(lng ,lat) {
                return new Promise(resolve => {
                    // 这里通过高德 SDK 完成。
                    const geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress([lng ,lat], function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                try {
                                    resolve(result.regeocode.aois[0] && result.regeocode.aois[0].name ? result.regeocode.aois[0].name : result.regeocode.formattedAddress)
                                } catch (e) {
                                    resolve(result.regeocode.formattedAddress)
                                }
                            }
                        }
                    });
                })
            },
            getCoord() {
                this.openMap = true
            },
            //  地图关闭 写入参数
            hiddenMap() {
                this.openMap = false
                this.submitConfig.coord = this.address.center
                this.submitConfig.loc = this.address.name
            },
            //  点击地图搜索内容 查询详细地址
            onSearchResult(pois) {
                if (pois.length > 0) {
                    const poi = pois[0]
                    this.getAddress(poi.lng,poi.lat)
                        .then(res => {
                            this.center = [poi.lng,poi.lat]
                            this.address = {
                                center: [poi.lng,poi.lat],
                                name: res,
                            }
                        })
                }
            },
            //  地图打开时 点击其他区域关闭地图
            setUpVisible(e) {
                const _con = this.$refs.fixedBox;   // 设置目标区域
                if (_con === e.target) {
                    this.openMap = false
                }
            },
            //  点击左上区域 保存参数设置
            submit() {
                const {config, coord, number, element, shape, loc} = this.submitConfig
                const num = !config ? '请输入预警参数配置' :
                    !coord ? '请输入坐标' :
                        !number ? '请输入编号' :
                            !element ? '请选择单元个数' :
                                !shape ? '请选择路口形状' : null
                if (!num) {
                    this.$fetch.Post('/connect3.php',{
                        routeid: number,
                        uintnum: element,
                        warning: config,
                        loc: loc,
                        cord: coord,
                        roadtype: shape,
                    })
                    .then(res => {
                        if (res.data.indexOf('设置更新成功') !== -1 || res.data.indexOf('设置创建成功') !== -1 ) {
                            this.submitConfig = {
                                config: null,       //  参数配置
                                coord: null,        //  坐标
                                number: null,       //  编号
                                element: null,      //  单元个数
                                shape: null,        //  路口形状
                                loc: null,          //  详细地址
                            }
                        }
                        const index = this.$store.getters.crossing.findIndex(e => e[1] === number)
                        if (index === -1) {
                            this.$store.commit('ADD_CROSSING', [loc,number,coord[0],coord[1]])
                        }
                        this.$message.success(res.data);
                    })
                } else {
                    this.$message.warning(num);
                }
            },
            //  查询连接到服务器的设备 的配置信息
            selectMoreElement(item) {
                this.$fetch.Post('/connect6.php',{
                    code: item[1],
                })
                    .then(res => {
                        this.displayRuleSettings.routeid = item[1]
                        this.voltage_log = res.data.uint_log
                        //  将数据写入左侧
                        const index = this.$store.getters.crossing.findIndex(e => e[1] === item[1])
                        if (index !== -1) {
                            console.log(res,item,this.$store.getters.crossing[index])
                            const vuexItem = this.$store.getters.crossing[index]
                             this.submitConfig = {
                                config: item[2],       //  参数配置
                                coord: [vuexItem[2],vuexItem[3]],        //  坐标
                                number: item[1],       //  编号
                                element: res.data.uint_log.length,      //  单元个数
                                shape: res.data.roadtype,        //  路口形状
                                loc: vuexItem[0],          //  详细地址
                            }
                        }
                    })
            },
            //  底部 向单元发送规则
            send(item) {
                // console.log(item,this.displayRuleSettings)
                if (this.displayRuleSettings.target) {
                    this.$fetch.Post('/connect5.php',{
                        warning: item,
                        routeid: this.displayRuleSettings.routeid,
                        uintid: this.displayRuleSettings.target
                    })
                        .then(res => {
                            this.$message.success(res.data);
                        })
                } else {
                    this.$message.warning('请选择单元');
                }
            }
        },
        watch: {
            openMap(newValue) {
                if (newValue) {
                    document.body.addEventListener('mouseup',this.setUpVisible)
                } else {
                    document.body.removeEventListener('mouseup',this.setUpVisible)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .A-top{
        display: flex;
        height: 51.5vh;
        .top-left{
            width: 1096px;
            position: relative;
        }
        .top-right{
            margin-left: 32px;
            width: 728px;
        }
    }
    .A-bottom{
        margin-top: 32px;
        height: 31vh
    }
    .top-box{
        padding: 16px 32px;
        display: flex;
        &>div{
            flex:1;
            &:first-child{
                margin-right: 32px;
            }
        }
    }
    .items{
        margin-bottom: 24px;
        p{
            color: $Title-Color;
            font-size: $Title-Font-Size;
            margin-bottom: 6px;
        }
        &>div{
            display: flex;
            input {
                flex: 1;
                margin-right: 24px;
            }
        }
    }
    .fixed-map-box{
        position: absolute!important;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .fixed-map{
        width: 640px;
        height: 40vh;
        border-radius: 15px;
        margin-top: 1vh;
        .mapText{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            background: $BG;
            line-height: 50px;
            backdrop-filter: blur(20px);
            border-top: 2px solid $Border-Color;
            display: flex;
            justify-content: flex-end;
            padding: 0 15px;
            p{
                width: 100%;
                margin-bottom: 0;
                text-align: right;
            }
        }
        .search-box{
            position: absolute;
            top: 60px;
            height: 50px;
            width: 300px;
            background: $Default-Bg;
        }
        .marker{
            width: 70px;
            position: relative;
            left: -20px;
        }
    }
    .right-box{
        padding: 0 22px;
        .placeholder{
            height: 82px;
        }
        .header{
            display: flex;
            margin-bottom: 18px;
            span{
                flex: .8;
                text-align: center;
                font-size: 20px;
                color: $Title-Color;
                &:nth-child(2) {
                    flex: 1;
                }
            }
        }
        .items{
            display: flex;
            span{
                flex: .8;
                text-align: center;
                font-size: 18px;
                color: $Title-Color;
                &:nth-child(2) {
                    flex: 1;
                }
                &:last-child{
                    color: rgba(0, 119, 255, 1);
                    font-weight: bold;
                    cursor: pointer;
                }
            }
        }
    }
    .A-bottom-box{
        padding: 0 32px;
        display: flex;
        .B-left{
            margin-top: 56px;
            width: 196px;
            margin-right: 32px;
        }
        .B-right{
            flex: 1;
            .placeholder{
                height: 56px;
            }
            .B-right-items-box{
                display: flex;
                flex-wrap: wrap;
                .B-right-items{
                    width: 196px;
                    height: 40px;
                    background: $Default-Bg;
                    padding: 0 17px;
                    box-sizing: border-box;
                    border-radius: 5px;
                    font-size: 18px;
                    color: $Title-Color;
                    margin-right: 32px;
                    margin-bottom: 48px;
                    text-align: center;
                    line-height: 40px;
                    cursor: pointer;
                    &:nth-child(7n) {
                        margin-right: 0;
                    }
                }
            }
        }
    }
    .cover{
        position: absolute;
        width: 100%;
        height: 100%;
        background: red;
        top: 0;
        opacity: 0;
    }
</style>
