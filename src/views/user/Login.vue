<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side ">
          <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
            <p class="white mb-0">Please use your credentials to login.<br>If you are not a member, please
              <router-link tag="a" to="/user/register" class="white">register</router-link>.
            </p>
        </div>
        <div class="form-side h-50">
          <router-link tag="a" to="/"><span class="logo-single"/></router-link>
          <h6 class="mb-4">로그인</h6>
          <b-form @submit.prevent="formSubmit">
            <label class="form-group has-float-label mb-4">
              <input type="email" class="form-control" v-model="email" v-focus placeholder="E-mail을 입력하세요">
              <span>E-mail</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <input type="password" class="form-control" v-model="password" placeholder="Password를 입력하세요">
              <span>Password</span>
            </label>
            <div>
              <router-link tag="a" :to="{ name: 'userRegisterType' }" class="mr-2">
                <b-button variant="outline-secondary" size="md">회원가입</b-button>
              </router-link>
              <!--
              <router-link tag="a" :to="{ name: 'userPassword' }">
                <b-button variant="outline-info" size="sm">비밀번호 찾기</b-button>
              </router-link>
              -->
              <b-button type="submit" variant="primary" size="md" class="float-right" :disabled="processing">{{ $t('user.login-button')}}</b-button>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      email: '',
      password: '',
      submitStatus: null,
      loginResponse: null
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'processing', 'loginError'])
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  created () {
    // 이전 세션 만료
    this.xhttp({
      url: 'user/logout',
      method: 'get'
    })
    this.$Progress.finish()
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    ...mapActions(['login', 'xhttp']),
    formSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$v.email.email === false && this.$notify('error', '로그인 에러', 'email 형태가 잘못되었습니다.')
        this.$v.email.required === false && this.$notify('error', '로그인 에러', 'email 을 입력하세요')
        this.$v.password.required === false && this.$notify('error', '로그인 에러', 'password 를 입력하세요.')
        this.submitStatus = 'ERROR'
      } else {
        this.xhttp({
          url: 'user/login',
          method: 'post',
          data: { email: this.email, password: this.password }
        }).then((response) => {
          this.loginResponse = response
          this.$Progress.finish()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.$notify('error', '로그인 에러', '아이디 또는 패스워드가 일치하지 않습니다.')
          }
          this.$Progress.fail()
        })
      }
    }
  },
  watch: {
    loginResponse (val) {
      if (val && val.status === 200) {
        this.login(val.data)
      } else {
      }
    },
    currentUser (val) {
      if (val && val.uid) {
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      }
    },
    loginError (val) {
      if (val != null) {
        this.$notify('error', 'Login Error', val)
      }
    }
  }
}
</script>
