<template>
    <nav class="navbar fixed-top">
        <router-link class="navbar-logo" tag="a" to="/">
            <span class="logo"></span>
            <span class="logo-mobile d-block d-xs-none"></span>
        </router-link>

        <div class="ml-auto">
          <div class="user d-inline-block">
            <b-dropdown   class="dropdown-menu-right"  right variant="empty" toggle-class="p-0" menu-class="mt-3" no-caret>
                <template slot="button-content">
                    <span class="name mr-1" v-if="currentUser">{{currentUser.title}} ( {{currentUser.role}} )</span>
                </template>
                <!--<b-dropdown-item>Account</b-dropdown-item>
                <b-dropdown-divider />-->
                <b-dropdown-item @click="logout">
                  Sign out
                </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
    </nav>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      //
    }
  },
  methods: {
    ...mapActions(['setLang', 'signOut']),
    logout () {
      this.signOut().then(() => {
        this.$router.push('/user/login')
      })
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  watch: {
    '$i18n.locale' (to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path)
      }
    }
  }

}
</script>
