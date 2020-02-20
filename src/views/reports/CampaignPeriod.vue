<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="resultCampaigns">
          <piaf-breadcrumb :heading="response.company_name + ' - ' + resultCampaigns.name"/>
        </template>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-row class="col-12" style="padding-right:0;">
          <b-form @submit.prevent="submitDateSearch" class="mb-4 cf text-center w-100">
            <b-form-select v-model="vModel.multipleSelect"
                           :options="response.multipleOptions"
                           style="width:150px"
                           class="float-left align-top mr-2"
                           plain required
                           @change="multipleChange"
                           v-if="response.type === 'MULTIPLE'">
            </b-form-select>
            <b-form-select v-model="vModel.dateCategory"
                           :options="response.dateCategoryOptions"
                           style="width:150px;height:43px;"
                           class="float-left align-top mr-2"
                           plain required
                           @change="currentDate">
            </b-form-select>
            <div class="float-left cf">
              <v-date-picker
                mode="single"
                class="float-left align-top"
                style="width:100px;"
                :input-props="{ class:'form-control', style:'background:#fff' }"
                v-model="datePickerRange.start">
              </v-date-picker>
              <p class="float-left ml-2 mr-2 mb-0" style="line-height:43px;">-</p>
              <v-date-picker
                mode="single"
                class="float-left align-top"
                style="width:100px;"
                :input-props="{ class:'form-control', style:'background:#fff' }"
                v-model="datePickerRange.end">
              </v-date-picker>
              <b-button type="submit" size="md" variant="light default" class="ml-2">검색</b-button>
            </div>
            <b-button class="float-right ml-2" variant="primary" @click="dateReport()">
              시간대별 보고서
            </b-button>
            <template v-if="response.campaignList">
              <template v-if="response.campaignList.length > 0">
                <b-button class="float-right" variant="success">
                  <a :href="vModel.link" download style="color:#fff;">엑셀 다운로드</a>
                </b-button>
            </template>
            </template>
          </b-form>
        </b-row>
        <b-row class="mb-4" v-if="config.lineChartDataVod.length > 0">
          <b-colxx>
            <div class="mb-3 w-100">
              <template v-for="(item, index) in this.vModel.labelVod">
                <b-button type="submit" size="md" variant="light default" class="mr-2" @click="showGraphBtnVod(index)" :key="index">{{item}}</b-button>
              </template>
            </div>
            <b-card>
              <h2 class="mb-4">{{datePickerRange.text}}</h2>
              <span class="position-absolute" style="left:5rem;">{{vModel.lineChart_y_Vod}}</span>
              <span class="position-absolute" style="right:5rem;bottom:3rem">날짜</span>
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
            </div>
            <b-card>
              <h2 class="mb-4">{{datePickerRange.text}}</h2>
              <span class="position-absolute" style="left:5rem;">{{vModel.lineChart_y}}</span>
              <span class="position-absolute" style="right:5rem;bottom:3rem">날짜</span>
              <div v-for="(item,index) in config.lineChartData" :key="index">
                <div v-show="vModel.showGraphArr[index]">
                  <line-shadow-chart :data="item" :height="300" class="col-11 ml-auto mr-auto p-0 pt-5 pb-5" style="height:396px"/>
                </div>
              </div>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row class="mb-4" v-if="response.type === 'VIDEO' && config.lineChartDataVod.length > 0">
          <template v-for="(item,index) in config.cardDataFieldVod">
            <b-colxx xs="6" lg="3" :key="index" class="mb-3" v-if="index !== 6">
              <b-card style="height:235px;padding-top:3rem;">
                <b-card-title style="font-size:1.3rem;font-weight:bold;">{{item.title}}</b-card-title>
                <b-card-text class="position-absolute" style="font-size:1.3rem;top:4.75rem;right:1.75rem;font-weight:bold;">{{ item.video_total }}</b-card-text>
                <!--<b-card-text class="text-right" :style="item.css">
                  <i :class="item.icon" class="mr-2"></i>
                  {{ item.video_change }}
                </b-card-text>-->
                <div class="position-relative" style="margin-top:40px;">
                  <template v-if="index === 5">
                    <b-card-title style="font-size:1.3rem;font-weight:bold;">vCTR</b-card-title>
                    <b-card-text class="position-absolute" style="font-size:1.3rem;top:0.3rem;right:0;font-weight:bold;">{{ config.cardDataFieldVod[6].video_total }}</b-card-text>
                    <!--<b-card-text class="text-right" :style="config.cardDataFieldVod[6].css">
                      <i :class="config.cardDataFieldVod[6].icon" class="mr-2"></i>
                      {{ config.cardDataFieldVod[6].video_change }}
                    </b-card-text>-->
                  </template>
                  <template v-else>
                    <b-card-title style="font-size:1rem;">일평균</b-card-title>
                    <b-card-text class="position-absolute" style="font-size:1rem;top:0.3rem;right:0">{{ item.video_total_days }}</b-card-text>
                    <!--<b-card-text class="text-right" :style="item.css">
                      <i :class="item.icon" class="mr-2"></i>
                      {{ item.video_change_days }}
                    </b-card-text>-->
                  </template>
                </div>
              </b-card>
            </b-colxx>
          </template>
          <b-colxx xs="12" lg="6">
            <b-card v-if="response.campaignShow.data.play_chart.data" style="height:235px;">
              <b-card-title class="mb-3">조회율 (구간별 이탈 수) / {{ resultCampaigns.duration }}초</b-card-title>
              <span class="position-absolute" style="right:3rem;bottom:1rem">퍼센트(%)</span>
              <div v-for="(item,index) in config.lineChartDataPlay" :key="index">
                <div>
                  <line-shadow-chart :data="item" :height="300" class="col-11 ml-auto mr-auto p-0" style="height:130px;margin-bottom:10px;"/>
                </div>
              </div>
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
                       hover
                       bordered
                       show-empty
                       :items="response.campaignList"
                       :fields="config.campaignsFieldVod"
                       :current-page="currentPage"
                       @row-clicked="tableRowClick">
                <template slot="empty">
                  해당 기간의 데이터가 없습니다.
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
                <template slot="sessions" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="ctr" slot-scope="data">
                  {{data.value}}%
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
                       hover
                       bordered
                       show-empty
                       :items="response.campaignList"
                       :fields="config.campaignsFieldImg"
                       :current-page="currentPage"
                       @row-clicked="tableRowClick">
                <template slot="empty">
                  해당 기간의 데이터가 없습니다.
                </template>
                <template slot="views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="active_views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="clicks" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="ctr" slot-scope="data">
                  {{data.value}}%
                </template>
                <template slot="vctr" slot-scope="data">
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
          <router-link :to="{name: 'reportCampaignIndex'}">
            <b-button variant="outline-danger">목록으로</b-button>
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
    this.getUser()
    this.fnRefresh()
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
            title: '총 재생수',
            css: { color: '' },
            icon: null
          },
          {
            title: '과금 재생수',
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
          },
          {
            title: 'VTR',
            css: { color: '' },
            icon: null
          },
          {
            title: 'vCTR',
            css: { color: '' },
            icon: null
          }
        ],
        cardDataFieldReset: [],
        cardDataFieldResetVod: [],
        lineChartOptions: null,
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
        lineChartDataPlay: [],
        campaignsFieldVod: {
          date: { label: '날짜', sortable: true },
          play_count: { label: '총 재생수', tdClass: 'table_num' },
          views: { label: '과금 재생수', tdClass: 'table_num' },
          play_time: { label: '재생시간', tdClass: 'table_num' },
          sessions: { label: '사용자수(도달)', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ctr: { label: 'vCTR', tdClass: 'table_num' },
          vtr: { label: 'VTR', tdClass: 'table_num' },
          pay: { label: '소진금액', tdClass: 'table_num' }
        },
        campaignsFieldImg: {
          date: { label: '날짜', sortable: true },
          views: { label: '노출', tdClass: 'table_num' },
          active_views: { label: '과금노출', tdClass: 'table_num' },
          clicks: { label: '클릭', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' },
          vctr: { label: 'vCTR', tdClass: 'table_num' },
          pay: { label: '소진금액', tdClass: 'table_num' }
        }
      },
      response: {
        spinner: true,
        line_item_id: this.$route.params.line_item_id,
        advertiser_name: this.$route.params.advertiser_name,
        type: this.$route.query.type,
        user_session: JSON.parse(localStorage.getItem('user')),
        company_name: '',
        user: null,
        excel: null,
        campaignShow: null,
        chart: {
          views: [],
          active_views: [],
          clicks: [],
          ctr: [],
          vctr: [],
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
          ctr: [],
          label: null
        },
        chartPlay: {
          cnt: [],
          label: null
        },
        multipleOptions: [
          { value: 0, text: '이미지 광고' },
          { value: 1, text: '동영상 광고' }
        ],
        dateCategoryOptions: [
          { value: 0, text: '기간 선택' },
          { value: 1, text: '지난달' },
          { value: 2, text: '이번달' }
        ],
        campaignList: null
      },
      vModel: {
        multipleSelect: 0,
        dateCategory: 0,
        showGraphArr: [true, false, false, false],
        showGraphArrVod: [true, false, false, false, false, false, false],
        lineChart_y: '노출',
        lineChart_y_Vod: '총 재생수',
        labelVod: ['총 재생수', '과금 재생수', '재생 시간(초)', '소진 금액', '클릭', 'VTR', 'CTR'],
        labelImg: ['노출', '클릭', 'CTR', '소진 금액']
      },
      currentPage: this.$route.query.page,
      datePickerRange: {
        start: this.$moment(this.$route.query.start)._d,
        end: this.$moment(this.$route.query.end)._d,
        text: ''
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    showGraphBtnVod: function (idx) {
      this.vModel.showGraphArrVod = [false, false, false, false, false, false, false]
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
      val = Number(val)
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
          this.getCampaignShow()
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    getExcel: function () {
      let id = this.response.advertiser_name
      let send = {
        start_date: this.$moment(this.datePickerRange.start).format('YYYY-MM-DD'),
        end_date: this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
      }
      var link = location.origin + '/api/report/' + id + '/lineItems/' + this.response.line_item_id + '/excel?start_date=' + send.start_date + '&end_date=' + send.end_date
      this.vModel.link = link
    },
    dateReport () {
      let date = this.$moment(this.$moment(new Date()).add(-1, 'days')._d).format('YYYY-MM-DD')
      this.$router.push({ name: 'reportCampaignDaily', params: { advertiser_name: this.response.advertiser_name, line_item_id: this.response.line_item_id }, query: { date: date } })
    },
    getCampaignShow: function () {
      this.response.spinner = true
      let id = this.response.advertiser_name
      let send = {
        start_date: this.$moment(this.datePickerRange.start).format('YYYY-MM-DD'),
        end_date: this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
      }
      this.xhttp({
        url: 'report/' + id + '/lineItems/' + this.response.line_item_id + '/daily',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.campaignShow = response.data
          this.resetData()
          if (response.data.data === null) {
            this.$notify('error', '데이터 없음', '데이터가 없습니다.')
            this.config.cardDataField = JSON.parse(JSON.stringify(this.config.cardDataFieldReset))
            this.config.cardDataFieldVod = JSON.parse(JSON.stringify(this.config.cardDataFieldResetVod))
            this.response.campaignList = null
          } else {
            if (this.response.campaignShow !== false) {
              this.getExcel()
              let data = JSON.parse(JSON.stringify(this.response.campaignShow.data))
              if (this.response.type === 'VIDEO' && data.video_chart.data) {
                // 동영상
                this.response.campaignList = this.response.campaignShow.data.video_chart.data
                this.response.campaignList.unshift(
                  {
                    id: 'sum',
                    date: '합계',
                    views: this.response.campaignShow.data.video_total.views,
                    play_count: this.response.campaignShow.data.video_total.play_count,
                    play_time: this.response.campaignShow.data.video_total.play_time,
                    average: this.response.campaignShow.data.video_total.average,
                    sessions: this.response.campaignShow.data.video_total.sessions,
                    clicks: this.response.campaignShow.data.video_total.clicks,
                    ctr: this.response.campaignShow.data.video_total.ctr,
                    vtr: this.response.campaignShow.data.video_total.vtr,
                    pay: this.response.campaignShow.data.video_total.pay,
                    _rowVariant: 'secondary'
                  }
                )
                this.respChartVod(data)
                // 조회율
                if (data.play_chart.data) {
                  this.respChartPlay(data)
                }
              } else if (this.response.type !== 'VIDEO') {
                // 이미지
                this.response.campaignList = this.response.campaignShow.data.chart.data.reverse()
                this.response.campaignList.unshift(
                  {
                    id: 'sum',
                    date: '합계',
                    views: this.response.campaignShow.data.total.views,
                    active_views: this.response.campaignShow.data.total.active_views,
                    clicks: this.response.campaignShow.data.total.clicks,
                    ctr: this.response.campaignShow.data.total.ctr,
                    pay: this.response.campaignShow.data.total.pay,
                    vctr: this.response.campaignShow.data.total.vctr,
                    _rowVariant: 'secondary'
                  }
                )
                this.respChartImg(data)
              }
            }
          }
          let start = this.$moment(this.datePickerRange.start).format('YYYY.MM.DD')
          let end = this.$moment(this.datePickerRange.end).format('YYYY.MM.DD')
          this.datePickerRange.text = start + ' - ' + end
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.campaignShow = error.response
        this.respError(error)
      })
    },
    respChartVod: function (data) {
      let field = this.config.cardDataFieldVod
      let m = ['play_count', 'views', 'play_time', 'pay', 'clicks', 'vtr', 'ctr', 'play_count_p', 'views_p', 'play_time_p', 'pay_p', 'clicks_p', 'vtr_p', 'ctr_p']
      let v = ['video_total', 'video_change', 'video_total_days', 'video_change_days']
      for (let mi in m) {
        if (mi === 6) {
          v = ['video_total', 'video_change']
        }
        if (mi > 6) {
          v = ['video_change', 'video_change_days']
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
          } else if (['5', '6'].includes(mi)) {
            field[mi][key] = val + '%'
          } else if (mi > 6) {
            field[mi - 7][key] += ' (' + val + '%)'
          } else {
            field[mi][key] = this.numReplace(val)
          }
          if (['video_change', 'video_change_days'].includes(key) && mi < 7 && val) {
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
      for (var i = 0; i < data.video_chart.data.length; i++) {
        this.response.chartVod.views.push(data.video_chart.data[i].views)
        this.response.chartVod.play_count.push(data.video_chart.data[i].play_count)
        this.response.chartVod.play_time.push(data.video_chart.data[i].play_time)
        this.response.chartVod.pay.push(data.video_chart.data[i].pay)
        this.response.chartVod.clicks.push(data.video_chart.data[i].clicks)
        this.response.chartVod.vtr.push(data.video_chart.data[i].vtr)
        this.response.chartVod.ctr.push(data.video_chart.data[i].ctr)
      }
      this.response.chartVod.label = data.video_chart.label.map(function ($value) {
        return $value.substr(5, 2) + '/' + $value.substr(8, 2)
      })
      let data2 = data.video_chart
      let chart = this.response.chartVod
      this.chartShowDom(chart.label, chart.views, data2.views, data2.data, data2.data[0].views)
      this.chartShowDom(chart.label, chart.play_count, data2.play_count, data2.data, data2.data[0].play_count)
      this.chartShowDom(chart.label, chart.play_time, data2.play_time, data2.data, data2.data[0].play_time)
      this.chartShowDom(chart.label, chart.pay, data2.pay, data2.data, data2.data[0].pay)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks, data2.data, data2.data[0].clicks)
      this.chartShowDom(chart.label, chart.vtr, data2.vtr, data2.data, data2.data[0].vtr)
      this.chartShowDom(chart.label, chart.ctr, data2.ctr, data2.data, data2.data[0].ctr)
    },
    respChartPlay: function (data) {
      for (var i = 0; i < data.play_chart.data.length; i++) {
        this.response.chartPlay.cnt.push(data.play_chart.data[i].cnt)
      }
      this.response.chartPlay.label = data.play_chart.label.map(function ($value) {
        return $value + '%'
      })
      let data2 = data.play_chart
      let chart = this.response.chartPlay
      this.chartShowDom(chart.label, chart.cnt, { max: data2.max, min: data2.min }, data2.data, data2.data[0].cnt, 'play')
    },
    respChartImg: function (data) {
      let field = this.config.cardDataField
      let m = ['views', 'clicks', 'ctr', 'pay']
      let v = ['total', 'change']
      for (let mi in m) {
        for (let vi in v) {
          let key = v[vi]
          let val = data[key][m[mi]]
          if (key === 'total') {
            if (mi === '0' || mi === '1') {
              field[mi][key] = this.numReplace(val)
            } else if (mi === '3') {
              field[mi][key] = this.numReplace(val) + '원'
            } else {
              field[mi][key] = val + '%'
            }
          } else {
            if (mi === '0' || mi === '1') {
              field[mi][key] = this.numReplace(val)
            } else if (mi === '3') {
              field[mi][key] = this.numReplace(val) + '원'
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
      data.chart.data.reverse()
      for (var i = 0; i < data.chart.data.length; i++) {
        this.response.chart.views.push(data.chart.data[i].views)
        this.response.chart.clicks.push(data.chart.data[i].clicks)
        this.response.chart.ctr.push(data.chart.data[i].ctr)
        this.response.chart.pay.push(data.chart.data[i].pay)
        this.response.chart.vctr.push(data.chart.data[i].vctr)
      }

      this.response.chart.label = data.chart.label.reverse().map(function ($value) {
        return $value.substr(5, 2) + '/' + $value.substr(8, 2)
      })
      let data2 = this.response.campaignShow.data.chart
      let chart = this.response.chart
      this.chartShowDom(chart.label, chart.views, data2.views, data2.data, data2.data[1].views)
      this.chartShowDom(chart.label, chart.clicks, data2.clicks, data2.data, data2.data[1].clicks)
      this.chartShowDom(chart.label, chart.ctr, data2.ctr, data2.data, data2.data[1].ctr)
      this.chartShowDom(chart.label, chart.pay, data2.pay, data2.data, data2.data[1].pay)
      this.chartShowDom(chart.label, chart.vctr, data2.vctr, data2.data, data2.data[1].vctr)
    },
    chartShowDom: function (label, chart, data, data2, data3, type) {
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
      this.config.lineChartOptions = lineChartOptions
      let lineChartOptions1 = JSON.parse(JSON.stringify(this.config.lineChartOptions))
      let dataMin = parseInt(Number(data.min) / num) * num
      let dataMax = parseInt(Number(data.max) / num) * num
      if (data2.length === 1 && !type) {
        // 1일 선택했고, 합계없을
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
      if (type === 'play') {
        this.config.lineChartDataPlay.push(lineChart1)
      } else {
        if (this.response.type === 'VIDEO') {
          this.config.lineChartDataVod.push(lineChart1)
        } else {
          this.config.lineChartData.push(lineChart1)
        }
      }
    },
    multipleChange (val) {
      if (val === 1) {
        this.response.type = 'VIDEO'
      } else {
        this.response.type = 'MULTIPLE'
      }
      this.resetData()
      this.getCampaignShow()
    },
    currentDate () {
      var data = this.vModel.dateCategory
      var year = Number(this.$moment(new Date()).format('YYYY'))
      var month = Number(this.$moment(new Date()).format('MM'))
      var day = 31
      if (data === 1) {
        let start = this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-01')
        let startMM = this.$moment(new Date(start)).format('MM')
        if ([2, 4, 6, 9, 11].includes(startMM)) {
          day = 30
        }
        let end = this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-' + day)
        this.datePickerRange.start = start
        this.datePickerRange.end = end
      } else if (data === 2) {
        if ([2, 4, 6, 9, 11].includes(month)) {
          day = 30
        }
        month -= 1
        this.datePickerRange.start = new Date(year, month, 1)
        this.datePickerRange.end = new Date()
      }
      if (data !== 0) {
        this.submitDateSearch()
      }
    },
    submitDateSearch: function () {
      let start = this.$moment(this.datePickerRange.start).format('YYYYMMDD')
      let end = this.$moment(this.datePickerRange.end).format('YYYYMMDD')
      let today = this.$moment(new Date()).format('YYYYMMDD')
      if (start > end) {
        this.$notify('error', '날짜 선택 오류', '시작일을 종료일보다 앞 날짜를 선택하세요.')
      } else if (end > today) {
        this.$notify('error', '날짜 선택 오류', '종료일을 오늘 또는 오늘보다 앞 날짜를 선택하세요.')
      } else {
        let start2 = this.$moment(this.datePickerRange.start).format('YYYY-MM-DD')
        let end2 = this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
        this.$router.push({ name: 'reportCampaignPeriod', query: { type: this.response.type, start: start2, end: end2 } })
        this.resetData()
        this.getCampaignShow()
      }
    },
    fnRefresh: function () {
      let start = this.$moment(this.datePickerRange.start).format('YYYY-MM-DD')
      let end = this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
      this.$router.push({ name: 'reportCampaignPeriod', query: { type: this.response.type, start: start, end: end } })
      let start2 = this.$moment(this.datePickerRange.start).format('YYYY.MM.DD')
      let end2 = this.$moment(this.datePickerRange.end).format('YYYY.MM.DD')
      this.vModel.datePickerRangeText = start2 + ' - ' + end2
    },
    resetData: function () {
      this.config.lineChartData = []
      this.config.lineChartDataVod = []
      this.config.lineChartDataTop = []
      this.config.lineChartDataPlay = []
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
      this.response.chartPlay.cnt = []
      this.response.campaignList = null
    },
    tableRowClick (data, index) {
      if (data.id !== 'sum') {
        this.$router.push({ name: 'reportCampaignDaily', params: { advertiser_name: this.response.advertiser_name, line_item_id: this.response.line_item_id }, query: { type: this.response.type, date: data.date } })
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
    resultCampaigns () {
      if (this.response.campaignShow && this.response.campaignShow.success === true && this.response.campaignShow.data) {
        return this.response.campaignShow.data
      } else {
        return false
      }
    }
  },
}
</script>
