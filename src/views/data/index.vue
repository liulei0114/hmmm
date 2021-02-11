<template>
  <div id="DataViewWrap">
    <div class="one_row">
      <el-card>
        <div class="title flexBetween">
          <span>总答题数量</span>
          <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div class="contain">
          <div class="char" style="height140px;lineHeight:140px;fontSize:30px;marginLeft:20px">
            <span>260,560</span>
          </div>
          <div>
            <span>
              周同比 12%
              <i class="el-icon-caret-top" style="color:red"></i>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              日环比 11%
              <i class="el-icon-caret-bottom" style="color:green"></i>
            </span>
          </div>
        </div>
        <div class="bottom">日答题数量&nbsp;&nbsp;&nbsp;&nbsp;12,423</div>
      </el-card>
      <el-card>
        <div class="title flexBetween">
          <span>试题方向</span>
          <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div class="contain" ref="radar"></div>
        <div class="bottom">试题库数量&nbsp;&nbsp;&nbsp;&nbsp;10,234</div>
      </el-card>
      <el-card>
        <div class="title flexBetween">
          <span>试题学科分布</span>
          <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div class="contain" ref="pie"></div>
        <div class="bottom">前端试题数量&nbsp;&nbsp;&nbsp;&nbsp;5,234</div>
      </el-card>
      <el-card>
        <div class="title flexBetween">
          <span>上周试题新增</span>
          <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div class="contain" ref="bar"></div>
        <div class="bottom">上周新增总量&nbsp;&nbsp;&nbsp;&nbsp;1,234</div>
      </el-card>
    </div>
    <div class="two_row">
      <div class="compare_text">前端与java学科试题走势图</div>
      <el-card class="box-card">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">前端学科</el-menu-item>
          <el-menu-item index="2">JAVA学科</el-menu-item>
        </el-menu>
        <div class="flexC subject_rank_con">
          <div ref="line" class="line_wrap"></div>
          <div class="sub_rank">
            <p class="title">学科试题数量排名</p>
            <div v-for="(sub,index) in subRankDataList" :key="sub.id" class="rank_list flexC">
              <span class="sort" :class="isTopThree(index + 1)">{{index + 1}}</span>
              <span style="marginLeft:20px">{{sub.name}}</span>
              <span style="marginLeft:auto;marginRight:30px">{{sub.count}}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      raderOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['55%', '55%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '逻辑思维', max: 20000 },
            { name: '项目相关', max: 20000 },
            { name: '基础知识', max: 20000 },
            { name: '理论基础', max: 20000 },
            { name: '高阶技术', max: 20000 }
          ]
        },
        series: [
          {
            type: 'radar',
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              }
            },
            data: [
              {
                value: [15000, 17000, 12000, 11000, 15000],
                name: '逻辑思维'
              }
            ],
            animationDuration: 3000
          }
        ]
      },
      pieOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [20, 70],
            center: ['55%', '55%'],
            data: [
              { value: 320, name: '前端' },
              { value: 240, name: 'java' },
              { value: 149, name: 'python' },
              { value: 100, name: 'c++' },
              { value: 59, name: 'UI' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 3000
          }
        ]
      },
      barOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration: 3000
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration: 3000
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration: 3000
          }
        ]
      },
      lineOption: {
        xAxis: {
          data: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 5,
          right: 20,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 5]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['数量']
        },
        series: [
          {
            name: '数量',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 3
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            animationDuration: 3000,
            animationEasing: 'quadraticOut'
          }
        ]
      },
      activeIndex: '1',
      webData: [120, 82, 91, 154, 162, 140, 15, 120, 82, 91, 154, 162],
      javaData: [100, 200, 97, 234, 13, 78, 80, 100, 120, 67, 150, 120],
      lineNode: null,
      subRankDataList: [
        { id: 1, name: '前端', count: '5,234' },
        { id: 2, name: 'java', count: '3,210' },
        { id: 3, name: '大数据', count: '1,294' },
        { id: 4, name: 'c++', count: '1,001' },
        { id: 5, name: 'UI', count: '934' },
        { id: 6, name: 'php', count: '856' },
        { id: 7, name: 'python', count: '403' },
        { id: 8, name: '测试', count: '122' }
      ]
    }
  },
  mounted () {
    let radarNode = this.$echarts.init(this.$refs.radar)
    radarNode.setOption(this.raderOption)
    let pieNode = this.$echarts.init(this.$refs.pie)
    pieNode.setOption(this.pieOption)
    let barNode = this.$echarts.init(this.$refs.bar)
    barNode.setOption(this.barOption)
    this.initLineChart(this.webData)
    // * 圆滑折线图
  },
  methods: {
    handleSelect (index) {
      this.activeIndex = index
      this.initLineChart(
        this.activeIndex === '1' ? this.webData : this.javaData
      )
    },
    initLineChart (actualData) {
      if (this.lineNode) {
        this.lineNode.clear()
      } else {
        this.lineNode = this.$echarts.init(this.$refs.line)
      }
      this.lineOption.series[0].data = actualData
      this.lineNode.setOption(this.lineOption)
    },
    isTopThree (index) {
      if (index <= 3) {
        return {
          isTopThree: true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#DataViewWrap {
  width: 100%;
  .one_row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .el-card {
      width: 24%;
      height: 240px;
      background-color: #fff;
      /deep/ .el-card__body {
        padding: 10px 20px;
        .title {
          color: #97a8be;
          i {
            font-size: 16px;
          }
        }
        .contain {
          height: 165px;
          border-bottom: 1px solid #e8e8e8;
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
  }
  .two_row {
    width: 100%;
    position: relative;
    margin-top: 20px;
    .compare_text {
      position: absolute;
      top: 30px;
      right: 20px;
      color: rgb(153, 153, 153);
      font-size: 16px;
      z-index: 10;
    }
    /deep/ .el-card__body {
      padding: 10px 20px;
    }
    .subject_rank_con {
      height: 300px;
      padding-top: 15px;
      .line_wrap {
        width: 70%;
        height: 100%;
      }
      .sub_rank {
        width: 30%;
        height: 100%;
        padding-left: 10px;
        .title {
        }
        .rank_list {
          width: 100%;
          height: 20px;
          margin-bottom: 10px;
          font-size: 16px;
          color: #000;
          list-style-type: none;
          span:first-child {
            width: 20px;
            height: 20px;
            text-align: center;
            font-size: 12px;
            line-height: 20px;
            font-weight: 600;
            border-radius: 50%;
            background-color: #f5f5f5;
            &.isTopThree {
              background-color: #314659;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
