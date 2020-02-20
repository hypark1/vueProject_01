<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="기간별 보고서"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row class="col-12 p-0 ml-0">
          <b-form @submit.prevent="submitSearch" class="mb-4 cf text-center w-100">
            <div class="float-left">
              <v-select v-model="vModel.publisherSelect"
                        multiple
                        placeholder="전체"
                        :options="response.publisherSelectOptions"
                        style="display:inline-block;width:250px;"
                        @change="publisherClick" />
              <b-button type="submit" size="md" variant="light default" class="d-inline-block">검색</b-button>
            </div>
            <div class="float-right">
              <b-form-select v-model="vModel.dateCategory"
                             :options="response.dateCategoryOptions"
                             style="width:150px;height:43px;"
                             class="float-left align-top mr-2"
                             plain required
                             @change="currentDate">
              </b-form-select>
              <div class="float-left cf">
                <v-date-picker
                  mode="range"
                  class="float-left align-top"
                  v-model="datePickerRange">
                  <input
                    id="date"
                    class="form-control"
                    readonly
                    style="background:#fff"
                    v-model="vModel.datePickerRangeText">
                </v-date-picker>
                <b-button type="submit" size="md" variant="light default" class="ml-2">검색</b-button>
              </div>
            </div>
          </b-form>
        </b-row>
        <b-row class="mb-4">
          <b-colxx xs="6" lg="3" v-for="(item,index) in config.cardDataField" :key="index" class="dashboard-card">
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
              <h2 class="mb-4">{{vModel.datePickerRangeChart}}</h2>
              <span class="position-absolute" style="left:5rem;top:5rem">{{vModel.lineChart_y}}</span>
              <span class="position-absolute" style="right:5rem;bottom:3rem">날짜</span>
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
                       hover
                       bordered
                       show-empty
                       :items="response.publisherList"
                       :fields="config.tableField"
                       @row-clicked="tableRowClick">
                <template slot="empty">
                  해당 기간의 데이터가 없습니다.
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
                <template slot="ad_vctr" slot-scope="data">
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
    this.getPublisherShow()
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
            title: '광고 vCTR',
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
          date: { label: '날짜', sortable: true },
          share_pay: { label: '예상수익', tdClass: 'table_num' },
          page_views: { label: '페이지 뷰', tdClass: 'table_num' },
          page_ctr: { label: '페이지 CTR', tdClass: 'table_num' },
          reward_page_rpm: { label: '페이지 RPM', tdClass: 'table_num' },
          ad_views: { label: '광고 노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ad_vctr: { label: '광고 vCTR', tdClass: 'table_num' },
          reward_ad_rpm: { label: '노출 RPM', tdClass: 'table_num' }
        },
        adminField: {
          date: { label: '날짜', sortable: true },
          hope_pay: { label: '예상매출', tdClass: 'table_num' },
          reward_pay: { label: '대행사리워드', tdClass: 'table_num' },
          share_pay: { label: '매체수익', tdClass: 'table_num' },
          pay: { label: '예상수익', tdClass: 'table_num' },
          page_views: { label: '페이지 뷰', tdClass: 'table_num' },
          page_ctr: { label: '페이지 CTR', tdClass: 'table_num' },
          page_rpm: { label: '페이지 RPM', tdClass: 'table_num' },
          ad_views: { label: '광고 노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ad_vctr: { label: '광고 vCTR', tdClass: 'table_num' },
          ad_rpm: { label: '노출 RPM', tdClass: 'table_num' }
        }
      },
      response: {
        spinner: true,
        line_item_id: this.$route.params.line_item_id,
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
          ad_vctr: [],
          ad_rpm: [],
          reward_ad_rpm: [],
          label: null
        },
        publishers: null,
        publisherSelectOptions: [],
        dateCategoryOptions: [
          { value: 0, text: '1일' },
          { value: 1, text: '7일' },
          { value: 2, text: '15일' },
          { value: 3, text: '1달' },
          { value: 4, text: '3달' },
          { value: 5, text: '6달' },
          { value: 6, text: '1년' }
        ],
        publisherList: null
      },
      vModel: {
        publisherSelectArr: null,
        publisherSelect: [],
        dateCategory: this.$route.query.type,
        datePickerRangeText: null,
        datePickerDisplay: false,
        showGraphArr: [true, false, false, false, false, false, false, false],
        lineChart_y: null
      },
      datePickerRange: {
        start: this.$moment(this.$route.query.start)._d,
        end: this.$moment(this.$route.query.end)._d
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
      this.response.spinner = true
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
          this.response.publisherSelectOptions = this.response.publishers.data.items.map(function ($value) {
            return { value: $value.id, label: $value.name }
          })
          this.fnRefresh()
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
      let send = {
        start_date: this.$route.query.start,
        end_date: this.$route.query.end
      }
      let siteId = this.$route.query.id
      if (siteId) {
        if (typeof siteId === 'string') {
          send.site_ids = [siteId]
        } else {
          send.site_ids = siteId
        }
      }
      this.xhttp({
        url: 'report/' + this.response.user_session.id + '/publisher',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.publisherShow = response.data
          if (response.data.data === null) {
            this.$notify('error', '데이터 없음', '데이터가 없습니다.')
            this.config.cardDataField = JSON.parse(JSON.stringify(this.config.cardDataFieldReset))
            this.response.spinner = false
          } else {
            if (this.response.publisherShow !== false) {
              let data = JSON.parse(JSON.stringify(this.response.publisherShow.data))
              this.response.publisherList = this.response.publisherShow.data.chart.data.reverse()
              this.response.publisherShow.data.chart.data.unshift(
                {
                  id: 'sum',
                  date: '합계',
                  hope_pay: this.response.publisherShow.data.total.pay,
                  share_pay: this.response.publisherShow.data.total.share_pay,
                  reward_pay: this.response.publisherShow.data.total.reward_pay,
                  pay: this.response.publisherShow.data.total.reward_pay - this.response.publisherShow.data.total.share_pay,
                  page_views: this.response.publisherShow.data.total.page_views,
                  page_ctr: this.response.publisherShow.data.total.page_ctr,
                  page_rpm: this.response.publisherShow.data.total.page_rpm,
                  reward_page_rpm: this.response.publisherShow.data.total.reward_page_rpm,
                  ad_views: this.response.publisherShow.data.total.ad_views,
                  clicks: this.response.publisherShow.data.total.clicks,
                  ad_vctr: this.response.publisherShow.data.total.ad_vctr,
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
          this.vModel.datePickerRangeChart = this.vModel.datePickerRangeText
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
        m = ['share_pay', 'page_views', 'page_ctr', 'reward_page_rpm', 'ad_views', 'clicks', 'ad_vctr', 'reward_ad_rpm']
      } else {
        m = ['hope_pay', 'page_views', 'page_ctr', 'page_rpm', 'ad_views', 'clicks', 'ad_vctr', 'ad_rpm']
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
              field[mi][key] = val + '%'
            } else if (mi === '3' || mi === '7') {
              field[mi][key] = val + '원'
            } else {
              field[mi][key] = this.numReplace(val)
            }
          } else {
            if (mi === '0' || mi === '1' || mi === '4' || mi === '5') {
              field[mi][key] = this.numReplace(val)
            } else {
              field[mi][key] = val
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
        this.response.chart.ad_vctr.push(data.chart.data[i].ad_vctr)
        this.response.chart.ad_rpm.push(data.chart.data[i].ad_rpm)
        this.response.chart.reward_ad_rpm.push(data.chart.data[i].reward_ad_rpm)
      }

      this.response.chart.label = data.chart.label.map(function ($value) {
        return $value.substr(5, 2) + '/' + $value.substr(8, 2)
      })
      let data2 = this.response.publisherShow.data.chart
      let chart = this.response.chart
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.share_pay, data2.share_pay, data2.data, data2.data[1].share_pay)
      } else {
        this.chartShowDom(chart.label, chart.hope_pay, data2.hope_pay, data2.data, data2.data[1].hope_pay)
      }
      this.chartShowDom(chart.label, chart.page_views, data2.page_views, data2.data, data2.data[1].page_views)
      this.chartShowDom(chart.label, chart.page_ctr, data2.page_ctr, data2.data, data2.data[1].page_ctr)
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.reward_page_rpm, data2.reward_page_rpm, data2.data, data2.data[1].reward_page_rpm)
      } else {
        this.chartShowDom(chart.label, chart.page_rpm, data2.page_rpm, data2.data, data2.data[1].page_rpm)
      }
      this.chartShowDom(chart.label, chart.ad_views, data2.ad_views, data2.data, data2.data[1].ad_views)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks, data2.data, data2.data[1].clicks)
      this.chartShowDom(chart.label, chart.ad_vctr, data2.ad_vctr, data2.data, data2.data[1].ad_vctr)
      if (this.response.user_session.role === 'PUBLISHER') {
        this.chartShowDom(chart.label, chart.reward_ad_rpm, data2.reward_ad_rpm, data2.data, data2.data[1].reward_ad_rpm)
      } else {
        this.chartShowDom(chart.label, chart.ad_rpm, data2.ad_rpm, data2.data, data2.data[1].ad_rpm)
      }
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
      if (data2.length === 2) {
        // 1일 선택했고, 합계있을때
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
    fnRefresh: function () {
      this.vModel.dateCategory = Number(this.vModel.dateCategory)
      let start = this.$route.query.start
      let end = this.$route.query.end
      let pubArr = this.$route.query.id
      if (pubArr) {
        this.$router.push({ name: 'reportPublisherPeriod', query: { type: this.vModel.dateCategory, start: start, end: end, id: pubArr } })
        let pub = []
        if (typeof pubArr === 'string') {
          let result = this.response.publisherSelectOptions.filter(function (val) {
            return Number(val.value) === Number(pubArr)
          })
          if (result) { pub.push(result[0]) }
          this.vModel.publisherSelectArr = [this.$route.query.id]
        } else {
          for (var i = 0; i < pubArr.length; i++) {
            let result = this.response.publisherSelectOptions.filter(function (val) {
              return Number(val.value) === Number(pubArr[i])
            })
            if (result) { pub.push(result[0]) }
          }
          this.vModel.publisherSelectArr = this.$route.query.id
        }
        this.vModel.publisherSelect = pub
      } else {
        this.$router.push({ name: 'reportPublisherPeriod', query: { type: this.vModel.dateCategory, start: start, end: end } })
      }
      let start2 = this.$moment(this.$route.query.start).format('YYYY.MM.DD')
      let end2 = this.$moment(this.$route.query.end).format('YYYY.MM.DD')
      this.vModel.datePickerRangeText = start2 + ' - ' + end2
    },
    currentDate () {
      switch (this.vModel.dateCategory) {
        case 0 :
          this.datePickerRange.start = this.$moment(new Date())._d
          break
        case 1 :
          this.datePickerRange.start = this.$moment(new Date()).add(-6, 'days')._d
          break
        case 2 :
          this.datePickerRange.start = this.$moment(new Date()).add(-14, 'days')._d
          break
        case 3 :
          this.datePickerRange.start = this.$moment(new Date()).add(-1, 'months').add(1, 'days')._d
          break
        case 4 :
          this.datePickerRange.start = this.$moment(new Date()).add(-3, 'months').add(1, 'days')._d
          break
        case 5 :
          this.datePickerRange.start = this.$moment(new Date()).add(-6, 'months').add(1, 'days')._d
          break
        case 6 :
          this.datePickerRange.start = this.$moment(new Date()).add(-1, 'years').add(1, 'days')._d
          break
      }
      this.datePickerRange.end = this.$moment(new Date())._d
      let start = this.$moment(this.datePickerRange.start).format('YYYY.MM.DD')
      let end = this.$moment(this.datePickerRange.end).format('YYYY.MM.DD')
      this.vModel.datePickerRangeText = start + ' - ' + end
    },
    submitSearch: function () {
      let start = this.$moment(this.datePickerRange.start).format('YYYY-MM-DD')
      let end = this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
      let pubArr = this.vModel.publisherSelectArr
      if (pubArr) {
        this.$router.push({ name: 'reportPublisherPeriod', query: { type: this.vModel.dateCategory, start: start, end: end, id: pubArr } })
        let pub = []
        for (var i = 0; i < pubArr.length; i++) {
          let result = this.response.publisherSelectOptions.filter(function (val) {
            return Number(val.value) === Number(pubArr[i])
          })
          if (result) { pub.push(result[0]) }
        }
        this.vModel.publisherSelect = pub
      } else {
        this.$router.push({ name: 'reportPublisherPeriod', query: { type: this.vModel.dateCategory, start: start, end: end } })
      }
      this.getPublisherShow()
    },
    publisherClick () {
      if (this.vModel.publisherSelect) {
        this.vModel.publisherSelectArr = this.vModel.publisherSelect.map(function ($value) {
          return $value.value
        })
      }
    },
    tableRowClick (data, index) {
      if (data.id !== 'sum') {
        this.$router.push({ name: 'reportPublisherDaily', params: { publisher: this.vModel.publisherSelect }, query: { date: data.date } })
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
  watch: {
    datePickerRange: {
      handler (val) {
        if (val.end) {
          this.vModel.datePickerRangeText =
              this.$moment(this.datePickerRange.start).format('YYYY.MM.DD') + ' - ' + this.$moment(this.datePickerRange.end).format('YYYY.MM.DD')
        }
      },
      deep: true
    }
  }
}
</script>
