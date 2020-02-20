<template>
    <span>
      <h1 v-if="heading && heading.length>0">{{ heading }}</h1>
      <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
          <b-breadcrumb :items="items"/>
      </b-nav>
    </span>
</template>

<script>
export default {
  props: ['heading', 'depth'],
  data () {
    return {
      items: []
    }
  },
  methods: {
    getUrl (path, sub, index) {
      var pathToGo = '/' + path.split(sub)[0] + sub
      if (pathToGo === '/app') {
        pathToGo = '/'
      }
      return pathToGo
    }
  },
  mounted () {
    let path = this.$route.path.substr(1)
    let rawPaths = path.split('/')

    for (var pName in this.$route.params) {
      if (rawPaths.includes(this.$route.params[pName])) {
        rawPaths = rawPaths.filter(x => x !== this.$route.params[pName])
      }
    }
    var count = 0
    rawPaths.map((sub, index) => {
      if (rawPaths[0] !== 'media') {
        var data = sub
        if (isNaN(data) === true) {
          // 문자
          this.items.push({
            text: this.$t('menu.' + sub),
            to: this.getUrl(path, sub, index)
          })
        }
      } else {
        var num = sub
        if (this.$route.params.type === 'list' && index === 1) {
          return false
        }
        if (isNaN(num) === false) {
          // 숫자
          if (this.$route.params.campaign_id) {
            this.items.push({
              text: this.depth[count],
              to: this.getUrl(path, sub, index)
            })
          } else {
            if (index !== 2) {
              // 3번째 제외
              this.items.push({
                text: this.depth[count],
                to: this.getUrl(path, sub, index)
              })
              count++
            }
          }
        } else {
          // 문자
          if (index === 3) {
            // 4번째에 첫번째 문자 넣기
            if (sub === 'groups' || sub === 'daily') {
              this.items.push({
                text: this.$t('menu.' + sub),
                to: this.getUrl(path, sub, index)
              })
            } else if (this.depth[count]) {
              // 첫번째 문자 있을때
              this.items.push({
                text: this.depth[count],
                to: this.getUrl(path, sub, index)
              })
            }
            count++
          } else {
            this.items.push({
              text: this.$t('menu.' + sub),
              to: this.getUrl(path, sub, index)
            })
          }
        }
      }
    })
  }
}
</script>
