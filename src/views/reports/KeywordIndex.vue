<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="유입 키워드"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
          <b-row class="col-12 p-0 ml-0">
            <b-form @submit.prevent="submitDateSearch" class="mb-4 cf text-center w-100">
              <div class="float-right">
                <template v-if="resultKeyword.length > 0">
                  <b-button class="float-left mr-3" variant="success">
                    <a :href="vModel.link" download style="color:#fff;">엑셀 다운로드</a>
                  </b-button>
                </template>
                <div class="float-left cf">
                  <v-date-picker
                    mode="range"
                    class="float-left align-top"
                    :input-props="{ class:'form-control', readonly:'true', style:'background:#fff' }"
                    v-model="vModel.datePickerRange">
                  </v-date-picker>
                  <b-button type="submit" size="md" variant="light default" class="d-inline-block default border">검색</b-button>
                </div>
              </div>
            </b-form>
          </b-row>
          <b-row class="col-12" style="margin:20px auto 30px;">
            <div class="col-12 float-left">
              <h3 class="mb-5">매칭 키워드</h3>
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="resultAdsKeyword"
                       :fields="config.adsKeywordField">
                <template slot="empty">
                  키워드가 없습니다.
                </template>
                <template slot="no" slot-scope="data">
                  {{data.index + 1}}
                </template>
                <template slot="views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="click" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
              </b-table>
            </div>
          </b-row>
          <b-row>
            <div class="col-6 float-left" v-if="config.barChartData">
              <h3 class="mb-5">유입 포탈 사이트</h3>
              <bar-shadow-chart :data="config.barChartData" :height="400"/>
            </div>
            <div class="col-6 float-left">
              <h3 class="mb-5">유입 키워드</h3>
              <b-table class="text-center"
                       striped
                       bordered
                       show-empty
                       :items="resultKeyword"
                       :fields="config.keywordField">
                <template slot="empty">
                  키워드가 없습니다.
                </template>
                <template slot="no" slot-scope="data">
                  {{data.index + 1}}
                </template>
                <template slot="views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="click" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
              </b-table>
            </div>
          </b-row>
          <b-row>
            <div class="col-12 float-left">
              <h3 class="mb-5">매칭 페이지 TOP 100</h3>
              <b-table class="text-center mt-5"
                       striped
                       bordered
                       show-empty
                       :items="resultNews"
                       :fields="config.newsField">
                <template slot="empty">
                  기사가 없습니다.
                </template>
                <template slot="no" slot-scope="data">
                  {{data.index + 1}}
                </template>
                <template slot="news_title" slot-scope="data">
                  <b-link :href="data.item.news_url" target="_blank">
                    {{data.value}}
                  </b-link>
                </template>
                <template slot="views" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
                <template slot="click" slot-scope="data">
                  {{numReplace(data.value)}}
                </template>
              </b-table>
            </div>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BarShadowChart from '@/components/Charts/BarShadow'
// import { ThemeColors } from '@/utils'
import { barChartOptions } from '@/components/Charts/config'
// const colors = ThemeColors()

export default {
  components: {
    BarShadowChart
  },
  created () {
    this.getKeywordSite()
  },
  data () {
    return {
      response: {
        spinner: false,
        user_session: JSON.parse(localStorage.getItem('user')),
        line_item_id: this.$route.params.line_item_id,
        list: null,
        excel: null,
        data: null,
        label: null,
        keyword: null,
        ads_keyword: null,
        news: null
      },
      vModel: {
        link: null,
        datePickerRange: {
          start: this.$moment(new Date()).add(-6, 'days')._d,
          end: new Date()
        }
      },
      config: {
        adsKeywordField: {
          no: { label: '순위' },
          keyword: { label: '매칭 키워드', tdClass: 'table_title' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' }
        },
        keywordField: {
          no: { label: '순위' },
          keyword: { label: '유입 키워드', tdClass: 'table_title' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' }
        },
        newsField: {
          no: { label: '순위' },
          news_title: { label: '제목', tdClass: 'table_title' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' }
        },
        borderColor: ['#f18024', '#6f42c1', '#17a2b8', '#f6c797', '#e7523e', '#d6cdca', '#ffc107'],
        backgroundColor: ['rgba(241, 128, 36, 0.1)', 'rgba(111, 66, 193, 0.1)', 'rgba(23, 162, 184, 0.1)', 'rgba(246, 199, 151, 0.1)', 'rgba(231, 82, 62, 0.1)', 'rgba(214, 205, 202, 0.1)', 'rgba(255, 193, 7, 0.1)'],
        chartDatasets: {
          label: null,
          borderColor: null,
          backgroundColor: null,
          data: [],
          borderWidth: 2
        },
        barChartEx: {
          labels: null,
          datasets: [],
          options: null
        },
        barChartData: null,
        barChartOptions: barChartOptions
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    submitDateSearch: function () {
      this.config.barChartData = null
      this.getKeywordSite()
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    getExcel: function () {
      let send = {
        start_date: this.$moment(this.vModel.datePickerRange.start).format('YYYY-MM-DD'),
        end_date: this.$moment(this.vModel.datePickerRange.end).format('YYYY-MM-DD')
      }
      var link = location.origin + '/api/report/' + this.response.line_item_id + '/excel?start_date=' + send.start_date + '&end_date=' + send.end_date
      this.vModel.link = link
    },
    getKeywordSite: function () {
      if (this.response.line_item_id) {
        this.response.spinner = true
        let send = {
          start_date: this.$moment(this.vModel.datePickerRange.start).format('YYYY-MM-DD'),
          end_date: this.$moment(this.vModel.datePickerRange.end).format('YYYY-MM-DD')
        }
        this.xhttp({
          url: '/report/' + this.response.line_item_id + '/keyword',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.data = response.data
            if (!this.response.data.data) {
              this.$notify('error', '데이터 없음', '데이터가 없습니다.')
              this.response.list = []
              this.response.keyword = []
              this.response.ads_keyword = []
              this.response.news = []
            } else {
              if (this.response.data !== false) {
                this.getExcel()
                this.response.list = this.response.data.data.list
                this.response.label = this.response.data.data.label
                this.response.keyword = this.response.data.data.keyword
                this.response.ads_keyword = this.response.data.data.ads_keyword
                this.response.news = this.response.data.data.news
                this.config.barChartEx.datasets = []
                let data = this.response.data.data.portal
                this.respUser(data)
              }
            }
            this.$Progress.finish()
            this.response.spinner = false
          }
        }).catch((error) => {
          this.response.data = error.response
          this.$notify('error', '오류', '관리자에게 문의바랍니다.')
          this.$Progress.fail()
          this.response.spinner = false
        })
      } else {
        this.$router.push({ name: 'reportCampaignIndex' })
      }
    },
    respUser: function (resp) {
      var data = {
        user_data: resp
      }
      let v = this.response.label
      for (let vi in v) {
        let key = v[vi]
        let data = JSON.parse(JSON.stringify(this.config.chartDatasets))
        data.label = key
        data.borderColor = this.config.borderColor[vi]
        data.backgroundColor = this.config.backgroundColor[vi]
        this.config.barChartEx.datasets.push(data)
      }
      let barChartData = JSON.parse(JSON.stringify(this.config.barChartEx))
      let userLabel = ['유입 포탈 사이트']
      barChartData.labels = userLabel
      for (let vi in v) {
        let key = v[vi]
        barChartData.datasets[vi].data.push(data.user_data[key])
      }
      let barChartOptions = JSON.parse(JSON.stringify(this.config.barChartOptions))
      // num 최소/최대값 자릿수에 따라 작은 단위 숫자 버리기
      let num = '1'
      let minLength = Math.floor(data.user_data.min).toString().length
      if (minLength > 2) {
        for (var i = 0; i < minLength - 3; i++) {
          num += '0'
        }
      }
      num = Number(num)
      let dataMin = parseInt(Number(data.user_data.min) / num) * num
      let dataMax = parseInt(Number(data.user_data.max) / num) * num
      // dataNum 값에 따라 y축 5개로 나뉘도록 stepSize 자동
      let dataNum = Math.round(((dataMax - dataMin) + ((dataMax - dataMin) / 2)) / 5)
      // range 그래프의 y축이 최소/최대 값보다 한칸 +-
      let range = dataNum
      if (dataNum === 0) {
        dataNum = 1
        range = 2
      }
      barChartOptions.scales.yAxes[0].ticks.min = dataMin - range
      let min2 = barChartOptions.scales.yAxes[0].ticks.min
      if (min2 < 0) {
        barChartOptions.scales.yAxes[0].ticks.min = 0
      }
      barChartOptions.scales.yAxes[0].ticks.max = dataMax + range
      barChartOptions.scales.yAxes[0].ticks.stepSize = dataNum
      barChartData.options = barChartOptions
      this.config.barChartData = barChartData
    }
  },
  computed: {
    resultList () {
      if (this.response.list && this.response.list.length > 0) {
        return this.response.list
      } else {
        return []
      }
    },
    resultAdsKeyword () {
      if (this.response.ads_keyword && this.response.ads_keyword.length > 0) {
        return this.response.ads_keyword
      } else {
        return []
      }
    },
    resultKeyword () {
      if (this.response.keyword && this.response.keyword.length > 0) {
        return this.response.keyword
      } else {
        return []
      }
    },
    resultNews () {
      if (this.response.news && this.response.news.length > 0) {
        return this.response.news
      } else {
        return []
      }
    }
  }
}
</script>
