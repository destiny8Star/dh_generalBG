<template>
    <div class="first-nav" id="first-nav" v-bind:style="{height: (getWinHeight-60)+'px' }">
        <div class="first-nav-main">
            <el-row class="tac">
                <el-col>
                    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
                             @close="handleClose" :unique-opened="false" :router="uniqueOpened" :default-openeds="defaultOpeneds">
                        <template v-for="navItem in navData">
                            <el-menu-item :index="navItem.url" v-if="!navItem.children">
                                <template slot="title">
                                    <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                    <span>{{navItem.name}}</span>
                                </template>
                            </el-menu-item>
                            <el-submenu :index="navItem.depth+'-'+navItem.id" v-else>
                                <template slot="title">
                                    <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                    <span>{{navItem.name}}</span>
                                </template>
                                <template v-for="childItem in navItem.children">
                                    <el-menu-item :index="childItem.url" v-if="!childItem.children">{{childItem.name}}
                                    </el-menu-item>
                                    <el-submenu :index="childItem.depth+'-'+childItem.id" v-else>
                                        <template slot="title">{{childItem.name}}</template>
                                        <el-menu-item :index="childChildItem.url"
                                                      v-for="childChildItem in childItem.children">
                                            {{childChildItem.name}}
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                            </el-submenu>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ico_sc from '../assets/img/sc.svg'
    import ico_mp from '../assets/img/mp.svg'
    import ico_wm from '../assets/img/wm.svg'

    export default {
        name: "CommonLefter",
        data: function () {
            return {
                uniqueOpened: true,
                icos: {ico_sc: ico_sc, ico_mp: ico_mp, ico_wm: ico_wm},
                navData: [
                    {
                        id: 1, name: '首页', url: '/home', depth: 1, ico_url: 'home@2x.png',
                    },
                    {
                        id: 2, name: '代理商管理', url: '', depth: 1, ico_url: 'agen@2x.png',
                        children: [
                            {id: 20, name: '代理商列表', url: '/agent/list', depth: 2, ico_url: ''},
                            // {id: 22, name: '服务商审核', url: '/agent/auditList', depth: 2, ico_url: ''},
                            {id: 23, name: '开通代理商', url: '/agent/dredge', depth: 2, ico_url: ''},
                            // {id: 24, name: '分销商列表', url: '/agent/distributor', depth: 2, ico_url: ''},
                          /*  {
                                id: 21, name: '审核权限', url: '/team/Recommend', depth: 2, ico_url: '',
                                children: [
                                    {id: 23, name: '服务商审核', url: '/merchant/list', depth: 3, ico_url: ''},
                                ]
                            },
                            {
                                id: 22, name: '客服权限', url: '/team/Collect', depth: 2, ico_url: '', children: [
                                    {id: 24, name: '开通服务商', url: '/merchant/list', depth: 3, ico_url: ''},
                                ]
                            },*/
                        ]
                    },
                    {
                        id: 3,
                        name: '商户管理',
                        url: '',
                        depth: 1,
                        ico_url: 'buss@2x.png',
                        children: [
                            {id: 30, name: '商户列表', url: '/merchant/list', depth: 2, ico_url: ''},
                            {id: 31, name: '微信直连审核', url: '/merchant/weChatAudit', depth: 2, ico_url: ''},
                            {id: 32, name: '支付宝直连审核', url: '/merchant/alipayAudit', depth: 2, ico_url: ''},
                            {id: 32, name: '拉卡拉进件审核', url: '/merchant/lakalaAudit', depth: 2, ico_url: ''},
                        ]
                    },
                    {
                        id: 4,
                        name: '提现管理',
                        url: '',
                        depth: 1,
                        ico_url: 'ench@2x.png',
                        children: [
                            {id: 40, name: '提现记录', url: '/withdraw/list', depth: 2, ico_url: ''}
                        ]
                    },
                    {
                        id: 5, name: '设备管理', url: '', depth: 1, ico_url: 'equi@2x.png',
                        children: [
                            {id: 50, name: '设备列表', url: '/device', depth: 2, ico_url: ''},
                            {id: 52, name: '分类管理', url: '/device/classifyManage', depth: 2, ico_url: ''},
                            {id: 53, name: '名称管理', url: '/device/nameManage', depth: 2, ico_url: ''},
                            {id: 54, name: '入库', url: '/device/storage', depth: 2, ico_url: ''},
                            {id: 55, name: '出库', url: '/device/delivery', depth: 2, ico_url: ''},
                            {id: 55, name: '回收记录', url: '/device/recycle', depth: 2, ico_url: ''},
                        ]
                    },
                    {
                        id: 6, name: '广告图管理', url: '/poster/verify', depth: 1, ico_url: 'adpi@2x.png',
                        /*children: [
                            {id: 60, name: '广告图审核', url: '', depth: 2, ico_url: ''},
                        ]*/
                    },
                    {
                        id: 7, name: '广告管理', url: '/ad', depth: 1, ico_url: 'admn@2x.png',
                        // children: [
                        //    {id: 70, name: '广告列表', url: '', depth: 2, ico_url: ''},
                        // ]
                    },
                ],
                // navData: [],
                navDataExtend:[],
                defaultOpeneds: [],
            }
        },
        //计算属性，可缓存值，没有变化不会重新计算结果
        computed: {
            getWinHeight() {
                return this.$winHeight;
            }
        },
        mounted: function () {
            // this.loadMenu();
            if (this.navData) {
                if(this.$webConfig.leftMenuShow==1){
                    this.navData.push({id: 8, name: '交易数据', url: '/transaction', depth: 1, ico_url: 'tran@2x.png',});
                }
                this.navData=[...this.navData,...this.navDataExtend];
                this.navData.forEach(item => {
                    if (item.children) {
                        this.defaultOpeneds.push(item.depth + '-' + item.id);
                        item.children.forEach(m=>{
                            this.defaultOpeneds.push(m.depth + '-' + m.id);
                        })
                    }
                })
            }
        },
        methods: {
            loadMenu() {
                this.$axios.get("/agent/menu/getMenu").then(res => {
                    this.navData = res.data.data;
                })
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>
