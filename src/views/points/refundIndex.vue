<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="포인트 환불요청"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table class="text-center"
                   striped
                   show-empty
                   :items="resultPoint.data"
                   :fields="config.pointsField">
            <template slot="empty">
              포인트 환불요청이 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{ resultPoint.total - (resultPoint.per_page * (resultPoint.current_page - 1)) - data.index}}
            </template>
            <template slot="bank" slot-scope="data">
              {{data.value.split('|').join(' ')}}
            </template>
            <template slot="refund_point" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="content" slot-scope="data">
              <b-button size="xs" variant="info default" @click="putRefundUpdate(data.item.id, 0)" class="mr-2">승인</b-button>
              <b-button size="xs" variant="light default" @click="putRefundUpdate(data.item.id, 1)">거절</b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultPoint.last_page">
          </b-pagination-nav>
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
    this.getPointList()
  },
  data () {
    return {
      response: {
        spinner: true,
        point: null,
        refundUpdate: null
      },
      vModel: {
      },
      refund: 0,
      currentPage: 1,
      config: {
        pointsField: {
          no: { label: 'No', sortable: true },
          created_at: { label: '날짜' },
          'user.name': { label: '이름' },
          bank: { label: '환불계좌' },
          refund_point: { label: '포인트' },
          comment: { label: '사유' },
          content: { label: '승인' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: 'pointHistory', query: { page: pageNum }
      }
    },
    getPointList: function () {
      this.vModel.currentPage = this.$route.query.page
      let send = {
        page: this.currentPage
      }
      this.xhttp({
        url: 'point',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.point = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.point = error.response
        this.respError(error)
      })
    },
    putRefundUpdate (id, flag) {
      let send = {
        flag: flag
      }
      this.xhttp({
        url: 'point/' + id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.refundUpdate = response.data
          if (flag === 0) {
            this.$notify('primary', '환불 승인', '환불 승인되었습니다.')
          } else {
            this.$notify('primary', '환불 거절', '환불 거절되었습니다.')
          }
          this.getPointList()
        }
      }).catch((error) => {
        this.response.refundUpdate = error.response
        this.respError(error)
      })
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
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
    currentPage: function () {
      this.getPointList()
    }
  },
  computed: {
    resultPoint () {
      if (this.response.point && this.response.point.success === true && this.response.point.data) {
        return this.response.point.data
      } else {
        return false
      }
    }
  }
}
</script>
