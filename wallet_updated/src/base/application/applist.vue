<template>
  <div class="w">
    <!-- table -->
      <div class="event" >
        <table width=100% border="0" cellspacing="0" cellpresumeing="0" v-show="tableData.length">
            <thead class="table_th">
                <th>图标</th>
                <th>名称</th>
                <th>应用描述</th>
                <th>接收者</th>
                <th>类别</th>
                <th>详情</th>
                <th>源码</th>
            </thead>
            <tbody class="table_tb">
                <tr v-for="(item, index) in tableData" :key="index">
                    <td><img src="../../assets/images/logo.png" alt=""></td>
                    <td>{{item.name}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.transactionId}}</td>
                    <td>{{item.category | getDappCategory }}</td>
                    <td><a href="javascript:;" style="color: #399bff;">详情</a></td>
                    <td><a href="javascript:;" style="color: #399bff;">下载</a></td>
                </tr>
            </tbody>
        </table>
        <no-data v-show="!tableData.length"></no-data>
      </div>
      <page v-show="PageTotal > 1" :PageTotal="PageTotal" :routeName="routeName" @renderDiff="renderDiff"></page>
  </div>
</template>

<script>
import Page from "../page";
import NoData from "../nodata";
const HOST = require('../../../config/ip')
console.log(HOST)
export default {
  components: {
    Page,
    NoData
  },
  data() {
    return {
      PageTotal: 1,
      routeName: "",
      tableData: [        
      ]
    };
  },
  filters: {
    getDappCategory: function (value) {
      var catetories =  ['Common',   'Business',   'Social',   'Education',
        'Entertainment',      'News',    'Life',     'Utilities',   'Games'];
      if (!value) return ''
      var idx = parseInt(value)
      if (idx !== NaN && idx > 0  && idx <= catetories.length) {
        return catetories[idx - 1];
      }
      return ""
    }
  },
  computed: {
    // showV() {
    //   return this.detailInfo.certified === "N" ? false : true;
    // },
    // src1() {
    //   return require(`../assets/images/${this.digWhat}1.png`);
    // },
    // src2() {
    //   return require(`../assets/images/${this.digWhat}2.png`);
    // }
  },
  created() {
    //this.$emit("setMinerDetail", sessionStorage.getItem("minerDetail"));
    //this.detailInfo = JSON.parse(sessionStorage.getItem("detailInfo"));
    this.getDappList();
    //this.getPowers();
  },
  mounted() {
    // this.radar();
    // this.line();
  },
  methods: {
    setBack() {
      window.history.back();
    },
    getDappList() {
      this.$http
        .get(HOST+"/api/dapps")
        .then(res => {
          console.log(res)
          if (res.data.success) {
            this.tableData = res.data.dapps
            
          }
        })
        .catch(e => {
          console.log(e);
        });
    },  
    renderDiff() {}
  }
};
</script>

<style scoped>
.w {
  padding: 10px;
}
</style>