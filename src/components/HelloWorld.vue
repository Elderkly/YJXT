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
    </div>
</template>

<script>
    // import {AMapManager} from 'vue-amap';
    //
    // let amapManager = new AMapManager()
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
        },
        methods: {
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
</style>
