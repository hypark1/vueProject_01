<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Rich Media 소재 생성"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx>
        <b-card class="cf">
          <div class="col-3 mt-5 float-left">
            <h2 class="font-weight-bold ml-3">AIIN AD FORMAT</h2>
            <div class="separator mt-3 mb-4"></div>
            <h3 class="ml-3">Rich Banner</h3>
            <ul class="list-unstyled adBuilder_ul ml-3">
              <li @click="formatClick(0)" :class="{ on: format.idx === 0 }">Native Banner</li>
              <li @click="formatClick(2)" :class="{ on: format.idx === 2 }">Parallax</li>
            </ul>
            <h3 style="border-top: 1px dotted #d7d7d7;" class="mt-4 pt-4 pl-3">VOD</h3>
            <ul class="list-unstyled adBuilder_ul ml-3">
              <li @click="formatClick(3)" :class="{ on: format.idx === 3 }">Native VOD (16:9)</li>
              <li @click="formatClick(4)" :class="{ on: format.idx === 4 }">Native VOD (4:3)</li>
              <li @click="formatClick(5)" :class="{ on: format.idx === 5 }">Native VOD (1:1)</li>
              <li @click="formatClick(1)" :class="{ on: format.idx === 1 }">Two-Sided Banner</li>
              <li @click="formatClick(6)" :class="{ on: format.idx === 6 }">Extended VOD</li>
              <li @click="formatClick(7)" :class="{ on: format.idx === 7 }">VOD & Shopping Box</li>
              <li @click="formatClick(8)" :class="{ on: format.idx === 8 }">Window Play</li>
              <li @click="formatClick(9)" :class="{ on: format.idx === 9 }">Drop Banner & VOD</li>
            </ul>
          </div>
          <div class="col-5 mt-3 float-left">
            <formatComponent :format="vModel.name" :index="format.idx"></formatComponent>
          </div>
          <div class="col-3 mt-5 float-left">
            <h2 class="font-weight-bold mb-3 color-theme-1">{{vModel.name}}</h2>
            <p style="font-size:1rem;">{{vModel.desc}}</p>
            <b-button variant="info" class="mb-2" @click="getCreated">Start Building</b-button>
            <div>
              <template v-if="[0,1,9].includes(format.idx)">
              <h5 style="margin-top:15px;">Main Image Spec</h5>
              <p style="line-height: 1.5rem;">
                - 확장자 : JPG, JPEG, PNG<br>
                - 비율 : 16:9<br>
                - 파일 용량 : 500KB 이하
                <template v-if="[0].includes(format.idx)">
                  <br>
                  - 개수 : 3개 이상 5개 이하
                </template>
              </p>
              </template>

              <template v-if="[1,2,3,4,5,6,7,8,9].includes(format.idx)">
              <h5 style="margin-top:15px;">VOD Spec</h5>
              <p style="line-height: 1.5rem;">
                - 확장자 : MP4, AVI, WMV, MKV<br>
                - 비율 : 16:9<br>
                - 파일 용량 : 10MB 이하
                <template v-if="[1,3,4,5,6,7,8,9].includes(format.idx)">
                <br>
                - 영상 길이 : 5초 이상 30초 이하
                </template>
                <template v-if="[2].includes(format.idx)">
                  <br>
                  - 영상 길이 : 13초 이상<br>
                  - 이미지 기준 : 0.5초 마다 25번 캡쳐, 12.5초까지
                </template>
              </p>
              </template>

              <template v-if="[6,8].includes(format.idx)">
                <h5 style="margin-top:15px;">Background Image Spec</h5>
                <p style="line-height: 1.5rem;">
                  - 확장자 : JPG, JPEG, PNG<br>
                  - 비율 : 자유<br>
                  - 파일 용량 : 500KB 이하
                </p>
              </template>

              <template v-if="[8].includes(format.idx)">
                <h5 style="margin-top:15px;">Side Image Spec</h5>
                <p style="line-height: 1.5rem;">
                  - 확장자 : JPG, JPEG, PNG<br>
                  - 사이즈 : 170px * 145px<br>
                  - 파일 용량 : 500KB 이하
                </p>
              </template>

              <template v-if="[6].includes(format.idx)">
                <h5 style="margin-top:15px;">Icon Image Spec</h5>
                <p style="line-height: 1.5rem;">
                  - 확장자 : JPG, JPEG, PNG<br>
                  - 비율 : 자유<br>
                  - 파일 용량 : 500KB 이하
                </p>
              </template>

              <h5 style="margin-top:15px;">Text Spec</h5>
              <p style="line-height: 1.5rem;">
                <template v-if="[6].includes(format.idx)">
                  - 상단 헤드라인 : 50자 이하<br>
                </template>
                - 버튼 바 : 자세히보기, 더보기 선택 가능
                <template v-if="[0,1,2,3,9].includes(format.idx)">
                <br>
                - 설명 : 1줄 노출<br>
                - 타이틀 : 1줄 노출
                </template>
              </p>

              <template v-if="[7].includes(format.idx)">
                <h5 style="margin-top:15px;">Items Image Spec</h5>
                <p style="line-height: 1.5rem;">
                  - 확장자 : JPG, JPEG, PNG<br>
                  - 비율 : 3:2<br>
                  - 파일 용량 : 500KB 이하<br>
                  - 개수 : 3개 이상 5개 이하
                </p>
                <h5 style="margin-top:15px;">Items Text Spec</h5>
                <p style="line-height: 1.5rem;">
                  - 설명 : 2줄 노출
                </p>
              </template>
            </div>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import formatComponent from './formatComponent.vue'

export default {
  components: {
    formatComponent
  },
  created () {
    this.getFormat()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        type: null,
        format: null,
        formatOptions: null
      },
      vModel: {
        name: '',
        desc: ''
      },
      search: '',
      format: {
        idx: 0,
        name: null,
        desc: [
          '컨텐츠 형식의 자연스러운 노출',
          '이미지와 자동 재생 동영상의 조합으로 브랜딩 광고에 최적',
          '사용자의 스크롤에 따른 반응형 리치 미디어 배너',
          '유효 영역 내 동영상 광고 노출 및 자동 재생',
          '유효 영역 내 동영상 광고 노출 및 자동 재생',
          '유효 영역 내 동영상 광고 노출 및 자동 재생',
          '헤드라인과 동영상 자동 재생을 통한 풍부한 메시지 전달',
          '동영상과 개별 이미지 설정이 가능한 쇼핑몰 최적 옵션',
          '동영상과 이미지 배너의 자연스러운 조화',
          '풍부한 애니메이션 효과와 자연스러운 동영상 재생'
        ]
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    formatClick (idx) {
      this.format.idx = idx
      this.vModel.name = this.format.name[idx]
      this.vModel.desc = this.format.desc[idx]
    },
    getFormat () {
      this.xhttp({
        url: '/builder/preset',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.type = response.data
          this.respSuccess()
          if (response.data.data.length > 0) {
            this.response.formatOptions = response.data.data
            this.format.name = response.data.data.map(function ($value) {
              return $value.text
            })
            this.vModel.name = this.format.name[0]
            this.vModel.desc = this.format.desc[0]
          }
        }
      }).catch((error) => {
        this.response.type = error.response
        this.respError(error)
      })
    },
    getCreated () {
      this.response.spinner = true
      let val = this.response.formatOptions[this.format.idx].value
      let send = {
        format: val
      }
      this.xhttp({
        url: '/builder/create',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.format = response.data
          this.respSuccess()
          if (response.data.data !== false) {
            this.$router.push({ name: val, params: { 'builder_id': response.data.data, 'format_name': this.vModel.name } })
          }
        }
      }).catch((error) => {
        this.response.format = error.response
        this.respError(error)
      })
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      if (error.response.data.messages.message) {
        this.$notify('error', '오류', error.response.data.messages.message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    }
  }
}
</script>
