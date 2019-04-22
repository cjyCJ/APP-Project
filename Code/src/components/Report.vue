<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <!--数据图表的显示区域-->
      <div ref="mypic" style="width:750px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts模块
import echarts from 'echarts'

export default {
  // 生命周期函数
  // beforeCreate
  // created()
  // beforeMount()
  mounted() {
    // vue已经完成页面容器部分的渲染工作了(数据图表区域已经ok)
    this.paintPic()
  },
  methods: {
    // 生成数据图表的
    paintPic() {
      // 使得echarts找到绘制图表的区域
      var myChart = echarts.init(this.$refs.mypic)

      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      }
      myChart.setOption(option)
      // 生成制作图表
      /*
      myChart.setOption({
        // 图表标题信息
        title: {
          text: 'ECharts 入门示例'
        },
        // 鼠标滑过项目的提示
        tooltip: {},
        // x轴显示的信息
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        // y轴信息制作部分(也可以根据数据自适应显示)
        yAxis: {},
        // 数据表的数据部分
        series: [
          {
            name: '销量',
            type: 'bar',  // 柱形图  line  pie
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
      */
    }
  }
}
</script>

<style lang="less" scoped>
</style>
