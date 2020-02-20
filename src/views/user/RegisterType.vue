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
          <h6>회원 가입</h6>
          <div class="text-right mr-1"><p>Step.01</p></div>
          <div v-for="(data, index) in resultUserTypeOptions" :key="data.index">
            <b-button :variant="vModel.userTypeAlert[index]" @click="registerSubmit(index)">{{data.text}}</b-button>
            <p class="ml-2 mt-2 mb-4">{{vModel.userTypeText[index]}}</p>
          </div>
          <router-link tag="a" :to="{ name: 'userLogin' }" class="float-right">
            <b-button variant="outline-info" size="md">이전</b-button>
          </router-link>
        </div>
      </b-card>
    </b-colxx>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </b-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  created () {
    this.getUserRole()
  },
  data () {
    return {
      response: {
        spinner: true,
        userTypeOptions: []
      },
      vModel: {
        userType: '',
        userTypeText: [
          '다수의 광고주를 관리하는 광고 대행사가 가입합니다. 다수의 영업자와 광고주를 관리 할 수 있습니다.',
          '광고 대행사를 통하지 않고 직접 광고를 집행하는 광고주가 가입합니다.',
          '뉴스, 커뮤니티, 블로그 등 사이트를 보유한 컨텐츠 공급자가 가입합니다.'
        ],
        userTypeAlert: ['primary', 'success', 'info']
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getUserRole () {
      this.xhttp({
        url: 'user/role',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.userTypeOptions = response.data
          this.$Progress.finish()
          this.response.spinner = false
        }
      }).catch((error) => {
        this.response.userTypeOptions = error.response
        if (error.response.data.messages.message) {
          this.$notify('error', '오류', error.response.data.messages.message)
        } else {
          this.$notify('error', '오류', '관리자에게 문의바랍니다.')
        }
        this.$Progress.fail()
        this.response.spinner = false
      })
    },
    registerSubmit (idx) {
      this.$router.push({ name: 'userRegister', params: { userType_id: this.response.userTypeOptions.data[idx].value, userType_text: this.response.userTypeOptions.data[idx].text } })
    }
  },
  computed: {
    resultUserTypeOptions () {
      if (this.response.userTypeOptions && this.response.userTypeOptions.success === true && this.response.userTypeOptions.data) {
        return this.response.userTypeOptions.data
      } else {
        return false
      }
    }
  }
}
</script>
