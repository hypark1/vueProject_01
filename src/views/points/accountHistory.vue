<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="가상계좌 충전 이력"/>
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
              가상계좌 충전 이력이 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{ resultPoint.total - data.index }}
            </template>
            <template slot="amount" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="point" slot-scope="data">
              {{numReplace(data.item.amount *10/11)}}
            </template>
            <template slot="tax" slot-scope="data">
              {{numReplace(data.item.amount *1/11)}}
            </template>
            <template slot="bank_url" slot-scope="data">
              <template v-if="data.value">
                <b-button variant="info" size="xs" @click="accountImg(data.value)">
                  이미지 보기
                </b-button>
              </template>
              <template v-else>-</template>
            </template>
          </b-table>
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
        point: null
      },
      vModel: {
      },
      currentPage: 1,
      config: {
        pointsField: {
          no: { label: 'No' },
          date: { label: '날짜' },
          account: { label: '계좌번호' },
          name: { label: '입금자명' },
          company_name: { label: '회사' },
          company_number: { label: '사업자번호' },
          amount: { label: '입금액', tdClass: 'table_num' },
          point: { label: '충전포인트', tdClass: 'table_num' },
          tax: { label: 'TAX', tdClass: 'table_num' },
          bank_url: { label: '계좌 사본' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: 'accountHistory'
      }
    },
    getPointList: function () {
      this.xhttp({
        url: '/point/accountHistory',
        method: 'get',
        params: null
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
    numReplace: function (num) {
      num = Math.round(num, 0)
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    imgSet: function (val) {
      let img = val.split('/')
      return img[img.length - 1]
    },
    accountImg: function (val) {
      window.open('https://aiinad.com/storage/' + this.imgSet(val))
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
