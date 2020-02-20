<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side ">
          <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
          <p class="white mb-0">  Please use this form to register. <br />If you are a member, please
            <router-link tag="a" to="/user/login" class="white">login</router-link>.
          </p>
        </div>
        <div class="form-side">
          <h6 class="pb-3">정보 입력</h6>
          <b-form @submit.prevent="registerSubmit">
            <label class="form-group has-float-label mb-4">
              <b-form-input type="text" required v-model="vModel.name"></b-form-input>
              <span>상호명</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <b-form-input type="number" onwheel="this.blur()" required v-model="vModel.number" ref="number" :state="numberValidation" placeholder="하이픈(-)을 제외한 숫자 10자리를 입력하세요."></b-form-input>
              <span>사업자 등록번호</span>
              <b-form-invalid-feedback :state="numberValidation" class="text-left">
                하이픈(-)을 제외한 숫자 10자리를 입력하세요.
              </b-form-invalid-feedback>
            </label>
            <label class="form-group has-float-label mb-4 d-inline-block" style="width:48%">
              <b-form-input type="text" required v-model="vModel.business"></b-form-input>
              <span>업태</span>
            </label>
            <label class="form-group has-float-label mb-4 float-right" style="width:48%">
              <b-form-input type="text" required v-model="vModel.type"></b-form-input>
              <span>종목</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <b-form-input type="text" required v-model="vModel.address"></b-form-input>
              <span>사업장주소지</span>
            </label>
            <label class="form-group has-float-label mb-4 d-inline-block" style="width:48%">
              <b-form-input type="text" required v-model="vModel.representation_name"></b-form-input>
              <span>대표자</span>
            </label>
            <label class="form-group has-float-label mb-4 float-right" style="width:48%">
              <b-form-input type="text" required v-model="vModel.in_charge_name"></b-form-input>
              <span>담당자</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <b-form-input type="email" required v-model="vModel.email"></b-form-input>
              <span>이메일</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <b-form-input type="number" onwheel="this.blur()" required v-model="vModel.mobile" ref="mobile" :state="mobileValidation" placeholder="하이픈(-)을 제외한 휴대폰 번호를 입력하세요."></b-form-input>
              <span>휴대폰 번호</span>
              <b-form-invalid-feedback :state="mobileValidation" class="text-left">
                하이픈(-)을 제외한 휴대폰 번호를 올바르게 입력하세요.
              </b-form-invalid-feedback>
            </label>
            <div>
              <b-button type="submit" variant="primary" size="md" class="float-right">가입 완료</b-button>
            </div>
          </b-form>
          <b-modal id="registerAlert" ref="registerAlert" title="회원가입 완료" no-close-on-esc no-close-on-backdrop hide-header-close>
            회원가입이 완료되었습니다.
            <template slot="modal-footer">
              <b-button variant="primary" @click="registerSuccess" class="mr-1">확인</b-button>
            </template>
          </b-modal>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      response: {
        registerResponse: null
      },
      vModel: {
        name: '',
        number: '',
        business: '',
        type: '',
        address: '',
        representation_name: '',
        in_charge_name: '',
        email: '',
        mobile: '',
        validation: null
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    registerSubmit () {
      if (this.vModel.number.length !== 10 || this.vModel.mobile.length >= 12 || this.vModel.mobile.length <= 9) {
        this.vModel.validation = 'on'
        if (this.vModel.number.length !== 10) {
          this.$refs.number.focus()
        } else if (this.vModel.mobile.length >= 12 || this.vModel.mobile.length <= 9) {
          this.$refs.mobile.focus()
        }
      } else {
        let send = {
          name: this.vModel.name,
          number: this.vModel.number,
          business: this.vModel.business,
          type: this.vModel.type,
          address: this.vModel.address,
          representation_name: this.vModel.representation_name,
          in_charge_name: this.vModel.in_charge_name,
          email: this.vModel.email,
          mobile: this.vModel.mobile
        }
        this.xhttp({
          url: 'company/create',
          method: 'get',
          params: send
        }).then((response) => {
          this.response.registerResponse = response
          if (response.status === 200) {
            this.$refs['registerAlert'].show()
          }
        }).catch((error) => {
          if (error.response.status === 401) {
            this.$notify('error', '가입 에러', '가입에 실패했습니다.')
          }
        })
      }
    },
    registerSuccess () {
      this.$router.push('/')
    }
  },
  computed: {
    numberValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.number.length === 10
      } else {
        return ''
      }
    },
    mobileValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12
      } else {
        return ''
      }
    }
  }
}
</script>
