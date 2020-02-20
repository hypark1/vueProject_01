<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="vModel.title"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row class="col-12">
          <b-form @submit.prevent="submitDateSearch" class="mb-4 cf text-center w-100">
            <div class="float-left cf">
              <v-date-picker
                mode="single"
                class="float-left align-top"
                :input-props="{ class:'form-control', style:'background:#fff' }"
                v-model="vModel.selectedValueSingle">
              </v-date-picker>
              <b-button type="submit" size="md" variant="light default" class="ml-2">검색</b-button>
            </div>
          </b-form>
        </b-row>
        <b-row class="mb-4" v-if="config.lineChartDataVod.length > 0">
          <b-colxx>
            <div class="mb-3 w-100">
              <template v-for="(item, index) in this.vModel.labelVod">
                <b-button type="submit" size="md" variant="light default" class="mr-2" @click="showGraphBtnVod(index)" :key="index">{{item}}</b-button>
              </template>
              <span class="float-right mt-4">* 실 과금 보고서와 시간대별 보고서의 데이터 수치는 상이할 수 있습니다.</span>
            </div>
            <b-card>
              <span class="position-absolute" style="left:5rem;top:2rem">{{vModel.lineChart_y_Vod}}</span>
              <span class="position-absolute" style="right:5rem;bottom:3rem">시간</span>
              <div v-for="(item,index) in config.lineChartDataVod" :key="index">
                <div v-show="vModel.showGraphArrVod[index]">
                  <line-shadow-chart :data="item" :height="300" class="col-11 ml-auto mr-auto p-0 pt-5 pb-5" style="height:396px"/>
                </div>
              </div>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row class="mb-4" v-if="config.lineChartData.length > 0">
          <b-colxx>
            <div class="mb-3 w-100">
              <template v-for="(item, index) in this.vModel.labelImg">
                <b-button type="submit" size="md" variant="light default" class="mr-2" @click="showGraphBtn(index)" :key="index">{{item}}</b-button>
              </template>
              <span class="float-right mt-4">* 실 과금 보고서와 시간대별 보고서의 데이터 수치는 상이할 수 있습니다.</span>
            </div>
            <b-card>
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
        <b-row class="mb-4" v-if="response.type === 'VIDEO' && config.lineChartDataVod.length > 0">
          <b-colxx xs="6" lg="4" v-for="(item,index) in config.cardDataFieldVod" :key="index" class="mb-3">
            <b-card :title="item.title" :class="{cardActive: vModel.showGraphArrVod[index]}">
              <b-card-text class="position-absolute" style="font-size:1.6rem;top:2rem;right:1.75rem">{{ item.video_total }}</b-card-text>
              <!--<b-card-text class="text-right" :style="item.css">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.video_change }}
              </b-card-text>-->
            </b-card>
          </b-colxx>
        </b-row>
        <b-row class="mb-4" v-else-if="response.type !== 'VIDEO' && config.lineChartData.length > 0">
          <b-colxx xs="6" lg="3" v-for="(item,index) in config.cardDataField" :key="index">
            <b-card :title="item.title" :class="{cardActive: vModel.showGraphArr[index]}">
              <b-card-text class="position-absolute" style="font-size:1.6rem;top:2rem;right:1.75rem">{{ item.total }}</b-card-text>
              <!--<b-card-text class="text-right" :style="item.css">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.change }}
              </b-card-text>-->
            </b-card>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx>
            <b-card class="mb-4 cf" v-if="response.type === 'VIDEO'">
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="response.campaignList"
                       :fields="config.campaignsFieldVod"
                       :current-page="currentPage">
                <template slot="empty">
                  해당 날짜 데이터가 없습니다.
                </template>
                <template slot="views" slot-scope="data">
                  <template v-if="data.value === '0'">0</template>
                  <template v-else>{{numReplace(data.value)}}회</template>
                </template>
                <template slot="play_count" slot-scope="data">
                  <template v-if="data.value === '0'">0</template>
                  <template v-else>{{numReplace(data.value)}}회</template>
                </template>
                <template slot="play_time" slot-scope="data">
                  <template v-if="data.value === '0'">0</template>
                  <template v-else>{{timeSet(data.value)}}</template>
                </template>
                <template slot="clicks" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="vtr" slot-scope="data">
                  {{data.value}}%
                </template>
                <template slot="pay" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
              </b-table>
            </b-card>
            <b-card class="mb-4 cf" v-else>
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="response.campaignList"
                       :fields="config.campaignsFieldImg"
                       :current-page="currentPage">
                <template slot="empty">
                  해당 날짜의 데이터가 없습니다.
                </template>
                <template slot="views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="clicks" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="ctr" slot-scope="data">
                  {{data.value}}%
                </template>
                <template slot="pay" slot-scope="data">
                  {{numReplace(data.value)}}원
                </template>
              </b-table>
            </b-card>
          </b-colxx>
        </b-row>
        <div class="text-center">
          <router-link :to="{name: 'reportCampaignPeriod', params: { advertiser_name: response.advertiser_name, line_item_id: response.line_item_id, type: response.type }}">
            <b-button variant="outline-danger">뒤로가기</b-button>
          </router-link>
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
import LineShadowChart from '@/components/Charts/LineShadow'
import { ThemeColors } from '@/utils'
import { lineChartOptions } from '@/components/Charts/config'
const colors = ThemeColors()

export default {
  components: {
    LineShadowChart
  },
  created () {
    this.getCardReset()
  },
  data () {
    return {
      config: {
        cardDataField: [
          {
            title: '노출',
            css: { color: '' },
            icon: null
          },
          {
            title: '클릭',
            css: { color: '' },
            icon: null
          },
          {
            title: 'CTR',
            css: { color: '' },
            icon: null
          },
          {
            title: '소진 금액',
            css: { color: '' },
            icon: null
          }
        ],
        cardDataFieldVod: [
          {
            title: '노출',
            css: { color: '' },
            icon: null
          },
          {
            title: '광고 재생수',
            css: { color: '' },
            icon: null
          },
          {
            title: '재생 시간',
            css: { color: '' },
            icon: null
          },
          {
            title: '소진 금액',
            css: { color: '' },
            icon: null
          },
          {
            title: '클릭',
            css: { color: '' },
            icon: null
          }
        ],
        cardDataFieldReset: [],
        cardDataFieldResetVod: [],
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
        lineChartDataVod: [],
        campaignsFieldVod: {
          date: { label: '시간', sortable: true },
          views: { label: '노출', tdClass: 'table_num' },
          play_count: { label: '광고 재생수', tdClass: 'table_num' },
          play_time: { label: '재생시간', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          pay: { label: '소진금액', tdClass: 'table_num' }
        },
        campaignsFieldImg: {
          date: { label: '시간', sortable: true },
          views: { label: '노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' },
          pay: { label: '소진금액', tdClass: 'table_num' }
        }
      },
      response: {
        spinner: true,
        advertiser_name: this.$route.params.advertiser_name,
        line_item_id: this.$route.params.line_item_id,
        type: this.$route.query.type,
        date: this.$route.query.date,
        user_session: JSON.parse(localStorage.getItem('user')),
        company_name: '',
        user: null,
        campaignDaily: null,
        chart: {
          views: [],
          clicks: [],
          ctr: [],
          pay: [],
          label: null
        },
        chartVod: {
          views: [],
          play_count: [],
          play_time: [],
          pay: [],
          clicks: [],
          vtr: [],
          label: null
        },
        campaignList: null
      },
      vModel: {
        title: null,
        selectedValueSingle: null,
        showGraphArr: [true, false, false, false],
        showGraphArrVod: [true, false, false, false, false, false],
        lineChart_y: '노출',
        lineChart_y_Vod: '노출',
        labelVod: ['노출', '광고 재생수', '재생 시간(초)', '소진 금액', '클릭'],
        labelImg: ['노출', '클릭', 'CTR', '소진 금액']
      },
      currentPage: 1
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: 'reportCampaignDaily'
      }
    },
    showGraphBtnVod: function (idx) {
      this.vModel.showGraphArrVod = [false, false, false, false, false, false]
      this.vModel.showGraphArrVod[idx] = true
      this.vModel.lineChart_y_Vod = this.vModel.labelVod[idx]
    },
    showGraphBtn: function (idx) {
      this.vModel.showGraphArr = [false, false, false, false]
      this.vModel.showGraphArr[idx] = true
      this.vModel.lineChart_y = this.vModel.labelImg[idx]
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
    timeSet: function (val) {
      let hour = parseInt(val / 3600) + ''
      let min = parseInt((val % 3600) / 60) + ''
      if (min.length === 1) {
        min = 0 + min
      }
      let sec = val % 60 + ''
      if (sec.length === 1) {
        sec = 0 + sec
      }
      return hour + '시간 ' + min + '분 ' + sec + '초'
    },
    getCardReset () {
      this.config.cardDataFieldResetVod = JSON.parse(JSON.stringify(this.config.cardDataFieldVod))
      this.config.cardDataFieldReset = JSON.parse(JSON.stringify(this.config.cardDataField))
      let date = this.response.date
      this.vModel.selectedValueSingle = new Date(date.substr(0, 4) + ',' + date.substr(5, 2) + ',' + date.substr(8, 2))
      this.getUser()
    },
    getUser: function () {
      this.xhttp({
        url: 'user/' + this.response.advertiser_name,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          this.response.company_name = response.data.data.company.name
          let date = this.response.date
          if (date) {
            this.vModel.title = response.data.data.company.name + ' (' + this.response.date + ')'
            this.getCampaignDaily()
          } else {
            this.$router.push({ name: 'reportCampaignPeriod' })
          }
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    getCampaignDaily: function () {
      this.response.spinner = true
      if (this.response.advertiser_name && this.vModel.selectedValueSingle) {
        let id = this.response.advertiser_name
        let send = {
          select_date: this.$moment(this.vModel.selectedValueSingle).format('YYYY-MM-DD')
        }
        this.xhttp({
          url: 'report/' + id + '/lineItems/' + this.response.line_item_id + '/hourly',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.campaignDaily = response.data
            if (response.data.data === null) {
              this.$notify('error', '데이터 없음', '데이터가 없습니다.')
              this.resetData()
              this.config.cardDataField = JSON.parse(JSON.stringify(this.config.cardDataFieldReset))
              this.config.cardDataFieldVod = JSON.parse(JSON.stringify(this.config.cardDataFieldResetVod))
              this.response.campaignList = null
            } else {
              if (this.response.campaignDaily !== false) {
                let data = JSON.parse(JSON.stringify(this.response.campaignDaily.data))
                if (this.response.type === 'VIDEO') {
                  // 동영상
                  this.response.campaignList = this.response.campaignDaily.data.video_chart.data
                  this.response.campaignList.unshift(
                    {
                      id: 'sum',
                      date: '합계',
                      views: this.response.campaignDaily.data.video_total.views,
                      play_count: this.response.campaignDaily.data.video_total.play_count,
                      play_time: this.response.campaignDaily.data.video_total.play_time,
                      average: this.response.campaignDaily.data.video_total.average,
                      clicks: this.response.campaignDaily.data.video_total.clicks,
                      vtr: this.response.campaignDaily.data.video_total.vtr,
                      pay: this.response.campaignDaily.data.video_total.pay,
                      _rowVariant: 'secondary'
                    }
                  )
                  this.respChartVod(data)
                } else {
                  // 이미지
                  this.response.campaignList = this.response.campaignDaily.data.chart.data.reverse()
                  this.response.campaignList.unshift(
                    {
                      id: 'sum',
                      date: '합계',
                      views: this.response.campaignDaily.data.total.views,
                      clicks: this.response.campaignDaily.data.total.clicks,
                      ctr: this.response.campaignDaily.data.total.ctr,
                      pay: this.response.campaignDaily.data.total.pay,
                      vctr: this.response.campaignDaily.data.total.vctr,
                      _rowVariant: 'secondary'
                    }
                  )
                  this.respChartImg(data)
                }
              }
            }
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.campaignDaily = error.response
          this.respError(error)
        })
      } else {
        this.$router.push({ name: 'reportCampaignIndex' })
      }
    },
    respChartVod: function (data) {
      let field = this.config.cardDataFieldVod
      let m = ['views', 'play_count', 'play_time', 'pay', 'clicks', 'views_p', 'play_count_p', 'play_time_p', 'pay_p', 'clicks_p']
      let v = ['video_total', 'video_change']
      for (let mi in m) {
        if (mi > 4) {
          v = ['video_change']
        }
        for (let vi in v) {
          let key = v[vi]
          let val = data[key][m[mi]]
          if (['0', '1'].includes(mi)) {
            field[mi][key] = this.numReplace(val) + '회'
          } else if (mi === '2') {
            field[mi][key] = this.timeSet(val)
          } else if (mi === '3') {
            field[mi][key] = this.numReplace(val) + '원'
          } else if (mi > 4) {
            field[mi - 5][key] += ' (' + val + '%)'
          } else {
            field[mi][key] = this.numReplace(val)
          }
          if (['video_change'].includes(key) && mi < 5) {
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
      data.video_chart.data.reverse()
      for (var i = 0; i < data.video_chart.data.length; i++) {
        this.response.chartVod.views.push(data.video_chart.data[i].views)
        this.response.chartVod.play_count.push(data.video_chart.data[i].play_count)
        this.response.chartVod.play_time.push(data.video_chart.data[i].play_time)
        this.response.chartVod.pay.push(data.video_chart.data[i].pay)
        this.response.chartVod.clicks.push(data.video_chart.data[i].clicks)
      }
      this.response.chartVod.label = data.video_chart.label.reverse()
      let data2 = data.video_chart
      let chart = this.response.chartVod
      this.chartShowDom(chart.label, chart.views, data2.views, data2.data, data2.data[0].views)
      this.chartShowDom(chart.label, chart.play_count, data2.play_count, data2.data, data2.data[0].play_count)
      this.chartShowDom(chart.label, chart.play_time, data2.play_time, data2.data, data2.data[0].play_time)
      this.chartShowDom(chart.label, chart.pay, data2.pay, data2.data, data2.data[0].pay)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks, data2.data, data2.data[0].clicks)
    },
    respChartImg: function (data) {
      let field = this.config.cardDataField
      let m = ['views', 'clicks', 'ctr', 'pay']
      let v = ['total', 'change']
      for (let mi in m) {
        for (let vi in v) {
          let key = v[vi]
          let val = data[key][m[mi]]
          if (mi === '2') {
            field[mi][key] = val + '%'
          } else if (mi === '3') {
            field[mi][key] = this.numReplace(val) + '원'
          } else {
            field[mi][key] = this.numReplace(val)
          }
          if (key === 'change') {
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
      this.response.chart.label = data.chart.label.reverse()
      let data2 = this.response.campaignDaily.data.chart
      let chart = this.response.chart
      this.chartShowDom(chart.label, chart.views, data2.views)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks)
      this.chartShowDom(chart.label, chart.ctr, data2.ctr)
      this.chartShowDom(chart.label, chart.pay, data2.pay)
    },
    chartShowDom: function (label, chart, data) {
      let lineChart1 = JSON.parse(JSON.stringify(this.config.lineChartEx))
      lineChart1.labels = label.reverse()
      // 데이터 넣기
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
      let dataMin = parseInt(Number(data.min) / num) * num
      let dataMax = parseInt(Number(data.max) / num) * num
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
      if (this.response.type === 'VIDEO') {
        this.config.lineChartDataVod.push(lineChart1)
      } else {
        this.config.lineChartData.push(lineChart1)
      }
    },
    submitDateSearch: function () {
      this.vModel.title = this.$moment(this.vModel.selectedValueSingle).format('YYYY-MM-DD')
      this.$router.push({ name: 'reportCampaignDaily', params: { advertiser_name: this.response.advertiser_name, line_item_id: this.response.line_item_id }, query: { date: this.vModel.title } })
      this.resetData()
      this.getCampaignDaily()
    },
    resetData: function () {
      this.config.lineChartData = []
      this.config.lineChartDataVod = []
      this.config.lineChartDataTop = []
      this.response.chart.views = []
      this.response.chart.clicks = []
      this.response.chart.ctr = []
      this.response.chart.pay = []
      this.response.chartVod.views = []
      this.response.chartVod.play_count = []
      this.response.chartVod.play_time = []
      this.response.chartVod.pay = []
      this.response.chartVod.clicks = []
      this.response.chartVod.vtr = []
      this.response.campaignList = null
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
