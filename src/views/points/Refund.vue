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
          <div class="col-lg-6 m-3">
            <b-form @submit.prevent="pointRefundSubmit">
              <b-form-group label-cols="2" label-cols-horizontal label="보유 포인트">
                <p class="col-form-label">{{resultPoint}} point</p>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="환불 포인트">
                <b-form-input type="text" v-model="refundPoint" class="ml-1 col-lg-3 d-inline-block align-top" placeholder="환불 포인트" :state="pointValidation" required></b-form-input> <span class="col-form-label d-inline-block ml-2 pt-3">point</span>
                <b-form-invalid-feedback :state="pointValidation" class="text-left">
                  {{vModel.refundValidation}}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="환불 계좌">
                <b-form-input type="text" v-model="response.bank" disabled></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="환불 사유">
                <b-form-textarea rows="2" max-rows="6" v-model="vModel.comment" placeholder="환불 사유" :state="commentValidation" no-resize required></b-form-textarea>
                <b-form-invalid-feedback :state="commentValidation" class="text-left">
                  3자 이상 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-button type="submit" variant="primary" class="d-block mt-4 ml-auto mr-auto">환불요청</b-button>
            </b-form>
          </div>
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
    this.getPointTotal()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        total: null,
        refund: null,
        company_id: null,
        bank: null
      },
      vModel: {
        comment: '',
        validation: '',
        refundValidation: '',
        commentValidation: ''
      },
      refundPoint: null
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    pointRefundSubmit () {
      var point = Number(this.refundPoint.replace(/,/g, ''))
      if (isNaN(point) === false &&
        point <= Number(this.response.total.data) &&
        point > 0 &&
        this.vModel.comment.length > 2) {
        this.getPointRefund(point)
      } else {
        this.vModel.validation = 'on'
        this.vModel.commentValidation = 'on'
      }
    },
    getPointTotal: function () {
      this.xhttp({
        url: 'point/total',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.total = response.data
          this.getUser()
        }
      }).catch((error) => {
        this.response.total = error.response
        this.respError(error)
      })
    },
    getUser: function () {
      this.xhttp({
        url: 'user/' + this.response.user_session.id + '/edit',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          if (this.response.user.data.company.bank === null) {
            this.response.bank = '-'
          } else {
            let bank = this.response.user.data.company.bank.split('|')
            this.response.bank = bank.join(' ')
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    getPointRefund: function (point) {
      if (this.response.bank === '-') {
        this.$notify('error', '환불 요청 실패', '내 정보 수정에서 환불 계좌를 등록하세요.')
      } else {
        let send = {
          refund_point: point,
          comment: this.vModel.comment
        }
        this.xhttp({
          url: '/point/create',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.refund = response.data
            this.respSuccess()
            this.$notify('primary', '환불 요청 완료', '환불 요청 완료되었습니다.')
            this.refundPoint = ''
            this.vModel.comment = ''
            this.vModel.validation = ''
            this.vModel.commentValidation = ''
          }
        }).catch((error) => {
          this.response.refund = error.response
          this.respError(error)
        })
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
    refundPoint: function (val) {
      if (val) {
        let point = Number(val.replace(/,/g, ''))
        if (isNaN(point) === false) {
          // 숫자
          if (point > Number(this.response.total.data)) {
            // 환불포인트 > 보유 포인트
            this.vModel.validation = 'on'
            this.vModel.refundValidation = '보유 포인트보다 작거나 같은 금액을 입력하세요.'
          } else {
            this.vModel.validation = ''
            this.vModel.refundValidation = ''
          }
          const result = val.replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.refundPoint = result
        } else {
          // 문자포함
          this.vModel.validation = 'on'
          this.vModel.refundValidation = '숫자만 입력하세요.'
        }
      }
    }
  },
  computed: {
    pointValidation () {
      if (this.vModel.validation === 'on') {
        var point = Number(this.refundPoint.replace(/,/g, ''))
        return isNaN(point) === false && point <= Number(this.response.total.data) && point > 0
      } else {
        return ''
      }
    },
    commentValidation () {
      if (this.vModel.commentValidation === 'on') {
        return this.vModel.comment.length > 2
      } else {
        return ''
      }
    },
    resultPoint () {
      if (this.response.total) {
        var point = this.response.total.data + ''
        const result = point.replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return result
      } else {
        return ''
      }
    }
  }
}

</script>
