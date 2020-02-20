<template>
  <div></div>
</template>

<script>
export default {
  created () {
    this.userFilter()
  },
  data () {
    return {
      user_session: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    userFilter: function () {
      let user = this.user_session.role
      if (user === 'PUBLISHER') {
        this.$router.push({ name: 'pubDashboard' })
      } else if (user === 'AGENCY') {
        this.$router.push({ name: 'agencyDashboard' })
      } else if (user === 'AGENT') {
        this.$router.push({ name: 'agentDashboard' })
      } else if (user === 'ADVERTISER') {
        this.$router.push({ name: 'adDashboard' })
      } else if (['ADMINISTRATOR', 'MANAGER'].includes(user)) {
        this.$router.push({ name: 'adminDashboard' })
      } else {
        this.$router.push({ name: 'contactsIndex' })
      }
    }
  }
}
</script>
