<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="광고주 영업 현황"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx>
        <b-card class="mb-4 cf">
          <b-form @submit.prevent="submitSearch()">
            <b-row class="m-0">
              <b-form-group>
                <b-form-select v-model="vModel.listMax"
                               :options="config.listMaxOptions"
                               style="width:150px;height:43px;"
                               class="mr-2"
                               plain>
                </b-form-select>
              </b-form-group>
              <b-form-group>
                <v-date-picker
                  mode="range"
                  class="mr-2"
                  :input-props="{ class:'form-control' }"
                  v-model="vModel.datePickerRange">
                </v-date-picker>
              </b-form-group>
              <b-form-group>
                <b-form-select v-model="search_type"
                               :options="response.typeOptions"
                               style="width:150px;height:43px;"
                               class="mr-2"
                               plain required>
                </b-form-select>
              </b-form-group>
              <b-form-group>
                <b-form-input type="text" v-model="search" placeholder="Search" required />
              </b-form-group>
              <b-form-group>
                <b-button type="submit" class="d-inline-block default border" variant="light">검색</b-button>
              </b-form-group>
            </b-row>
          </b-form>
          <template v-if="response.creative">
            <b-table class="text-center"
                     striped
                     bordered
                     show-empty
                     :items="response.creative.data.data"
                     :fields="config.creativeField">
              <template slot="empty">
                광고주가 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                <template v-if="data.value">{{data.value}}</template>
                <template v-else>{{response.creative.data.data.total - (data.index - 1)}}</template>
              </template>
              <template slot="sdate" slot-scope="data">
                {{data.value.substring(2,10)}}
              </template>
              <template slot="edate" slot-scope="data">
                {{data.value.substring(2,10)}}
              </template>
              <template slot="status" slot-scope="data">
                <template v-if="statusTxt[data.value]">
                  {{statusTxt[data.value]}}
                </template>
                <template v-else>{{data.value}}</template>
              </template>
              <template slot="pay" slot-scope="data">
                {{numReplace(data.value)}}원
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
            </b-table>
          </template>
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

export default {
  created () {
    this.roleSelect()
    this.getCreativeFilter()
  },
  data () {
    return {
      config: {
        creativeField: {},
        creativeField_admin: {
          no: { label: 'No', sortable: true },
          company_name: { label: '회사', tdClass: 'table_title' },
          agent_name: { label: '매니저명' },
          name: { label: '광고주명' },
          line_item_name: { label: '캠페인명' },
          line_item_id: { label: '캠페인ID' },
          sdate: { label: '시작일' },
          edate: { label: '종료일' },
          creative_name: { label: '광고명' },
          status: { label: '상태' },
          pay: { label: '소진 예산', tdClass: 'table_num' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' }
        },
        creativeField_agent: {
          no: { label: 'No', sortable: true },
          name: { label: '광고주명' },
          line_item_name: { label: '캠페인명' },
          line_item_id: { label: '캠페인ID' },
          sdate: { label: '시작일' },
          edate: { label: '종료일' },
          creative_name: { label: '광고명' },
          status: { label: '상태' },
          pay: { label: '소진 예산', tdClass: 'table_num' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' }
        },
        listMaxOptions: [
          { value: 10, text: '최대 10개' },
          { value: 50, text: '최대 50개' },
          { value: 100, text: '최대 100개' }
        ]
      },
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        creativeFilter: null,
        typeOptions: [],
        creative: null,
        dateType: null
      },
      vModel: {
        listMax: 10,
        datePickerRange: {
          start: this.$moment(new Date()).add(-6, 'days')._d,
          end: this.$moment(new Date()).add('days')._d
        }
      },
      search_type: null,
      search: null,
      statusTxt: {
        'DRAFT': '임시',
        'INACTIVE': '승인 대기',
        'READY': '준비',
        'PENDING APPROVAL': '승인 대기 중',
        'DISAPPROVED': '승인되지 않음',
        'EXPECTED TO UNDERDELIVER': '미달게재 예상됨',
        'DELIVERING': '게재 중',
        'COMPLETED': '완료',
        'PAUSED': '일시중지',
        'DELIVERY EXTENDED': '게재 연장됨',
        'PAUSED_INVENTORY_RELEASED': '정지(IR)'
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    roleSelect () {
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        this.config.creativeField = this.config.creativeField_admin
      } else if (this.response.user_session.role === 'AGENT') {
        this.config.creativeField = this.config.creativeField_agent
      } else {
        this.$router.push({ name: 'contactsIndex' })
      }
      this.fnRefresh()
    },
    getCreativeFilter () {
      this.xhttp({
        url: 'report/creativeFilter',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.creativeFilter = response.data
          this.search_type = this.response.creativeFilter[0].key
          this.response.typeOptions = this.response.creativeFilter.map(function ($value) {
            return { value: $value.key, text: $value.value }
          })
        }
      }).catch((error) => {
        this.response.creativeFilter = error.response
        this.respError(error)
      })
    },
    fnRefresh () {
      this.vModel.listMax = this.$route.query.max
      this.vModel.datePickerRange.start = this.$moment(this.$route.query.start)._d
      this.vModel.datePickerRange.end = this.$moment(this.$route.query.end)._d
      if (this.$route.query.search) {
        this.search_type = this.$route.query.type
        this.search = this.$route.query.search
      }
      this.getCreativeList()
    },
    submitSearch () {
      let send = { page: 1 }
      send.max = this.vModel.listMax
      send.start = this.$moment(this.vModel.datePickerRange.start).format('YYYY-MM-DD')
      send.end = this.$moment(this.vModel.datePickerRange.end).format('YYYY-MM-DD')
      if (this.search) {
        send.type = this.search_type
        send.search = this.search
      }
      this.$router.push({ name: 'reportCreativeIndex', query: send })
      this.currentPage = 1
      this.getCreativeList()
    },
    getCreativeList () {
      this.response.spinner = true
      let send = {
        start_date: this.$moment(this.vModel.datePickerRange.start).format('YYYY-MM-DD'),
        end_date: this.$moment(this.vModel.datePickerRange.end).format('YYYY-MM-DD')
      }
      if (this.vModel.listMax) {
        send.limit = this.vModel.listMax
      }
      if (this.search_type && this.search) {
        send.search_type = this.search_type
        send.search_text = this.search
      }
      this.xhttp({
        url: 'report/creative',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.creative = response.data
          if (this.response.creative.data.data.length > 0) {
            this.response.creative.data.data.total = this.response.creative.data.data.length
            this.response.creative.data.data.unshift(
              {
                no: '합계',
                pay: this.response.creative.data.total[0].pay,
                views: this.response.creative.data.total[0].views,
                clicks: this.response.creative.data.total[0].clicks,
                ctr: this.response.creative.data.total[0].ctr,
                _rowVariant: 'secondary'
              }
            )
          }
          this.response.dateType = true
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.creative = error.response
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
    vModel: {
      handler (val) {
        this.submitSearch()
      },
      deep: true
    },
    search: function (val) {
      if (val === '') {
        this.submitSearch()
      }
    }
  }
}
</script>
