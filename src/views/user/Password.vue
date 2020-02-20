<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">Please use your e-mail to reset your password. <br>If you are not a member, please
                <router-link tag="a" to="/user/register" class="white">register</router-link>.
              </p>
          </div>
          <div class="form-side">
            <router-link tag="a" to="/"><span class="logo-single"/></router-link>
            <h6 class="mb-4">비밀번호 찾기</h6>
            <b-form @submit.prevent="passwordSubmit">
              <label class="form-group has-float-label mb-4">
                <input type="text" class="form-control" v-model="name">
                <span>Name</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input type="email" class="form-control" v-model="email">
                <span>E-mail</span>
              </label>
              <div>
                <router-link tag="a" :to="{ name: 'userLogin' }">
                  <b-button variant="outline-info" size="md">이전</b-button>
                </router-link>
                <b-button type="submit" variant="primary" size="md" class="float-right">확인</b-button>
              </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    //
  }
}
</script>
