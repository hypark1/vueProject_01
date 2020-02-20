<template>
  <router-view :depth="depth" @child="parents"/>
</template>

<script>
export default {
  created () {
    this.getSession()
  },
  data () {
    return {
      depth: [],
      session: []
    }
  },
  methods: {
    parents (send) {
      this.depth[send[0]] = send[1]
      localStorage.setItem('aiinad-depth', JSON.stringify(this.depth))
      this.getSession()
    },
    getSession () {
      this.session = JSON.parse(localStorage.getItem('aiinad-depth'))
    }
  }
}
</script>
