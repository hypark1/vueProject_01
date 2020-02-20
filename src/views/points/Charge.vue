<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="포인트 충전"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <div class="col-lg-6 m-3">
            <b-row>
              <div class="col-lg-3">
                <h5 class="mb-4 font-weight-bold"><i class="iconsminds-record"></i>전용가상계좌</h5>
              </div>
              <div class="col-lg-9">
                <h5>국민은행 {{response.account}} 예금주 : 주식회사 에이플에이디</h5>
              </div>
            </b-row>
            <b-alert show variant="secondary" class="p-3 mb-5">
              전용가상계좌는 {{vModel.name}}님만 사용하는 전용계좌입니다.<br>
              전용가상계좌로 입금시 별도 충전신청없이 입금후 1분이내로 자동 충전이 진행됩니다.<br>
              포인트는 입금 금액에서 vat를 제외한 금액이 충전됩니다.<br>
              예) 1,100,000원 입금시 1,000,000원 충전 (세금계산서 발행)
            </b-alert>
            <!--
            <div class="separator mb-5"></div>
            <h5 class="mb-4 font-weight-bold"><i class="iconsminds-record"></i>카드결제</h5>
            <b-form action="http://localhost:8080/pay/order" target="_blank" method="get">
              <b-form-group label-cols="2" label-cols-horizontal label="결제자명">
                <b-form-input type="text" v-model="vModel.name" required placeholder="결제자명을 입력하세요."></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="충전금액">
                <b-form-select v-model="amount.amountSelect"
                               :options="response.amountOptions"
                               class="col-lg-4 col-12 d-inline-block"
                               style="height:43px;"
                               plain required>
                  <option slot="first" value="">충전금액 선택</option>
                </b-form-select>
                <div class="position-relative ml-1 p-0 d-inline-block align-top col-lg-7">
                  <b-form-input type="text" v-model="amount.value" class="d-inline-block col-lg-6" :disabled="amount.amountDisabled" :state="pointValidation" required></b-form-input>
                  <span class="ml-1 d-inline-block">원 (vat포함)</span>
                  <b-form-invalid-feedback :state="pointValidation" class="text-left">
                    <span class="position-absolute">숫자만 입력하세요.</span>
                  </b-form-invalid-feedback>
                </div>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="E-mail">
                <b-form-input type="text" v-model="vModel.email" required placeholder="E-mail을 입력하세요."></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="핸드폰">
                <b-form-input type="text" v-model="vModel.mobile" onwheel="this.blur()" required placeholder="핸드폰 번호를 입력하세요."></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary" class="d-block mt-4 ml-auto mr-auto">충전하기</b-button>
            </b-form>
            -->
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
    this.getUser()
  },
  data () {
    return {
      response: {
        spinner: true,
        amountOptions: [
          { value: 0, text: '직접입력' },
          { value: 1, text: '11,000' },
          { value: 2, text: '33,000' },
          { value: 3, text: '55,000' },
          { value: 4, text: '110,000' },
          { value: 5, text: '220,000' },
          { value: 6, text: '550,000' },
          { value: 7, text: '1,100,000' },
          { value: 8, text: '2,200,000' },
          { value: 9, text: '3,300,000' }
        ],
        user_session: JSON.parse(localStorage.getItem('user')),
        user: null,
        company_id: null,
        account: null
      },
      vModel: {
        name: null,
        type: null,
        email: null,
        mobile: null,
        validation: ''
      },
      amount: {
        value: null,
        amountSelect: '',
        amountDisabled: true
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getUser () {
      this.xhttp({
        url: 'user/' + this.response.user_session.id + '/edit',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          this.response.account = this.response.user.data.account
          this.vModel.name = this.response.user.data.name
          this.vModel.email = this.response.user.data.email
          if (this.response.user.data.mobile) {
            this.vModel.mobile = this.response.user.data.mobile
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
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
    amount: {
      handler (val) {
        if (val.amountSelect === 0) {
          // 직접입력
          if (val.amountDisabled === true) {
            // 처음 클릭시에만
            val.value = ''
          } else {
            // 입력할때
            var number = val.value
            let point = Number(number.replace(/,/g, ''))
            if (isNaN(point) === false) {
              // 숫자
              const result = number.replace(/\D/g, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.amount.value = result
            } else {
              // 문자포함
              this.vModel.validation = 'on'
            }
          }
          val.amountDisabled = false
        } else {
          // 금액선택
          val.amountDisabled = true
          this.vModel.validation = ''
          if (val.amountSelect === '') {
            // 충전금액 선택
            val.value = ''
          } else {
            // 가격 선택
            val.value = this.response.amountOptions[val.amountSelect].text
          }
        }
      },
      deep: true
    }
  },
  computed: {
    pointValidation () {
      if (this.vModel.validation === 'on') {
        var point = Number(this.amount.value.replace(/,/g, ''))
        return isNaN(point) === false
      } else {
        return ''
      }
    }
  }
}
</script>
