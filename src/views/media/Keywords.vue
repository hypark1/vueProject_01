<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="사이트 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form-group label-cols-vertical label="비허용 키워드" class="mt-2">
            <div class="row">
              <div class="col-lg-11">
                <v-select multiple
                          taggable
                          v-model="denyKeywords"
                          placeholder="키워드 입력"
                          max-height="800"
                          ref="keywords" class="col-lg-12 p-0 mb-2 d-inline-block"/>
              </div>
              <div class="col-lg-1">
                <b-button variant="primary default" @click="saveKeywords()">저장</b-button>
              </div>
            </div>
          </b-form-group>
          <div class="row">
            <div class="col-lg-11">
              <b-form-group label-rows="1" label-cols-horizontal>
                <b-form-textarea rows="5" max-rows="5" class="m-0 p-0" placeholder="삽입할 키워드를 입력하세요 / 키워드 한개당 띄어쓰기 없는 쉼표" no-resize v-model="addKeywords"></b-form-textarea>
              </b-form-group>
            </div>
            <div class="col-lg-1">
              <b-form-group label-rows="2" label-cols-horizontal>
                <b-button variant="primary default" @click="insertKeywords(addKeywords)">삽입</b-button>
              </b-form-group>
            </div>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  props: ['depth'],
  components: {
    vSelect
  },
  created () {
    this.getkeywordOptions()
  },
  data () {
    return {
      denyKeywords: [],
      addKeywords: ''
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getkeywordOptions () {
      this.xhttp({
        url: 'contents/keyword_options',
        method: 'get'
      }).then((response) => {
        if (response.status === 200) {
          this.denyKeywords = response.data.data.denyKeywords
          this.$Progress.finish()
        }
      })
    },
    insertKeywords (text) {
      text = text.replace(/^\s+|\s+$/g, '')
      text = text.replace(', ', ',')
      text = text.replace(' ,', ',')
      if (text) {
        let keywords = text.split(',')
        for (let i = 0; i < keywords.length; i++) {
          if (keywords[i] && this.denyKeywords.indexOf(keywords[i]) === -1) {
            this.denyKeywords.push(keywords[i])
          }
        }
        this.addKeywords = ''
      }
    },
    saveKeywords () {
      var send = {
        keywords: this.denyKeywords
      }
      this.xhttp({
        url: 'contents/saveDenyKeywords',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.$Progress.finish()
        }
      })
    }
  }
}
</script>
