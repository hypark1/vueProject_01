<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-row class="col-12 p-0 ml-0">
          <b-form @submit.prevent="submitDateSearch" class="mb-4 cf text-center w-100">
            <div class="float-right">
              <b-form-select v-model="vModel.dateCategory"
                             :options="response.dateCategoryOptions"
                             style="width:150px"
                             class="float-left align-top mr-2"
                             plain required
                             @change="currentDate">
              </b-form-select>
              <div class="float-left cf">
                <v-date-picker
                  v-show="vModel.datePickerDisplay"
                  mode="range"
                  class="float-left align-top"
                  :input-props="{ class:'form-control', readonly:'true', style:'background:#fff' }"
                  v-model="vModel.datePickerRange">
                </v-date-picker>
                <b-form-input v-show="!vModel.datePickerDisplay" v-model="vModel.dateInputRange.text" class="float-left" readonly style="width:180px;background:#fff"></b-form-input>
                <div class="float-left form-control border-left-0" v-show="false" style="width:42.58px;cursor:pointer"><i class="simple-icon-arrow-left" style="color:#212121"></i> </div>
                <div class="float-left form-control border-left-0" v-show="false" style="width:42.58px;cursor:pointer"><i class="simple-icon-arrow-right" style="color:#212121"></i> </div>
                <b-button type="submit" size="md" variant="light default" class="ml-2">검색</b-button>
              </div>
            </div>
          </b-form>
        </b-row>
        <b-row class="mb-4">
          <b-colxx xs="6" lg="3" v-for="(item,index) in config.cardDataField" :key="index" class="dashboard-card">
            <b-link @click="showGraphBtn(index)">
              <b-card :title="item.title" :class="{cardActive: vModel.showGraphArr[index]}">
                <b-card-text style="font-size:1.8rem">{{ item.total }}</b-card-text>
                <!--<b-card-text class="position-absolute" style="top:1.75rem;right:1.75rem" :style="item.css">
                  <i :class="item.icon" class="mr-2"></i>
                  {{ item.change }}
                </b-card-text>-->
              </b-card>
            </b-link>
          </b-colxx>
        </b-row>
        <b-row class="mb-4">
          <b-colxx>
            <template v-if="config.lineChartData.length > 0">
              <b-card v-if="response.agentList">
                <span class="position-absolute" style="left:5rem;top:2rem">{{vModel.lineChart_y}}</span>
                <span class="position-absolute" style="right:5rem;bottom:3rem">날짜</span>
                <div v-for="(item,index) in config.lineChartData" :key="index">
                  <div v-show="vModel.showGraphArr[index]">
                    <line-shadow-chart :data="item" :height="300" class="col-11 ml-auto mr-auto p-0 pt-5 pb-5" style="height:396px"/>
                  </div>
                </div>
              </b-card>
            </template>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx class="col-lg-4 col-sm-12">
            <b-card class="mb-4 cf" title="효율 분석">
              <template v-if="resultAgent">
                <b-card class="shadow-none border">
                  <b-card-text>클릭당 단가</b-card-text>
                  <b-card-text style="font-size:1.8rem">{{ resultAgent.click_pay }}원</b-card-text>
                </b-card>
                <b-card class="shadow-none border mt-3">
                  <b-card-text>예산 소진율</b-card-text>
                  <b-card-text style="font-size:1.8rem">{{ resultAgent.pay_p }}%</b-card-text>
                </b-card>
              </template>
              <template v-else><b-card-text style="font-size:1.8rem">-</b-card-text></template>
            </b-card>
          </b-colxx>
          <b-colxx class="col-lg-8 col-sm-12">
            <b-card class="mb-4 cf" title="주요 캠페인">
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="response.agentList"
                       :fields="config.agentField"
                       :current-page="currentPage">
                <template slot="empty">
                  캠페인이 없습니다.
                </template>
                <template slot="amount" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template slot="amount_p" slot-scope="data">
                  <b-progress class="h-25">
                    <b-progress-bar :value="percentFixed(data)"
                                    :variant="existsDeliveringLineItem(data) ? 'success' : 'warning' "
                                    :striped="existsDeliveringLineItem(data)"
                                    :animated="existsDeliveringLineItem(data)"
                                    :label-html="`<strong style='color: black'>` + percentFixed(data) + `%</strong>`">
                    </b-progress-bar>
                  </b-progress>
                </template>
                <template slot="clicks" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="ctr" slot-scope="data">
                  {{data.value}}%
                </template>
              </b-table>
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LineShadowChart from '@/components/Charts/LineShadow'
import { ThemeColors } from '@/utils'
import { lineChartOptions } from '@/components/Charts/config'
const colors = ThemeColors()

export default {
  components: {
    LineShadowChart
  },
  created () {
    this.currentDate()
    this.getAgent()
  },
  data () {
    return {
      config: {
        cardDataField: [
          {
            title: '노출',
            css: { color: '' },
            icon: null,
            total: null,
            change: null
          },
          {
            title: '클릭',
            css: { color: '' },
            icon: null,
            total: null,
            change: null
          },
          {
            title: 'CTR',
            css: { color: '' },
            icon: null,
            total: null,
            change: null
          },
          {
            title: '소진 예산',
            css: { color: '' },
            icon: null,
            total: null,
            change: null
          }
        ],
        cardDataFieldReset: [
          {
            title: '노출',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '클릭',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: 'CTR',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '소진 예산',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          }
        ],
        lineChartOptions: lineChartOptions,
        lineChartEx: {
          labels: null,
          datasets: [
            {
              label: '',
              data: null,
              borderColor: colors.themeColor1,
              pointBackgroundColor: colors.foregroundColor,
              pointBorderColor: colors.themeColor1,
              pointHoverBackgroundColor: colors.themeColor1,
              pointHoverBorderColor: colors.foregroundColor,
              pointRadius: 6,
              pointBorderWidth: 2,
              pointHoverRadius: 8,
              fill: false
            }
          ],
          options: null
        },
        lineChartData: [],
        agentField: {
          line_item_id: { label: 'ID' },
          line_item_name: { label: '캠페인명', tdClass: 'table_title' },
          user_name: { label: '광고주' },
          amount: { label: '소진 예산', tdClass: 'table_num' },
          amount_p: { label: '소진율', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' }
        }
      },
      response: {
        spinner: true,
        line_item_id: this.$route.params.line_item_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        Agent: null,
        company_id: null,
        chart: {
          views: [],
          clicks: [],
          ctr: [],
          pay: [],
          label: null
        },
        dateCategoryOptions: [
          { value: 0, text: '1일' },
          { value: 1, text: '7일' },
          { value: 2, text: '15일' },
          { value: 3, text: '1달' },
          { value: 4, text: '3달' },
          { value: 5, text: '6달' },
          { value: 6, text: '1년' }
        ],
        agentList: null
      },
      vModel: {
        dateCategory: 1,
        dateInputRange: {
          start: new Date(),
          end: new Date(),
          text: ''
        },
        datePickerRange: {
          start: new Date(),
          end: new Date()
        },
        datePickerDisplay: false,
        showGraphArr: [true, false, false, false],
        lineChart_y: '노출'
      },
      currentPage: 1
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: ''
      }
    },
    showGraphBtn: function (idx) {
      this.vModel.showGraphArr = [false, false, false, false]
      this.vModel.showGraphArr[idx] = true
      var lineChart = ['노출', '클릭', 'CTR', '소진예산']
      this.vModel.lineChart_y = lineChart[idx]
    },
    numReplace: function (num) {
      num = (num + '').split('.')
      const result = num[0].replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      if (num[1]) {
        return result + '.' + num[1]
      } else {
        return result
      }
    },
    getAgent: function () {
      this.response.spinner = true
      let send = {
        start_date: this.$moment(this.vModel.dateInputRange.start).format('YYYY-MM-DD'),
        end_date: this.$moment(this.vModel.dateInputRange.end).format('YYYY-MM-DD')
      }
      this.xhttp({
        url: 'report/' + this.response.user_session.id + '/agent',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.Agent = response.data
          if (response.data.data === null) {
            this.response.Agent = null
            this.$notify('error', '데이터 없음', '데이터가 없습니다.')
            this.config.lineChartData = []
            this.config.cardDataField = JSON.parse(JSON.stringify(this.config.cardDataFieldReset))
            this.response.chart.views = []
            this.response.chart.clicks = []
            this.response.chart.ctr = []
            this.response.chart.pay = []
            this.response.agentList = null
          } else {
            if (this.response.Agent !== false) {
              let data = JSON.parse(JSON.stringify(this.response.Agent.data))
              this.response.agentList = this.response.Agent.data.list
              this.response.chart.views = []
              this.response.chart.clicks = []
              this.response.chart.ctr = []
              this.response.chart.pay = []
              // chart
              this.respChart(data)
            }
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.Agent = error.response
        this.respError(error)
      })
    },
    respChart: function (data) {
      let field = this.config.cardDataField
      let m = ['views', 'clicks', 'ctr', 'pay']
      let v = ['total', 'change']
      for (let mi in m) {
        for (let vi in v) {
          let key = v[vi]
          let val = data[key][m[mi]]
          if (key === 'total') {
            if (mi === '2') {
              field[mi][key] = val + '%'
            } else if (mi === '3') {
              field[mi][key] = this.numReplace(val) + '원'
            } else {
              field[mi][key] = this.numReplace(val)
            }
          } else {
            if (mi === '2') {
              field[mi][key] = val
            } else {
              field[mi][key] = this.numReplace(val)
            }
            if (val < 0) {
              field[mi].css.color = 'red'
              field[mi].icon = 'simple-icon-arrow-down'
            } else if (val > 0) {
              field[mi].css.color = 'blue'
              field[mi].icon = 'simple-icon-arrow-up'
            } else {
              field[mi].css.color = 'black'
              field[mi].icon = ''
            }
          }
        }
      }
      for (var i = 0; i < data.chart.data.length; i++) {
        this.response.chart.views.push(data.chart.data[i].views)
        this.response.chart.clicks.push(data.chart.data[i].clicks)
        this.response.chart.ctr.push(data.chart.data[i].ctr)
        this.response.chart.pay.push(data.chart.data[i].pay)
      }

      this.response.chart.label = data.chart.label.map(function ($value) {
        return $value.substr(5, 2) + '/' + $value.substr(8, 2)
      })
      let data2 = this.response.Agent.data.chart
      let chart = this.response.chart
      this.chartShowDom(chart.label, chart.views, data2.views, data2.data, data2.data[0].views)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks, data2.data, data2.data[0].clicks)
      this.chartShowDom(chart.label, chart.ctr, data2.ctr, data2.data, data2.data[0].ctr)
      this.chartShowDom(chart.label, chart.pay, data2.pay, data2.data, data2.data[0].pay)
    },
    chartShowDom: function (label, chart, data, data2, data3) {
      let lineChart1 = JSON.parse(JSON.stringify(this.config.lineChartEx))
      lineChart1.labels = label
      lineChart1.datasets[0].data = chart
      // num 최소/최대값 자릿수에 따라 작은 단위 숫자 버리기
      let num = '1'
      let minLength = Math.floor(data.min).toString().length
      if (minLength > 2) {
        for (var i = 0; i < minLength - 3; i++) {
          num += '0'
        }
      }
      num = Number(num)
      let lineChartOptions1 = JSON.parse(JSON.stringify(this.config.lineChartOptions))
      let dataMin = parseInt(Number(data.min) / num) * num
      let dataMax = parseInt(Number(data.max) / num) * num
      if (data2.length === 1) {
        // 1일 선택했고, 합계없을때
        dataMin = parseInt(data3)
        dataMax = parseInt(data3)
      }
      // dataNum 값에 따라 y축 5개로 나뉘도록 stepSize 자동
      let dataNum = Math.round(((dataMax - dataMin) + ((dataMax - dataMin) / 2)) / 5)
      // range 그래프의 y축이 최소/최대 값보다 한칸 +-
      let range = dataNum
      if (dataNum === 0) {
        dataNum = 1
        range = 2
      }
      lineChartOptions1.scales.yAxes[0].ticks.min = dataMin - range
      let min2 = lineChartOptions1.scales.yAxes[0].ticks.min
      if (min2 < 0) {
        lineChartOptions1.scales.yAxes[0].ticks.min = 0
      }
      lineChartOptions1.scales.yAxes[0].ticks.max = dataMax + range
      lineChartOptions1.scales.yAxes[0].ticks.stepSize = dataNum
      lineChart1.options = lineChartOptions1
      this.config.lineChartData.push(lineChart1)
    },
    currentDate () {
      switch (this.vModel.dateCategory) {
        case 0 :
          this.vModel.dateInputRange.start = this.$moment(new Date())._d
          break
        case 1 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-6, 'days')._d
          break
        case 2 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-14, 'days')._d
          break
        case 3 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-1, 'months').add(1, 'days')._d
          break
        case 4 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-3, 'months').add(1, 'days')._d
          break
        case 5 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-6, 'months').add(1, 'days')._d
          break
        case 6 :
          this.vModel.dateInputRange.start = this.$moment(new Date()).add(-1, 'years').add(1, 'days')._d
          break
      }
      let start = this.$moment(this.vModel.dateInputRange.start).format('YYYY.MM.DD')
      let end = this.$moment(this.vModel.dateInputRange.end).format('YYYY.MM.DD')
      this.vModel.dateInputRange.text = start + ' - ' + end
    },
    submitDateSearch: function () {
      this.config.lineChartData = []
      this.getAgent()
    },
    /**
     * Order의 lineItems들 중 DEVELIVERING 상태인게 있나?
     * @param Statuses
     * @returns {boolean}
     */
    existsDeliveringLineItem (Statuses) {
      var num = this.percentFixed(Statuses)
      if (num > 0 && num < 100) {
        return true
      } else {
        return false
      }
    },
    percentFixed (data) {
      if (data.item.amount_p === '0' || data.item.budget === 0) {
        return 0
      } else {
        return Number(data.item.amount_p)
      }
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      if (error.response.data.messages.message) {
        this.$notify('error', '오류', error.response.data.messages.message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    }
  },
  computed: {
    resultAgent () {
      if (this.response.Agent && this.response.Agent.success === true && this.response.Agent.data) {
        return this.response.Agent.data
      } else {
        return false
      }
    }
  }
}
</script>
