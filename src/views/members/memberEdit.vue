<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="회원 관리"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
          <div class="col-lg-6 float-left">
            <h2 class="mb-4">일반 정보</h2>
            <b-form @submit.prevent="passwordEditSubmit" class="col-lg-12">
              <b-form-group label-cols="3" label-cols-horizontal label="이름">
                <b-form-input type="text" v-model="vModel.name" required placeholder="이름을 입력하세요."></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="이메일">
                <b-form-input type="email" v-model="vModel.email" disabled></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="휴대폰번호">
                <b-form-input type="number" v-model="vModel.mobile" required placeholder="휴대폰번호를 입력하세요."></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="비밀번호">
                <b-form-input type="password" v-model="vModel.password" required placeholder="비밀번호를 입력하세요." :state="passwordValidation"></b-form-input>
                <b-form-invalid-feedback :state="passwordValidation" class="text-left">
                  비밀번호를 6자 이상 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <div class="mt-4 text-center">
              <b-button type="submit" variant="info" size="md" class="mt-2 mr-2">수정</b-button>
              <b-button variant="light" size="md" class="mt-2" @click="beforePage()">취소</b-button>
              </div>
            </b-form>
            <div class="separator mt-4 mb-5"></div>
            <h2 class="mb-4">사업자 정보</h2>
            <b-form @submit.prevent="userEditSubmit" class="col-lg-12">
              <template v-if="resultUsers.role == 'AGENCY' && (currentUser.role == 'ADMINISTRATOR' || currentUser.role == 'MANAGER')">
                <b-form-group label-cols="3" label-cols-horizontal label="리워드 비율">
                  <b-form-input type="text" v-model="vModel.reward" required placeholder="%(퍼센트)를 입력하세요." :state="companyRewardValidation"></b-form-input>
                  <b-form-invalid-feedback :state="companyRewardValidation" class="text-left">
                    100이하로 입력하세요.
                  </b-form-invalid-feedback>
                </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="상호명">
                <b-form-input type="text" v-model="vModel.company_name" required placeholder="상호명을 입력하세요." :state="companyNameValidation"></b-form-input>
                <b-form-invalid-feedback :state="companyNameValidation" class="text-left">
                  100자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="사업자 등록번호">
                <b-form-input type="number" onwheel="this.blur()" required v-model="vModel.company_number" ref="number" :state="numberValidation" placeholder="하이픈(-)을 제외한 숫자 10자리를 입력하세요."></b-form-input>
                <b-form-invalid-feedback :state="numberValidation" class="text-left">
                  하이픈(-)을 제외한 숫자 10자리를 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="환불 계좌 정보">
                <b-input-group>
                  <b-form-input type="text" v-model="vModel.account_bank" class="col-lg-3 float-left" :state="accountValidation" placeholder="은행명" required></b-form-input>
                  <b-form-input type="number" onwheel="this.blur()" v-model="vModel.account_number" class="col-lg-6 float-left" :state="accountValidation" placeholder="계좌 번호" required>
                  </b-form-input>
                  <b-form-input type="text" v-model="vModel.account_name" class="col-lg-3 float-left" :state="accountValidation" placeholder="예금주 명" required></b-form-input>
                </b-input-group>
                <b-form-invalid-feedback :state="accountValidation">
                  환불 계좌 정보를 정확하게 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="대표자명">
                <b-form-input type="text" required v-model="vModel.company_representation_name" placeholder="대표자명을 입력하세요." :state="representationValidation"></b-form-input>
                <b-form-invalid-feedback :state="representationValidation" class="text-left">
                  14자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="주소지">
                <b-input-group>
                  <b-form-input type="text" v-model="vModel.company_address" required placeholder="주소지를 검색하세요." @click="addressSearch" @keyup="addressSearch"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="outline-secondary" @click="addressSearch">검색</b-button>
                  </b-input-group-append>
                </b-input-group>
                <b-form-input type="text" required v-model="vModel.company_address2" placeholder="추가 주소지를 입력하세요." class="d-inline-block mt-2" :disabled="vModel.company_address_disabled" :state="companyAddressValidation"></b-form-input>
                <b-form-invalid-feedback :state="companyAddressValidation" class="text-left">
                  100자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="업태 / 종목">
                <b-input-group>
                  <b-form-input type="text" v-model="vModel.company_business" class="col-lg-6 float-left" required placeholder="업태를 입력하세요." :state="companyBusinessValidation"></b-form-input>
                  <b-form-input type="text" v-model="vModel.company_type" class="col-lg-6 d-inline-block" required placeholder="종목을 입력하세요." :state="companyTypeValidation"></b-form-input>
                </b-input-group>
                <b-form-invalid-feedback :state="companyBusinessValidation" class="text-left col-lg-6 float-left pl-0">
                  10자 이하로 입력하세요.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback :state="companyTypeValidation" class="text-left">
                  10자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="세금 담당자명">
                <b-form-input type="text" v-model="vModel.company_in_charge_name" required placeholder="세금 담당자명을 입력하세요." :state="companyChargeNameValidation"></b-form-input>
                <b-form-invalid-feedback :state="companyChargeNameValidation" class="text-left">
                  14자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="이메일">
                <b-form-input type="email" v-model="vModel.company_email" required placeholder="이메일을 입력하세요." :state="companyEmailValidation"></b-form-input>
                <b-form-invalid-feedback :state="companyEmailValidation" class="text-left">
                  100자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="통장 사본">
                <b-input-group>
                  <template v-if="vModel.bankName">
                    <b-form-input v-model="vModel.bankName" :title="vModel.bankName" disabled class="col-11" style="padding-right:3rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-10 position-absolute top left p-0" @click="fileDelete('bank')">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:0.7rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else><b-form-input disabled/></template>
                  <b-input-group-append>
                    <file-upload
                      class="btn btn-outline-secondary"
                      ref="bankFile"
                      v-model="bankFile"
                      name="bank_file"
                      input-id="bankFile"
                      :post-action="`/api/company/` + resultUsers.company_id + `/imgUpload`"
                      @input-filter="inputFilter">
                      업로드
                    </file-upload>
                  </b-input-group-append>
                </b-input-group>
                <template v-if="bankFile.length > 0">
                <template v-if="!bankFile[0].blob">
                  <img :src="'/storage/'+vModel.bankName" style="max-width: 520px;">
                </template>
                </template>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="사업자 등록증 사본">
                <b-input-group>
                  <template v-if="vModel.companyName">
                    <b-form-input v-model="vModel.companyName" :title="vModel.companyName" disabled class="col-11" style="padding-right:3rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-10 position-absolute top left p-0" @click="fileDelete('company')">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:0.7rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else><b-form-input disabled/></template>
                  <b-input-group-append>
                    <file-upload
                      class="btn btn-outline-secondary"
                      ref="companyFile"
                      v-model="companyFile"
                      name="company_file"
                      input-id="companyFile"
                      :post-action="`/api/company/` + resultUsers.company_id + `/imgUpload`"
                      @input-filter="inputFilter">
                      업로드
                    </file-upload>
                  </b-input-group-append>
                </b-input-group>
                <template v-if="companyFile.length > 0">
                <template v-if="!companyFile[0].blob">
                  <img :src="'/storage/'+vModel.companyName" style="max-width: 520px;">
                </template>
                </template>
              </b-form-group>
              <div class="mt-4 text-center">
                <template v-if="resultUsers.level == 1 && vModel.level == true">
                  <b-button class="mr-1" variant="success" @click="putLevelUpdate">승인</b-button>
                </template>
                <template v-else>
                  <b-button type="submit" class="mr-1" variant="primary">수정</b-button>
                </template>
                <b-button variant="light" @click="beforePage()">취소</b-button>
              </div>
            </b-form>
          </div>
          <div class="col-lg-6 float-left">
            <template v-if="resultUsers">
              <h6 class="mb-4">현재 보유 포인트:
                <span v-if="resultUsers.point_sum" class="font-weight-bold">{{numReplace(resultUsers.point_sum.point_sum)}}</span>
                <span v-else class="font-weight-bold">0</span>
                point
              </h6>
            </template>
            <div v-if="['ADMINISTRATOR'].includes(currentUser.role) && (resultUsers.role === 'AGENCY' || (resultUsers.role === 'ADVERTISER' && resultUsers.agent_id === null) ) ">
              <b-button v-b-modal.modalDeposit
                        variant="info default"
                        size="sm"
                        v-b-tooltip.html title="외부(팝커버) 광고 포인트를 <b>아인애드로 이동할 때</b>">
                포인트 입금(+)
              </b-button>
              <b-modal id="modalDeposit" ref="modalDeposit" title="포인트 입금(+)">
                <b-form @submit.prevent="" class="col-lg-12">
                  <b-form-group label-cols="3" label-cols-horizontal label="포인트">
                    <b-form-input @change="changePoint(vModel.pointDeposit)"
                                  v-model="vModel.pointDeposit.point" required placeholder="입금할 포인트 입력"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-cols-horizontal label="입금 사유">
                    <b-form-input type="text" v-model="vModel.pointDeposit.reason" required placeholder="입금 사유 입력"></b-form-input>
                  </b-form-group>
                </b-form>
                <template slot="modal-footer">
                  <b-button variant="primary" @click="submitModal('modalDeposit')" class="mr-1">적용</b-button>
                  <b-button variant="secondary" @click="hideModal('modalDeposit')">취소</b-button>
                </template>
              </b-modal>
              <b-button v-b-modal.modalWithdraw
                        variant="primary default"
                        size="sm"
                        v-b-tooltip.html title="아인애드 광고 포인트를 <b>외부(팝커버)로 이동할 때</b>">
                포인트 인출(-)
              </b-button>
              <b-modal id="modalWithdraw" ref="modalWithdraw" title="포인트 인출(-)">
                <b-form @submit.prevent="" class="col-lg-12">
                  <b-form-group label-cols="3" label-cols-horizontal label="포인트">
                    <b-form-input @change="changePoint(vModel.pointWithdraw)"
                                  v-model="vModel.pointWithdraw.point" required placeholder="인출할 포인트 입력"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="3" label-cols-horizontal label="인출 사유">

                    <b-form-input type="text" v-model="vModel.pointWithdraw.reason" required placeholder="인출 사유 입력"></b-form-input>
                  </b-form-group>
                </b-form>
                <template slot="modal-footer">
                  <b-button variant="primary" @click="submitModal('modalWithdraw')" class="mr-1">적용</b-button>
                  <b-button variant="secondary" @click="hideModal('modalWithdraw')">취소</b-button>
                </template>
              </b-modal>
            </div>
            <b-table class="text-center"
                     striped
                     bordered
                     show-empty
                     :items="resultPointHistory.data"
                     :fields="config.contactsField">
              <template slot="empty">
                포인트 이력이 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                {{ resultPointHistory.total - (resultPointHistory.per_page * (resultPointHistory.current_page - 1)) - data.index}}
              </template>
              <template slot="point" slot-scope="data">
              <span v-if="data.value > 0" style="color: royalblue;">
                {{numReplace(data.value)}}p
              </span>
              <span v-else-if="data.value < 0" style="color: orangered;">
                -{{numReplace(data.value)}}p
              </span>
              </template>
              <template slot="comment" slot-scope="data">
                {{data.value}}
              </template>
            </b-table>
            <b-pagination-nav
              size="sm"
              align="center"
              v-model="currentPage"
              :link-gen="linkGen"
              :number-of-pages="resultPointHistory.last_page">
            </b-pagination-nav>
          </div>
        </b-card>
        <div v-show="vModel.addressBox" @click="addressBox" class="position-fixed w-100 h-100" style="top:0;left:0;background:#00000075;z-index:9998">
        </div>
        <div v-show="vModel.addressBox" class="position-fixed" style="width:500px;top:20%;left:50%;margin-left:-250px;z-index:9999">
          <b-card>
            <DaumPostcode
              :on-complete=handleAddress
            />
          </b-card>
        </div>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import DaumPostcode from 'vuejs-daum-postcode'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    DaumPostcode,
    FileUpload
  },
  created () {
    this.getUserList()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        type: this.$route.params.type,
        user_session: JSON.parse(localStorage.getItem('user')),
        user: null,
        pointHistory: null,
        passwordEdit: null,
        levelUpdate: null,
        userUpdate: null
      },
      vModel: {
        reward: 0,
        name: '',
        email: '',
        password: '',
        mobile: '',
        company_name: '',
        company_number: '',
        account_bank: '',
        account_number: '',
        account_name: '',
        company_business: '',
        company_type: '',
        company_address: '',
        company_address2: '',
        company_address_disabled: true,
        addressBox: false,
        company_representation_name: '',
        company_in_charge_name: '',
        company_email: '',
        pwValidation: '',
        validation: '',
        level: false,
        bankName: '',
        companyName: '',
        pointWithdraw: {
          point: null,
          reason: '아인애드에서 팝커버 포인트로 이전(->)'
        },
        pointDeposit: {
          point: null,
          reason: '팝커버에서 아인애드 포인트로 이전(<-)'
        }
      },
      bankFile: [],
      companyFile: [],
      daumPostCode: '',
      currentPage: 1,
      config: {
        contactsField: {
          no: { label: 'No', sortable: true },
          created_at: { label: '날짜' },
          point: { label: '포인트', tdClass: 'table_num' },
          comment: { label: '내용' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(jpeg|jpg|png)$/i.test(newFile.name)) {
          this.$notify('error', '업로드 실패', '이미지 파일을 업로드하세요.')
          return prevent()
        } else {
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }

          // Thumbnails
          newFile.thumb = ''
          if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
            newFile.thumb = newFile.blob
          }
        }
      }
    },
    fileDelete (val) {
      if (val === 'bank') {
        this.vModel.bankName = ''
        this.bankFile = []
      } else {
        this.vModel.companyName = ''
        this.companyFile = []
      }
    },
    handleAddress: function (data) {
      let fullAddress = data.address
      let extraAddress = ''
      if (data.addressType === 'R') {
        if (data.bname !== '') {
          extraAddress += data.bname
        }
        if (data.buildingName !== '') {
          extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
        }
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
      }
      this.vModel.company_address = fullAddress
      this.daumPostCode = fullAddress
    },
    linkGen (pageNum) {
      return {
        name: 'memberEdit'
      }
    },
    getUserList: function () {
      this.xhttp({
        url: 'user/' + this.response.user_id + '/edit',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          if (response.data.data !== false) {
            let resp = response.data.data
            this.vModel.name = resp.name
            this.vModel.email = resp.email
            if (resp.mobile) {
              var mobile = resp.mobile
              this.vModel.mobile = mobile.replace(/-/g, '')
            }
            if (resp.company) {
              this.vModel.reward = resp.company.reward
              this.vModel.company_name = resp.company.name
              if (resp.company.bank) {
                let bank = resp.company.bank.split('|')
                this.vModel.account_bank = bank[0]
                this.vModel.account_number = bank[1].replace(/-/g, '')
                this.vModel.account_name = bank[2]
                this.vModel.bank = bank.join(' ')
              }
              if (resp.company.number) {
                this.vModel.company_number = resp.company.number.replace(/-/g, '')
              }
              this.vModel.company_business = resp.company.business
              this.vModel.company_type = resp.company.type
              this.vModel.company_address = resp.company.address
              this.vModel.company_address2 = resp.company.address2
              this.vModel.company_representation_name = resp.company.representation_name
              this.vModel.company_in_charge_name = resp.company.in_charge_name
              this.vModel.company_email = resp.company.email
              this.vModel.company_address_disabled = false
              if (resp.level === 1) {
                this.vModel.level = true
              }
              if (resp.company.bank_url) {
                let bank = (resp.company.bank_url).split('/')
                let bankName = bank[bank.length - 1]
                this.vModel.bankName = bankName
                this.bankFile[0] = { name: bankName }
              }
              if (resp.company.company_url) {
                let company = (resp.company.company_url).split('/')
                let companyName = company[company.length - 1]
                this.vModel.companyName = companyName
                this.companyFile[0] = { name: companyName }
              }
            }
            this.getPointHistory()
          }
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    getPointHistory: function () {
      let send = {
        page: this.currentPage
      }
      this.xhttp({
        url: '/point/' + this.response.user_id + '/pointHistory',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.pointHistory = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.pointHistory = error.response
        this.respError(error)
      })
    },
    passwordEditSubmit () {
      if (this.vModel.password.length > 5 && this.vModel.password.length < 255) {
        if (confirm('회원정보를 변경 하겠습니까?')) {
          this.putPasswordEdit()
        }
      } else {
        this.vModel.pwValidation = 'on'
      }
    },
    putPasswordEdit: function () {
      let send = {
        name: this.vModel.name,
        mobile: this.vModel.mobile,
        password: this.vModel.password
      }
      this.xhttp({
        url: 'user/' + this.response.user_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.passwordEdit = response.data
          this.$notify('primary', '회원정보 수정 완료', '회원정보 수정 완료되었습니다.')
          this.vModel.password = ''
          this.vModel.pwValidation = ''
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.passwordEdit = error.response
        this.respError(error)
      })
    },
    putLevelUpdate: function () {
      this.xhttp({
        url: 'user/' + this.response.user_id + '/levelUpdate',
        method: 'put',
        data: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.levelUpdate = response.data
          this.$notify('primary', '승인 완료', '승인 완료되었습니다.')
          this.getUserList()
        }
      }).catch((error) => {
        this.response.levelUpdate = error.response
        this.respError(error)
      })
    },
    userEditSubmit () {
      if (this.vModel.company_name.length < 100 &&
        this.vModel.company_number.replace(/-/g, '').length === 10 &&
        this.vModel.account_number.replace(/-/g, '').length > 10 &&
        this.vModel.account_number.replace(/-/g, '').length < 16 &&
        this.vModel.company_representation_name.length <= 14 &&
        (this.vModel.company_address.length + this.vModel.company_address2.length) <= 100 &&
        this.vModel.company_business.length <= 10 &&
        this.vModel.company_type.length <= 10 &&
        this.vModel.company_in_charge_name.length <= 14 &&
        this.vModel.company_email.length <= 100) {
        if (confirm('회원정보를 수정 하겠습니까?')) {
          this.putUsersEdit()
        }
      } else {
        this.vModel.validation = 'on'
      }
    },
    putUsersEdit: function () {
      this.$refs.bankFile.active = true
      this.$refs.companyFile.active = true
      let send = {
        reward: this.vModel.reward,
        name: this.vModel.company_name,
        number: this.vModel.company_number.replace(/-/g, ''),
        bank: this.vModel.account_bank + '|' + this.vModel.account_number + '|' + this.vModel.account_name,
        business: this.vModel.company_business,
        type: this.vModel.company_type,
        address: this.vModel.company_address,
        address2: this.vModel.company_address2,
        representation_name: this.vModel.company_representation_name,
        in_charge_name: this.vModel.company_in_charge_name,
        email: this.vModel.company_email
      }
      if (this.vModel.bankName === '') {
        send.bank_url = 'delete'
      }
      if (this.vModel.companyName === '') {
        send.company_url = 'delete'
      }
      this.xhttp({
        url: 'company/' + this.response.user.data.company.id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.userUpdate = response.data
          this.$notify('primary', '회원정보 수정 완료', '회원정보 수정 완료되었습니다.')
          this.getUserList()
          this.vModel.validation = ''
        }
      }).catch((error) => {
        this.response.userUpdate = error.response
        this.respError(error)
      })
    },
    addressSearch () {
      this.vModel.addressBox = true
    },
    addressBox () {
      this.vModel.addressBox = false
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    /**
     * 모달 숨기기
     * @param refname
     */
    hideModal (refname) {
      this.clearModel(refname)
      this.$refs[refname].hide()
    },
    clearModel (refname) {
      let ptTarget = null
      if (refname === 'modalWithdraw') {
        ptTarget = this.vModel.pointWithdraw
      } else if (refname === 'modalDeposit') {
        ptTarget = this.vModel.pointDeposit
      }
      ptTarget.point = null
      // ptTarget.reason = ''
    },
    /**
     * 모달 Submit
     * @param refname
     * @returns {boolean}
     */
    submitModal (refname) {
      let url = null
      let ptTarget = null
      if (refname === 'modalWithdraw') {
        url = '/pointTransfers/' + this.response.user_id + '/withdraws'
        ptTarget = this.vModel.pointWithdraw
      } else if (refname === 'modalDeposit') {
        url = '/pointTransfers/' + this.response.user_id + '/deposits'
        ptTarget = this.vModel.pointDeposit
      }

      // unformating
      ptTarget.point = this.toNumberOnly(ptTarget.point)

      if (parseInt(ptTarget.point) > 0 && ptTarget.reason.length > 2) {
        // OK
      } else {
        this.$notify('warn', '입력값 오류', '다시 확인해 주세요')
        return false
      }

      this.xhttp({
        url: url,
        method: 'put',
        data: ptTarget
      }).then((response) => {
        if (response.status === 200) {
          let item = response.data.data
          this.resultPointHistory.data.splice(0, 0, item)
          let newPoint = parseInt(this.resultUsers.point_sum.point_sum.replace(/,/g, ''))
          newPoint += item.point
          this.resultUsers.point_sum.point_sum = this.numReplace(newPoint)
          this.$Progress.finish()
        } else {
          this.$Progress.fail()
        }
      }).catch((error) => {
        if (error.response.status === 403) {
          this.$notify('error', '오류', error.response.data.messages.message)
        }
        this.$Progress.fail()
      }).finally(() => {
        this.clearModel(refname)
        this.$refs[refname].hide()
      })
    },
    changePoint (item) {
      item.point = this.toNumberFormat(this.toNumberOnly(item.point))
    },
    /**
     * 숫자 값 콤마 포멧팅
     * @param value
     * @returns {string|number}
     */
    toNumberFormat (value) {
      let num = parseFloat(value)
      if (isNaN(num) || num === 0) {
        return
      }

      let reg = /(^[+-]?\d+)(\d{3})/
      let n = (num + '')

      while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2')
      }

      return n
    },
    /**
     * 포멧팅된 숫자 값에서 숫자값만 반환
     */
    toNumberOnly (value, type = 'int') {
      let newValue = value.toString().replace(/,/g, '')
      if (type === 'int') {
        newValue = parseInt(newValue)
      }
      return newValue
    },
    toFormatNumber (n) {
      // format number 1000000 to 1,234,567
      n = n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return null
    },
    beforePage () {
      this.$router.go(-1)
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
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    }),
    resultUsers () {
      if (this.response.user && this.response.user.success === true && this.response.user.data) {
        return this.response.user.data
      } else {
        return false
      }
    },
    resultPointHistory () {
      if (this.response.pointHistory && this.response.pointHistory.success === true && this.response.pointHistory.data) {
        return this.response.pointHistory.data
      } else {
        return false
      }
    },
    passwordValidation () {
      if (this.vModel.pwValidation === 'on') {
        return this.vModel.password.length > 5 && this.vModel.password.length < 255
      } else {
        return ''
      }
    },
    mobileValidation () {
      if (this.vModel.pwValidation === 'on') {
        return this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12
      } else {
        return ''
      }
    },
    companyRewardValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.reward < 100
      } else {
        return ''
      }
    },
    companyNameValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_name.length < 100
      } else {
        return ''
      }
    },
    companyBusinessValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_business.length < 10
      } else {
        return ''
      }
    },
    numberValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_number.replace(/-/g, '').length === 10
      } else {
        return ''
      }
    },
    accountValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.account_number.replace(/-/g, '').length > 10 && this.vModel.account_number.replace(/-/g, '').length < 16
      } else {
        return ''
      }
    },
    representationValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_representation_name.length <= 14
      } else {
        return ''
      }
    },
    companyTypeValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_type.length < 10
      } else {
        return ''
      }
    },
    companyAddressValidation () {
      if (this.vModel.validation === 'on') {
        return (this.vModel.company_address.length + this.vModel.company_address2.length) < 100
      } else {
        return ''
      }
    },
    companyChargeNameValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_in_charge_name.length < 14
      } else {
        return ''
      }
    },
    companyEmailValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.company_email.length < 100
      } else {
        return ''
      }
    }
  },
  watch: {
    currentPage: function () {
      this.getPointHistory()
    },
    daumPostCode: function () {
      this.vModel.addressBox = false
      this.vModel.company_address_disabled = false
    },
    bankFile: function (val) {
      if (val[0]) {
        this.vModel.bankName = val[0].name
      }
    },
    companyFile: function (val) {
      if (val[0]) {
        this.vModel.companyName = val[0].name
      }
    }
  }
}
</script>
