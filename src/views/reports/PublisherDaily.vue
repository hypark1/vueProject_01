<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="response.date"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row class="col-12 p-0 ml-0">
          <b-form class="mb-4 cf text-center w-100">
            <div class="float-left">
              <v-select v-model="vModel.publisherSelect"
                        multiple
                        placeholder="전체"
                        :options="response.publisherSelectOptions"
                        style="min-width:250px"
                        @change="publisherClick" />
            </div>
          </b-form>
        </b-row>
        <b-row class="mb-4">
          <b-colxx xs="12" lg="3" v-for="(item,index) in config.cardDataField" :key="index" class="dashboard-card">
            <b-link @click="showGraphBtn(index)">
              <b-card :title="item.title" :class="{cardActive: vModel.showGraphArr[index]}" class="mb-4">
                <b-card-text style="font-size:1.8rem">{{ item.total }}</b-card-text>
                <!--<b-card-text class="position-absolute" style="top:1.75rem;right:1.75rem" :style="item.css">
                  <i :class="item.icon" class="mr-2"></i>
                  {{ item.change }}
                </b-card-text>-->
                <b-card-text class="position-absolute" style="right:1.75rem;bottom:1rem">
                  <i class="simple-icon-arrow-down font-weight-bold"></i>
                </b-card-text>
              </b-card>
            </b-link>
          </b-colxx>
        </b-row>
        <b-row class="mb-4">
          <b-colxx>
            <b-card v-if="response.publisherList">
              <span class="position-absolute" style="left:5rem;top:2rem">{{vModel.lineChart_y}}</span>
              <span class="position-absolute" style="right:5rem;bottom:3rem">시간</span>
              <div v-for="(item,index) in config.lineChartData" :key="index">
                <div v-show="vModel.showGraphArr[index]">
                  <line-shadow-chart :data="item" :height="300" class="col-11 ml-auto mr-auto p-0 pt-5 pb-5" style="height:396px"/>
                </div>
              </div>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx>
            <b-card class="mb-4 cf">
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="response.publisherList"
                       :fields="config.tableField">
                <template slot="empty">
                  해당 날짜의 데이터가 없습니다.
                </template>
                <template v-if="response.user_session.role == 'ADMINISTRATOR' || response.user_session.role == 'MANAGER'" slot="hope_pay" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template v-if="response.user_session.role == 'ADMINISTRATOR' || response.user_session.role == 'MANAGER'" slot="reward_pay" slot-scope="data">
                  {{numReplace(data.item.hope_pay - data.item.reward_pay)}}원
                </template>
                <template slot="share_pay" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template v-if="response.user_session.role == 'ADMINISTRATOR' || response.user_session.role == 'MANAGER'" slot="pay" slot-scope="data">
                  {{numReplace(data.item.reward_pay - data.item.share_pay)}}원
                </template>
                <template slot="page_views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="page_ctr" slot-scope="data">
                  {{data.value}}%
                </template>
                <template v-if="response.user_session.role == 'ADMINISTRATOR' || response.user_session.role == 'MANAGER'" slot="page_rpm" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template v-if="response.user_session.role == 'PUBLISHER'" slot="reward_page_rpm" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template slot="ad_views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="clicks" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="ad_ctr" slot-scope="data">
                  {{data.value}}%
                </template>
                <template v-if="response.user_session.role == 'ADMINISTRATOR' || response.user_session.role == 'MANAGER'" slot="page_rpm" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
                <template v-if="response.user_session.role == 'PUBLISHER'" slot="reward_ad_rpm" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
              </b-table>
            </b-card>
          </b-colxx>
        </b-row>
        <div class="text-center">
          <b-button variant="outline-danger" @click="beforePage()">뒤로가기</b-button>
        </div>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import vSelect from 'vue-select'
import LineShadowChart from '@/components/Charts/LineShadow'
import { ThemeColors } from '@/utils'
import { lineChartOptions } from '@/components/Charts/config'
const colors = ThemeColors()

export default {
  components: {
    vSelect,
    LineShadowChart
  },
  created () {
    this.getPublisherList()
  },
  data () {
    return {
      config: {
        cardDataField: [
          {
            title: '예상 수익',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '페이지 뷰',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '페이지 CTR',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '페이지 RPM',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '광고 노출',
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
            title: '광고 CTR',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          },
          {
            title: '노출 RPM',
            css: { color: '' },
            icon: null,
            total: '-',
            change: null
          }
        ],
        cardDataFieldReset: [],
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
        tableField: {},
        publishersField: {
          time: { label: '시간', sortable: true },
          share_pay: { label: '예상수익', tdClass: 'table_num' },
          page_views: { label: '페이지 뷰', tdClass: 'table_num' },
          page_ctr: { label: '페이지 CTR', tdClass: 'table_num' },
          reward_page_rpm: { label: '페이지 RPM', tdClass: 'table_num' },
          ad_views: { label: '광고 노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ad_ctr: { label: '광고 CTR', tdClass: 'table_num' },
          reward_ad_rpm: { label: '노출 RPM', tdClass: 'table_num' }
        },
        adminField: {
          time: { label: '시간', sortable: true },
          hope_pay: { label: '예상매출', tdClass: 'table_num' },
          reward_pay: { label: '대행사리워드', tdClass: 'table_num' },
          share_pay: { label: '매체수익', tdClass: 'table_num' },
          pay: { label: '예상수익', tdClass: 'table_num' },
          page_views: { label: '페이지 뷰', tdClass: 'table_num' },
          page_ctr: { label: '페이지 CTR', tdClass: 'table_num' },
          page_rpm: { label: '페이지 RPM', tdClass: 'table_num' },
          ad_views: { label: '광고 노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ad_ctr: { label: '광고 CTR', tdClass: 'table_num' },
          ad_rpm: { label: '노출 RPM', tdClass: 'table_num' }
        }
      },
      response: {
        spinner: true,
        date: this.$route.query.date,
        publisher: this.$route.params.publisher,
        user_session: JSON.parse(localStorage.getItem('user')),
        publisherShow: null,
        chart: {
          hope_pay: [],
          share_pay: [],
          page_views: [],
          page_ctr: [],
          page_rpm: [],
          reward_page_rpm: [],
          ad_views: [],
          clicks: [],
          ad_ctr: [],
          ad_rpm: [],
          reward_ad_rpm: [],
          label: null
        },
        publishers: null,
        publisherSelectOptions: [],
        publisherList: null
      },
      vModel: {
        publisherSelectArr: null,
        publisherSelect: [],
        showGraphArr: [true, false, false, false, false, false, false, false],
        lineChart_y: null
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    showGraphBtn: function (idx) {
      this.vModel.showGraphArr = [false, false, false, false, false, false, false, false]
      this.vModel.showGraphArr[idx] = true
      this.vModel.lineChart_y = this.config.cardDataField[idx].title
    },
    getPublisherList: function () {
      this.config.cardDataFieldReset = JSON.parse(JSON.stringify(this.config.cardDataField))
      this.vModel.lineChart_y = this.config.cardDataField[0].title
      let send = {
        page: 1
      }
      this.xhttp({
        url: 'report/' + this.response.user_session.id + '/site',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.publishers = response.data
          if (this.response.publishers !== null) {
            this.response.publisherSelectOptions = this.response.publishers.data.items.map(function ($value) {
              return { value: $value.id, label: $value.name }
            })
          }
        }
      }).catch((error) => {
        this.response.publishers = error.response
        this.respError(error)
      })
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
    getPublisherShow: function () {
      this.response.spinner = true
      let send = {}
      if (this.vModel.publisherSelectArr) {
        send.site_ids = this.vModel.publisherSelectArr
      }
      this.xhttp({
        url: 'report/' + this.response.user_session.id + '/publisher/' + this.response.date + '/hourly',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.publisherShow = response.data
          this.config.lineChartData = []
          this.response.chart.hope_pay = []
          this.response.chart.share_pay = []
          this.response.chart.page_views = []
          this.response.chart.page_ctr = []
          this.response.chart.page_rpm = []
          this.response.chart.reward_page_rpm = []
          this.response.chart.ad_views = []
          this.response.chart.clicks = []
          this.response.chart.ad_ctr = []
          this.response.chart.ad_rpm = []
          this.response.chart.reward_ad_rpm = []
          this.response.publisherList = null
          if (response.data.data === null) {
            this.$notify('error', '데이터 없음', '데이터가 없습니다.')
            this.config.cardDataField = JSON.parse(JSON.stringify(this.config.cardDataFieldReset))
            this.response.publisherList = null
          } else {
            if (this.response.publisherShow !== false) {
              let data = JSON.parse(JSON.stringify(this.response.publisherShow.data))
              this.response.publisherList = this.response.publisherShow.data.chart.data
              this.response.publisherShow.data.chart.data.unshift(
                {
                  id: 'sum',
                  time: '일간 합계',
                  hope_pay: this.response.publisherShow.data.total.hope_pay,
                  share_pay: this.response.publisherShow.data.total.share_pay,
                  reward_pay: this.response.publisherShow.data.total.reward_pay,
                  pay: this.response.publisherShow.data.total.reward_pay - this.response.publisherShow.data.total.share_pay,
                  page_views: this.response.publisherShow.data.total.page_views,
                  page_ctr: this.response.publisherShow.data.total.page_ctr,
                  page_rpm: this.response.publisherShow.data.total.page_rpm,
                  reward_page_rpm: this.response.publisherShow.data.total.reward_page_rpm,
                  ad_views: this.response.publisherShow.data.total.ad_views,
                  clicks: this.response.publisherShow.data.total.clicks,
                  ad_ctr: this.response.publisherShow.data.total.ad_ctr,
                  ad_rpm: this.response.publisherShow.data.total.ad_rpm,
                  reward_ad_rpm: this.response.publisherShow.data.total.reward_ad_rpm,
                  _rowVariant: 'secondary'
                }
              )
              // chart
              this.respChart(data)
              if (this.response.user_session.role === 'PUBLISHER') {
                this.config.tableField = this.config.publishersField
              } else {
                this.config.tableField = this.config.adminField
              }
            }
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.publisherShow = error.response
        this.respError(error)
      })
    },
    respChart: function (data) {
      let field = this.config.cardDataField
      let m = []
      if (this.response.user_session.role === 'PUBLISHER') {
        m = ['share_pay', 'page_views', 'page_ctr', 'reward_page_rpm', 'ad_views', 'clicks', 'ad_ctr', 'reward_ad_rpm']
      } else {
        m = ['hope_pay', 'page_views', 'page_ctr', 'page_rpm', 'ad_views', 'clicks', 'ad_ctr', 'ad_rpm']
      }
      let v = ['total', 'change']
      for (let mi in m) {
        for (let vi in v) {
          let key = v[vi]
          let val = data[key][m[mi]]
          if (key === 'total') {
            if (mi === '0') {
              field[mi][key] = this.numReplace(val) + '원'
            } else if (mi === '2' || mi === '6') {
              field[mi][key] = val.toFixed(2) + '%'
            } else if (mi === '3' || mi === '7') {
              field[mi][key] = val.toFixed(2) + '원'
            } else {
              field[mi][key] = this.numReplace(val)
            }
          } else {
            if (mi === '0' || mi === '1' || mi === '4' || mi === '5') {
              field[mi][key] = this.numReplace(val)
            } else {
              field[mi][key] = val.toFixed(2)
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
        this.response.chart.hope_pay.push(data.chart.data[i].hope_pay)
        this.response.chart.share_pay.push(data.chart.data[i].share_pay)
        this.response.chart.page_views.push(data.chart.data[i].page_views)
        this.response.chart.page_ctr.push(data.chart.data[i].page_ctr)
        this.response.chart.page_rpm.push(data.chart.data[i].page_rpm)
        this.response.chart.reward_page_rpm.push(data.chart.data[i].reward_page_rpm)
        this.response.chart.ad_views.push(data.chart.data[i].ad_views)
        this.response.chart.clicks.push(data.chart.data[i].clicks)
        this.response.chart.ad_ctr.push(data.chart.data[i].ad_ctr)
        this.response.chart.ad_rpm.push(data.chart.data[i].ad_rpm)
        this.response.chart.reward_ad_rpm.push(data.chart.data[i].reward_ad_rpm)
      }

      this.response.chart.label = data.chart.label
      let data2 = this.response.publisherShow.data.chart
      let chart = this.response.chart
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.share_pay, data2.share_pay)
      } else {
        this.chartShowDom(chart.label, chart.hope_pay, data2.hope_pay)
      }
      this.chartShowDom(chart.label, chart.page_views, data2.page_views)
      this.chartShowDom(chart.label, chart.page_ctr, data2.page_ctr)
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.reward_page_rpm, data2.reward_page_rpm)
      } else {
        this.chartShowDom(chart.label, chart.page_rpm, data2.page_rpm)
      }
      this.chartShowDom(chart.label, chart.ad_views, data2.ad_views)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks)
      this.chartShowDom(chart.label, chart.ad_ctr, data2.ad_ctr)
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.reward_ad_rpm, data2.reward_ad_rpm)
      } else {
        this.chartShowDom(chart.label, chart.ad_rpm, data2.ad_rpm)
      }
    },
    chartShowDom: function (label, chart, data) {
      let lineChart1 = JSON.parse(JSON.stringify(this.config.lineChartEx))
      if (label[0] === 23) {
        lineChart1.labels = label.reverse()
      } else {
        lineChart1.labels = label
      }
      lineChart1.datasets[0].data = chart.reverse()
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
      let dataMin = (parseInt(data.min) / num) * num
      let dataMax = (parseInt(data.max) / num) * num
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
    submitDateSearch: function () {
      this.config.lineChartData = []
      this.getPublisherShow()
    },
    publisherClick () {
      this.vModel.publisherSelectArr = this.vModel.publisherSelect.map(function ($value) {
        return $value.value
      })
      this.config.lineChartData = []
      this.getPublisherShow()
    },
    beforePage () {
      this.$router.go(-1)
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
  }
}
</script>
