<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="관리자 메뉴" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xl="12" lg="6" md="12" class="mb-4">
        <b-card class="h-100">
          <div class="row">
            <div class="col-md-3">
              <b-form-group label-cols="3" label-cols-horizontal label="기간 설정">
                <b-form-select
                  :options="dateTypes"
                  v-model="dateType"
                  class="col-lg-8"
                  plain required>
                </b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group label-cols="3" label-cols-horizontal label="매체 설정">
                <b-form-select
                  :options="pressTypes"
                  v-model="pressType"
                  class="col-lg-8"
                  plain required>
                </b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <p>갱신일자: {{sync}}</p>
            </div>
          </div>
          <p>본 자료는 수집된 로그에서 빈도수로 계산된 예상 자료입니다.
            광고 관련 부분은 Google Admanager에서 무효트래픽 처리 전 자료를 기반한 자료기에
            실제 수익과 일치하지 않습니다.</p>
          <p>본 자료의 기반데이터는 최초 수집일이 2019년 11월 15일 입니다. 따라서 현재 날짜부터 최초 수집일 기준까지만 식별 가능합니다.
            {{(this.roleCompare(this.getRoleDay().quarter)) ? '현재날짜부터 최초 수집일까지의 간격이 [기간 설정]에 올바르지 않은 일부 항목은 접근을 막았습니다.' : ''}}</p>
          <p>기사 생산량의 경우 PC와 Mobile의 기사 ID가 각각으로 지정된 매체일경우 정확한 식별이 어렵습니다. 추정 수치정도로 확인바랍니다.</p>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'카테고리 유입 TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="categoryDataLabels" :chart-values="categoryDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1" :variant="'primary'" v-for="item in categoryTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'뉴스 생산 TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="newsDataLabels" :chart-values="newsDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1" :variant="'primary'" v-for="item in newsTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'유입 키워드 TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="keywordsDataLabels" :chart-values="keywordsDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1" :variant="'primary'" v-for="item in keywordsTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'광고 노출 TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="adViewDataLabels" :chart-values="adViewDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1 size" :variant="'primary'" v-for="item in adViewTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'광고 클릭 TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="adClickDataLabels" :chart-values="adClickDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1" :variant="'primary'" v-for="item in adClickTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="4" xxs="12" class="mb-4">
        <b-card :title="'광고 CTR TOP 5 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <div class="chart-container h-100">
            <doughnut-shadow-chart :chart-labels="adCtrDataLabels" :chart-values="adCtrDataValues" :height="400"/>
          </div>
          <div style="height:75px;">
            <b-badge class="mb-1 mr-1" :variant="'primary'" v-for="item in adCtrTopTitle" v-bind:key="item.id">{{item }}</b-badge>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <h4>모든 항목의 기준은 카테고리입니다. (카테고리를 제외한 각 항목 타이틀 클릭 시 오름차순/내림차순 정렬이 가능합니다.)</h4>
        <b-card class="mb-4" :title="'카테고리별 분석 자료 > ' + getDateString(dateType) +  ' > ' + getPressString(pressType)">
          <b-table
            ref="custom-table"
            class="vuetable"
            sort-by="host" sort-desc.sync="false"
            selectedVariant="primary"
            :fields="bootstrapTable.fields"
            :items="tableDatas"
          >
            <template slot="category_view" slot-scope="data">
              <h6>{{ numberWithCommas(data.value) }} </h6>
            </template>
            <template slot="category_percent" slot-scope="data">
              <h5><b-badge class="mb-1" :variant="'primary'">{{ data.value }} %</b-badge></h5>
            </template>
            <template slot="news_count" slot-scope="data">
              <h6>{{ numberWithCommas(data.value) }} </h6>
            </template>
            <template slot="news_percent" slot-scope="data">
              <h5><b-badge class="mb-1" :variant="'warning'">{{ data.value }} %</b-badge></h5>
            </template>
            <template slot="ad_view" slot-scope="data">
              <h5>{{ numberWithCommas(data.value) }}</h5>
            </template>
            <template slot="ad_view_percent" slot-scope="data">
              <h5><b-badge class="mb-1" :variant="'success'">{{ data.value }} %</b-badge></h5>
            </template>
            <template slot="ad_click" slot-scope="data">
              <h5>{{ numberWithCommas(data.value) }}</h5>
            </template>
            <template slot="ad_click_percent" slot-scope="data">
              <h5><b-badge class="mb-1 " :variant="'info'">{{ data.value }} %</b-badge></h5>
            </template>
            <template slot="ad_ctr" slot-scope="data">
              <h5><b-badge class="mb-1 " :variant="'dark'">{{ data.value }} %</b-badge></h5>
            </template>
            <template slot="keywords" slot-scope="data">
              <b-button v-b-modal="'keywords'" variant="outline-primary default" size="xs" @click="setOnKeywords(data.value)">유입키워드</b-button>
            </template>
          </b-table>
          <b-modal :id="'keywords'" ref="modalright" class="modal-right">
            <b-table
              ref="custom-table"
              class="vuetable"
              sort-by="host" sort-desc.sync="false"
              selectedVariant="primary"
              :fields="[
                    { key: '_id', label: '키워드', sortable: false, sortDirection: 'desc', tdClass: 'text-muted' },
                    { key: 'count', label: '유입수', sortable: true, tdClass: 'text-muted' },
                  ]"
              :items="onKeywords"
            ></b-table>
          </b-modal>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import DoughnutShadowChart from '@/components/Charts/custom/DoughnutShadow'

export default {
  components: {
    DoughnutShadowChart
  },
  props: ['depth'],
  created () {
    this.dateTypes = [
      {
        value: 'daily',
        text: '일간'
      }, {
        value: 'week',
        text: '주간'
      }, {
        value: 'month',
        text: '월간',
        disabled: this.roleCompare(this.getRoleDay().month) && true
      }, {
        value: 'quarter',
        text: '분기간',
        disabled: this.roleCompare(this.getRoleDay().quarter) && true
      }
    ]
    this.getPressType()
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      sync: null,
      dateTypes: [],
      dateType: 'week',
      pressTypes: [],
      pressType: 'all',
      onKeywords: [],
      newsDataLabels: [],
      newsDataValues: [],
      newsTopTitle: [],
      keywordsDataLabels: [],
      keywordsDataValues: [],
      keywordsTopTitle: [],
      categoryDataLabels: [],
      categoryDataValues: [],
      categoryTopTitle: [],
      adViewDataLabels: [],
      adViewDataValues: [],
      adViewTopTitle: [],
      adClickDataLabels: [],
      adClickDataValues: [],
      adClickTopTitle: [],
      adCtrDataLabels: [],
      adCtrDataValues: [],
      adCtrTopTitle: [],
      tableDatas: [],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      bootstrapTable: {
        fields: [
          { key: 'category', label: '카테고리', sortable: false, sortDirection: 'desc', tdClass: 'text-muted' },
          { key: 'category_view', label: '유입수', sortable: true, tdClass: 'text-muted' },
          { key: 'category_percent', label: '카테고리 유입 비율(%)', sortable: true, tdClass: 'text-muted' },
          { key: 'news_count', label: '뉴스 예상 생산수', sortable: true, tdClass: 'text-muted' },
          { key: 'news_percent', label: '뉴스 생산 비율(%)', sortable: true, tdClass: 'text-muted' },
          { key: 'ad_view', label: '광고 예상 노출수', sortable: true, tdClass: 'text-muted' },
          { key: 'ad_view_percent', label: '광고 노출 비율(%)', sortable: true, tdClass: 'text-muted' },
          { key: 'ad_click', label: '광고 예상 클릭수', sortable: true, tdClass: 'text-muted' },
          { key: 'ad_click_percent', label: '광고 클릭 비율(%)', sortable: true, tdClass: 'text-muted' },
          { key: 'ad_ctr', label: '광고 예상 ctr(%)', sortable: true, tdClass: 'text-muted' },
          { key: 'keywords', label: '유입 키워드', sortable: true, tdClass: 'text-muted' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getPressType () {
      this.xhttp({
        url: 'contents/hosts',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.pressTypes = response.data.data
          this.pressTypes.unshift({ 'value': 'all', 'text': '전체' })
          this.$Progress.finish()
        }
      }).catch((error) => {
        this.respError(error)
      })
    },
    getData () {
      let send = {
        dateType: this.dateType,
        host: this.pressType
      }
      this.xhttp({
        url: 'contents/report/categories',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.sync = response.data.data.updated_at
          this.categoryDataLabels = response.data.data.categories.labels
          this.categoryDataValues = response.data.data.categories.data
          this.categoryTopTitle = this.categoryDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.newsDataLabels = response.data.data.news.labels
          this.newsDataValues = response.data.data.news.data
          this.newsTopTitle = this.newsDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.keywordsDataLabels = response.data.data.keywords.labels
          this.keywordsDataValues = response.data.data.keywords.data
          this.keywordsTopTitle = this.keywordsDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.adViewDataLabels = response.data.data.adView.labels
          this.adViewDataValues = response.data.data.adView.data
          this.adViewTopTitle = this.adViewDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.adClickDataLabels = response.data.data.adClick.labels
          this.adClickDataValues = response.data.data.adClick.data
          this.adClickTopTitle = this.adClickDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.adCtrDataLabels = response.data.data.adCtr.labels
          this.adCtrDataValues = response.data.data.adCtr.data
          this.adCtrTopTitle = this.adCtrDataLabels.slice(0, 5).map((val, idx) => {
            return (idx + 1).toString() + '. ' + val
          })
          this.tableDatas = response.data.data.table
          this.$Progress.finish()
        }
      }).catch((error) => {
        this.respError(error)
      })
    },
    numberWithCommas  (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getDateString (date) {
      switch (date) {
        case 'daily': return '일간'
        case 'week': return '주간'
        case 'month': return '월간'
        case 'quarter': return '분기간'
      }
    },
    getPressString (press) {
      if (press === 'all') {
        return '전체 매체'
      } else {
        return press
      }
    },
    getToday () {
      let today = new Date()
      let day = today.getDate().toString()
      let month = (today.getMonth() + 1).toString()
      let year = today.getFullYear().toString()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      today = Number(year.toString() + month.toString() + day.toString())
      return today
    },
    getRoleDay () {
      let monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - 1)
      let day = monthDate.getDate()
      let month = monthDate.getMonth() + 1
      let year = monthDate.getFullYear()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      monthDate = Number(year.toString() + month.toString() + day.toString())

      let quarterDate = new Date()
      quarterDate.setMonth(quarterDate.getMonth() - 3)
      day = quarterDate.getDate().toString()
      month = (quarterDate.getMonth() + 1).toString()
      year = quarterDate.getFullYear().toString()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      quarterDate = Number(year.toString() + month.toString() + day.toString())

      return {
        month: monthDate,
        quarter: quarterDate
      }
    },
    roleCompare (date) {
      if (date > 20191115) {
        return false
      } else {
        return true
      }
    },
    setOnKeywords (keywords) {
      this.onKeywords = keywords
    }
  },
  watch: {
    pressType () {
      this.getData()
    },
    dateType () {
      this.getData()
    }
  }
}
</script>
