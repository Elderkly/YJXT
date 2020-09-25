<template>
    <div>
        <div class="A-top">
            <Box title="预警参数配置" class="top-left" rightButton="保存参数设置" :hiddenFloat=true>
                <div class="top-box">
                    <div class="TB-left">
                        <div class="items">
                            <p>预警参数配置</p>
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
                            <Box class="fixed-map" title="坐标选点" right-button="确定" @hidden="hiddenMap">
                                <el-amap-search-box class="search-box" :searchOption="{citylimit: false}" :on-search-result="onSearchResult"></el-amap-search-box>
                                <el-amap
                                    vid="amapDemo"
                                    :zoom="13"
                                    :center="center"
                                    class="amap-demo"
                                    mapStyle="amap://styles/f766b09906abc805318e0c0e0f16a48f"
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
                            <Dropdown :data="['一个','两个','三个','四个']" v-model="submitConfig.element"/>
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="当前连接到服务器的预警设备" class="top-right" :hiddenFloat=true />
        </div>
        <Box title="显示规则设置" class="A-bottom" :hiddenFloat=true />
    </div>
</template>

<script>
    import Box from '../components/Box'
    import Input from '../components/Input'
    import Dropdown from '../components/Dropdown'
    export default {
        name: 'Administer',
        components: {
            Box,
            Input,
            Dropdown
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
                    shape: null         //  路口形状
                },
                center: [114.06055,22.540582],
                address: {
                    center: [],
                    name: '',
                },
                openMap: false,
                events: {
                    complete() {
                        if (!!self.address.name) return
                        self.address = {
                            center: [114.06055,22.540582],
                            name: '广东省深圳市福田区莲花街道市民广场',
                        }
                    },
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
                }
            }
        },
        methods: {
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
                                resolve(result.regeocode.formattedAddress)
                            }
                        }
                    });
                })
            },
            getCoord() {
                this.openMap = true
            },
            hiddenMap() {
                this.openMap = false
                this.submitConfig.coord = this.address.center
            },
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
            setUpVisible(e) {
                const _con = this.$refs.fixedBox;   // 设置目标区域
                if (_con === e.target) {
                    this.openMap = false
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
        height: 412px;
        border-radius: 15px;
        margin-top: 50px;
        .mapText{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            background: $BG;
            line-height: 50px;
            backdrop-filter: blur(20px) brightness(0.5);
            border-top: 2px solid rgba(24, 169, 193, .3);
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
</style>
