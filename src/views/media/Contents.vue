<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="사이트 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="row">
              <div class="mb-2 col-lg-2">
                <b-form-group>
                  <v-date-picker
                    mode="range"
                    :input-props="{ class:'form-control' }"
                    v-model="options.date">
                  </v-date-picker>
                </b-form-group>
              </div>
              <div class="mb-2 col-lg-1">
                <b-form-select plain v-model="options.validation">
                  <option slot="first" value="">검증) 전체</option>
                  <option value="1">검증완료</option>
                  <option value="null">검증전</option>
                </b-form-select>
              </div>
              <div class="mb-2 col-lg-1">
                <b-form-select plain v-model="options.manager">
                  <option slot="first" value="">매니저) 전체</option>
                  <option value="김진수">김진수</option>
                  <option value="이화섭">이화섭</option>
                  <option value="장희주">장희주</option>
                  <option value="허서윤">허서윤</option>
                </b-form-select>
              </div>
              <div class="mb-2 col-lg-1">
                <b-form-select plain v-model="options.host"
                               :options="options.hosts">
                  <option slot="first" value="">매체사) 전체</option>
                </b-form-select>
              </div>
              <div class="mb-2 col-lg-1">
                <b-form-select plain v-model="options.category"
                               :options="options.categories">
                  <option slot="first" value="">카테고리) 전체</option>
                </b-form-select>
              </div>
              <div class="mb-2 col-lg-1"><b-button variant="dark default" @click="getContentsList()" class="mb-1" size="xs">재갱신</b-button></div>
              <div class="mb-2 col-lg-2">
                <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                  <b-form-group>
                    <b-form-input placeholder="기사 검색" v-model="vModel.search" :state="searchValidation" required />
                    <b-form-invalid-feedback :state="searchValidation" class="text-left">
                      2자 이상 입력하세요.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
                </b-form>
              </div>
            </div>
            <div class="row">
              <div class="mb-2 col-lg-2" v-if="contents.status"><b-form-group label-rows="4" label-cols-horizontal label="전체">
                <span class="font-weight-bold">{{contents.status.run}} / {{contents.status.total}} ({{contents.status.percent}}%)</span>
              </b-form-group></div>
              <div class="mb-2 col-lg-1" v-if="contents.status"><b-form-group label-rows="4" label-cols-horizontal label="합격">
                <span class="font-weight-bold" style="color:#008a00">{{contents.status.success}} ({{Math.round(contents.status.success / (contents.status.success + contents.status.modify) * 100)}}%)</span>
              </b-form-group></div>
              <div class="mb-2 col-lg-1" v-if="contents.status"><b-form-group label-rows="4" label-cols-horizontal label="수정">
                <span class="font-weight-bold" style="color:#1d50de">{{contents.status.modify}} ({{Math.round(contents.status.modify / (contents.status.success + contents.status.modify) * 100)}}%)</span>
              </b-form-group></div>
              <div class="mb-2 col-lg-1" v-if="contents.status"><b-form-group label-rows="4" label-cols-horizontal label="과거">
                <span class="font-weight-bold" style="color:#e27c79">{{contents.status.past}} ({{Math.round(contents.status.past / contents.status.total * 100)}}%)</span>
              </b-form-group></div>
              <div class="mb-2 col-lg-1" v-if="contents.status"><b-form-group label-rows="4" label-cols-horizontal label="완료된 수">
                <span class="font-weight-bold" style="color:#e78c45">{{contents.status.complete}}</span>
              </b-form-group></div>
            </div>
          </b-collapse>
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table class=""
                   hover
                   show-empty
                   :items="contents.items"
                   :fields="config.siteIndexField">
            <template slot="empty">
              컨텐츠가 없습니다.
            </template>
            <template slot="test" slot-scope="data">
              <span>{{data.item.test === null ? '검증전' : '검증완료'}}</span>
            </template>
            <template slot="text" slot-scope="data">
              <b-button :id="'text-'+data.item.host+data.item.id" size="xs" variant="primary default">원문</b-button>
              <b-popover :target="'text-'+data.item.host+data.item.id"
                         title="원문">
                <textarea style="height:500px; width:400px;" class="border p-2" :value="data.item.text"></textarea>
                <b-button type="button" @click="codeClose('text-' +data.item.host+data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
              </b-popover>
            </template>
            <template slot="noun" slot-scope="data">
              <b-button :id="'noun-'+data.item.host+data.item.id" size="xs" variant="primary default">키워드</b-button>
              <b-popover :target="'noun-'+data.item.host+data.item.id"
                         title="키워드">
                <textarea style="height:500px; width:400px;" class="border p-2" :value="data.item.noun.split(' ')"></textarea>
                <b-button type="button" @click="codeClose('noun-' +data.item.host+data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
              </b-popover>
            </template>
            <template slot="input" slot-scope="data">
              <b-button :id="'input-'+data.item.host+data.item.id" size="xs" variant="primary default">URL</b-button>
              <b-popover :target="'input-'+data.item.host+data.item.id"
                         title="URL">
                <textarea style="height:150px; width:400px;" class="border p-2" :value="data.item.input"></textarea>
                <b-button type="button" @click="codeClose('input-'+data.item.host+data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
              </b-popover>
            </template>
            <template slot="sensitive" slot-scope="data">
              <b-button :id="'sensitive-'+data.item.host+data.item.id" size="xs" variant="primary default">감정</b-button>
              <b-popover :target="'sensitive-'+data.item.host+data.item.id"
                         title="감정">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-4">
                      <p class="mb-2">
                        긍정적인
                        <span class="float-right text-muted">{{data.item.sensitive.Positive}}</span>
                      </p>
                      <b-progress :value="data.item.sensitive.Positive"></b-progress>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-4">
                      <p class="mb-2">
                        부정적인
                        <span class="float-right text-muted">{{Math.abs(data.item.sensitive.Negative)}}</span>
                      </p>
                      <b-progress :value="Math.abs(data.item.sensitive.Negative)"></b-progress>
                    </div>
                  </div>
                  <b-colxx xl="6" lg="12" class="mb-4">
                    <radial-progress-card :title="data.item.sensitive.Polarity === 0 ? '-' : data.item.sensitive.Polarity > 0 ? '긍정' : '부정'" :percent="Math.abs(Math.round(data.item.sensitive.Polarity * 100))"/>
                  </b-colxx>
                  <b-colxx xl="6" lg="12" class="mb-4">
                    <radial-progress-card :title="'주관적인'" :percent="Math.round((data.item.sensitive.Subjectivity * 100))"/>
                  </b-colxx>
                </div>
                <b-button type="button" @click="codeClose('sensitive-'+data.item.host+data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
              </b-popover>
            </template>
            <template slot="delete" slot-scope="data">
              <b-button size="xs" variant="primary default" @click="deleteNews(data.item._id)">삭제</b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="contents.last_page">
          </b-pagination-nav>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import RadialProgressCard from '@/components/Cards/RadialProgressCard'

export default {
  components: {
    RadialProgressCard
  },
  props: ['depth'],
  created () {
    this.getHostList()
    this.getCategoryList()
  },
  data () {
    return {
      options: {
        date: null,
        validation: '',
        hosts: [],
        host: '',
        category: '',
        manager: '',
        categories: []
      },
      contents: {},
      vModel: {
        search: '',
        searchVal: ''
      },
      currentPage: 1,
      config: {
        siteIndexField: {
          host: { label: '도메인' },
          title: { label: '제목' },
          cate_string: { label: '카테고리' },
          user: { label: '매니저' },
          test: { label: '검증' },
          text: { label: '원문' },
          noun: { label: '키워드' },
          sensitive: { label: '감정' },
          delete: { label: '삭제' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    submitSearch: function () {
      this.currentPage = 1
      this.getContentsList()
    },
    getHostList () {
      this.xhttp({
        url: 'contents/hosts',
        method: 'get'
      }).then((response) => {
        if (response.status === 200) {
          this.options.hosts = response.data.data
        }
      })
    },
    getCategoryList () {
      this.xhttp({
        url: 'contents/workCategories',
        method: 'get'
      }).then((response) => {
        if (response.status === 200) {
          let categories = []
          response.data.data.map((val) => {
            categories.push({ value: val._id, text: val.name })
          })
          this.options.categories = categories
        }
      })
    },
    linkGen (val) {

    },
    codeClose (idx) {
      document.getElementById(idx).click()
    },
    deleteNews (_id) {
      var send = {
        _id: _id.$oid
      }
      this.xhttp({
        url: 'contents/delete',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.options.hosts = response.data.data
          this.getContentsList()
        }
      })
    },
    getContentsList () {
      let validation = this.options.validation
      if (this.options.validation) {
        if (this.options.validation === '1') {
          validation = 1
        } else if (this.options.validation === 'null') {
          validation = null
        }
      } else {
        validation = 'all'
      }
      let send = {
        page: this.currentPage,
        validation: validation,
        category: this.options.category,
        manager: this.options.manager,
        search: null,
        host: this.options.host,
        date: this.options.date ? {
          start: this.$moment(this.options.date.start).format('YYYY-MM-DD'),
          end: this.$moment(this.options.date.end).format('YYYY-MM-DD')
        } : null
      }
      if (this.vModel.search) {
        if (this.vModel.search.length > 1) {
          send.search = this.vModel.search
        }
      }
      this.xhttp({
        url: 'contents/lists',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.$Progress.finish()
          this.contents = response.data.data
        }
      })
    }
  },
  computed: {
    searchValidation () {
      if (this.vModel.searchVal === 'on') {
        return this.vModel.search.length > 1
      } else {
        return ''
      }
    }
  },
  watch: {
    options: {
      handler (val) {
        if (this.options.hosts.length > 0 && this.options.categories.length > 0) {
          this.currentPage = 1
          this.getContentsList()
        }
      },
      deep: true
    },
    currentPage: function () {
      this.getContentsList()
    },
    vModel: {
      handler (val) {
        if (val.search) {
          if (val.length > 1) {
            this.currentPage = 1
          }
        }
      },
      deep: true
    }
  }
}
</script>
