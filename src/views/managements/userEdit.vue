<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="response.name == 'manager'">
          <piaf-breadcrumb heading="영업 매니저 정보 수정"/>
        </template>
        <template v-else-if="response.name == 'advertiser'">
          <piaf-breadcrumb heading="광고주 정보 수정"/>
        </template>
        <template v-else>
          <piaf-breadcrumb heading="내 정보 수정"/>
        </template>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
          <div class="col-lg-6">
            <h2 class="mb-4">일반 정보</h2>
            <b-form @submit.prevent="passwordEditSubmit">
              <template v-if="['AGENCY', 'ADVERTISER'].includes(response.user_session.role)">
              <b-form-group label-cols="3" label-cols-horizontal label="전용 가상계좌 번호">
                <b-form-input type="text" v-model="vModel.account" class="col-lg-12" disabled></b-form-input>
              </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="회사명">
                <b-form-input type="text" v-model="vModel.company_name" class="col-lg-12" disabled></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="담당자명">
                <b-form-input type="text" v-model="vModel.name" class="col-lg-12" required></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="담당자 E-mail">
                <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY'].includes(response.user_session.role)">
                  <b-form-input type="email" v-model="vModel.company_email" required placeholder="담당자 E-mail을 입력하세요." class="col-lg-12" @blur="emailCheck"></b-form-input>
                  <p class="text-left" :style="style">이미 사용중인 이메일입니다.</p>
                </template>
                <template v-else>
                  <b-form-input type="email" v-model="vModel.company_email" class="col-lg-12" disabled></b-form-input>
                </template>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="비밀번호">
                <b-form-input type="password" v-model="vModel.password" class="col-lg-12" placeholder="비밀번호를 입력하세요." :state="passwordValidation"></b-form-input>
                <b-form-invalid-feedback :state="passwordValidation" class="text-left">
                  비밀번호를 6자 이상 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="비밀번호 확인">
                <b-form-input type="password" v-model="vModel.passwordConfirm" :state="passwordConfirmValidation" placeholder="비밀번호 확인을 입력하세요."></b-form-input>
                <b-form-invalid-feedback :state="passwordConfirmValidation" class="text-left">
                  동일한 비밀번호를 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group inline label-cols="3" label-cols-horizontal label="휴대폰 번호">
                <b-input-group>
                  <b-form-input type="number" v-model="vModel.mobile" class="col-lg-10" placeholder="하이픈(-)을 제외한 휴대폰 번호를 입력하세요." :disabled="vModel.mobileChk1"></b-form-input>
                  <b-input-group-append>
                    <template v-if="vModel.mobileChk1">
                      <b-button variant="outline-secondary" @click="reAuthMobile">재인증</b-button>
                    </template>
                    <template v-else>
                      <b-button variant="outline-secondary" @click="authMobile">휴대폰 인증</b-button>
                    </template>
                  </b-input-group-append>
                </b-input-group>
                <div class="mt-2" v-if="vModel.mobileChk2">
                  <b-form-input type="number" v-model="vModel.mobileConfirm" class="d-inline-block col-lg-5" placeholder="인증번호를 입력하세요." :state="mobileValidation"></b-form-input>
                  <b-button class="d-inline-block btn default btn-light btn-md ml-2" @click="confirmMobile">확인</b-button>
                </div>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="공지, 이벤트 등 알림 수신">
                <b-form-checkbox v-model="vModel.email_yn" value="1" class="mt-1 mr-3 d-inline-block">
                  메일
                </b-form-checkbox>
                <b-form-checkbox v-model="vModel.mobile_yn" value="1" class="mt-1 d-inline-block">
                  SMS
                </b-form-checkbox>
              </b-form-group>
              <div class="text-center mt-4">
                <b-button type="submit" variant="info">수정</b-button>
                <template v-if="['manager', 'advertiser'].includes(response.name)">
                <b-button type="button" variant="light" @click="userEditBack()" class="ml-2">취소</b-button>
                </template>
              </div>
            </b-form>
          </div>
        </b-card>
        <b-card>
          <div class="col-lg-6">
            <h2 class="mb-4">사업자 정보</h2>
            <template v-if="response.user_session.level === 1">
            <template v-if="['AGENCY', 'ADVERTISER', 'PUBLISHER'].includes(response.user_session.role)">
            <b-alert show variant="primary" class="mb-4">* 세금계산서 발행을 위해서는 반드시 입력해 주세요.</b-alert>
            <b-form @submit.prevent="companyEditSubmit">
              <b-form-group label-cols="3" label-cols-horizontal label="사업자 등록번호">
                <b-form-input type="number" onwheel="this.blur()" required v-model="vModel.number" ref="number" :state="numberValidation" placeholder="하이픈(-)을 제외한 숫자 10자리를 입력하세요."></b-form-input>
                <b-form-invalid-feedback :state="numberValidation" class="text-left">
                  하이픈(-)을 제외한 숫자 10자리를 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <template v-if="['AGENCY', 'ADVERTISER'].includes(response.user_session.role)">
              <b-form-group label-cols="3" label-cols-horizontal label="환불 계좌 정보">
                <b-input-group>
                  <b-form-input type="text" v-model="vModel.account_bank" class="col-lg-3 float-left" :state="accountValidation" placeholder="은행명" required></b-form-input>
                  <b-form-input type="number" onwheel="this.blur()" v-model="vModel.account_number" class="col-lg-6 float-left" :state="accountValidation" placeholder="계좌 번호" required>
                  </b-form-input>
                  <b-form-input type="text" v-model="vModel.account_name" class="col-lg-3 float-left" :state="accountValidation" placeholder="예금주 명" required></b-form-input>
                </b-input-group>
                <b-form-invalid-feedback :state="accountValidation" style="margin-top:50px">
                  환불 계좌 정보를 정확하게 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="대표자명">
                <b-form-input type="text" required v-model="vModel.representation_name" placeholder="대표자명을 입력하세요." :state="representationValidation"></b-form-input>
                <b-form-invalid-feedback :state="representationValidation" class="text-left">
                  14자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="주소지">
                <b-input-group>
                  <b-form-input type="text" required v-model="vModel.address" placeholder="주소지를 검색하세요." @click="addressSearch" @keyup="addressSearch"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="outline-secondary" @click="addressSearch">검색</b-button>
                  </b-input-group-append>
                </b-input-group>
                <b-form-input type="text" required v-model="vModel.address2" placeholder="추가 주소지를 입력하세요." class="d-inline-block mt-2" :disabled="vModel.addressDisabled" :state="addressValidation"></b-form-input>
                <b-form-invalid-feedback :state="addressValidation" class="text-left">
                  100자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="업종">
                <b-form-input type="text" required v-model="vModel.type" placeholder="업종을 입력하세요." :state="typeValidation"></b-form-input>
                <b-form-invalid-feedback :state="typeValidation" class="text-left">
                  10자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="업태">
                <b-form-input type="text" required v-model="vModel.business" placeholder="업태를 입력하세요." :state="businessValidation"></b-form-input>
                <b-form-invalid-feedback :state="businessValidation" class="text-left">
                  10자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="세금 담당자명">
                <b-form-input type="text" required v-model="vModel.in_charge_name" placeholder="세금 담당자명을 입력하세요." :state="inChargeNameValidation"></b-form-input>
                <b-form-invalid-feedback :state="inChargeNameValidation" class="text-left">
                  14자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="E-mail">
                <b-form-input type="email" required v-model="vModel.email" placeholder="E-mail을 입력하세요." :state="emailValidation"></b-form-input>
                <b-form-invalid-feedback :state="emailValidation" class="text-left">
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
              <div class="text-center mt-4">
                <b-button type="submit" variant="primary">저장</b-button>
                <template v-if="['manager', 'advertiser'].includes(response.name)">
                  <b-button type="button" variant="light" @click="userEditBack()" class="ml-2">취소</b-button>
                </template>
              </div>
            </b-form>
            </template>
            </template>
            <template v-else>
              <b-form-group label-cols="3" label-cols-horizontal label="사업자 등록번호">
                <b-form-input type="text" disabled v-model="vModel.number"></b-form-input>
              </b-form-group>
              <template v-if="['AGENCY', 'ADVERTISER'].includes(response.user_session.role)">
              <b-form-group label-cols="3" label-cols-horizontal label="환불 계좌 정보">
                <b-form-input type="text" disabled v-model="vModel.bank"></b-form-input>
              </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="대표자명">
                <b-form-input type="text" disabled v-model="vModel.representation_name"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="주소지">
                <b-form-input type="text" disabled v-model="vModel.address"></b-form-input>
                <b-form-input type="text" disabled v-model="vModel.address2" class="mt-2"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="업종">
                <b-form-input type="text" disabled v-model="vModel.type"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="업태">
                <b-form-input type="text" disabled v-model="vModel.business"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="세금 담당자명">
                <b-form-input type="text" disabled v-model="vModel.in_charge_name"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="E-mail">
                <b-form-input type="email" disabled v-model="vModel.email"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="통장 사본">
                <template v-if="vModel.bankName">
                  <b-form-input type="text" disabled v-model="vModel.bankName" :title="vModel.bankName"></b-form-input>
                  <img :src="'/storage/'+vModel.bankName" style="max-width: 520px;">
                </template>
                <template v-else>
                  <b-form-input type="text" disabled></b-form-input>
                </template>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="사업자 등록증 사본">
                <template v-if="vModel.companyName">
                  <b-form-input type="text" disabled v-model="vModel.companyName" :title="vModel.companyName"></b-form-input>
                  <img :src="'/storage/'+vModel.companyName" style="max-width: 520px;">
                </template>
                <template v-else>
                  <b-form-input type="text" disabled></b-form-input>
                </template>
              </b-form-group>
            </template>
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
import { mapActions } from 'vuex'
import DaumPostcode from 'vuejs-daum-postcode'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    DaumPostcode,
    FileUpload
  },
  created () {
    this.userDataRole()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        name: this.$route.path.split('/')[2],
        user: null
      },
      vModel: {
        account: '',
        company_name: '',
        name: '',
        company_email: '',
        password: '',
        passwordConfirm: '',
        mobile: null,
        mobile_chk: 0,
        mobileChk1: false,
        mobileChk2: false,
        mobileConfirm: '',
        mobileValidation: '',
        email_yn: false,
        mobile_yn: false,
        validation: '',
        number: null,
        account_bank: null,
        account_number: null,
        account_name: null,
        representation_name: '',
        bank: null,
        address: '',
        address2: '',
        addressDisabled: true,
        addressBox: false,
        type: '',
        business: '',
        in_charge_name: '',
        email: '',
        accountValidation: '',
        companyValidation: '',
        bankName: '',
        companyName: ''
      },
      bankFile: [],
      companyFile: [],
      daumPostCode: '',
      style: {
        display: 'none',
        marginTop: '.25rem',
        marginBottom: '0',
        fontSize: '80%',
        color: '#dc3545'
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
      this.vModel.address = fullAddress
      this.daumPostCode = fullAddress
    },
    userDataRole () {
      this.response.spinner = true
      if (this.response.name === 'manager') {
        this.getUsersEdit(this.response.user_id)
      } else if (this.response.name === 'advertiser') {
        this.getUsersEdit(this.response.user_id)
      } else {
        this.getUsersEdit(this.response.user_session.id)
      }
    },
    getUsersEdit: function (id) {
      this.xhttp({
        url: 'user/' + id + '/edit',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          if (response.data.data !== false) {
            let user = response.data.data
            if (user.account) {
              this.vModel.account = '국민은행 ' + user.account + ' 에이플에이디'
            }
            this.vModel.company_name = user.company.name
            this.vModel.name = user.name
            this.vModel.company_email = user.email
            if (user.mobile) {
              var mobile = user.mobile
              this.vModel.mobile = mobile.replace(/-/g, '')
            }
            this.vModel.mobile_yn = user.mobile_yn
            this.vModel.email_yn = user.email_yn
            if (user.mobile_chk === 1) {
              this.vModel.mobileChk1 = true
              this.vModel.mobile_chk = 1
            }
            if (user.company.number) {
              var number = user.company.number
              if (this.response.user_session.level === 1) {
                number = number.replace(/-/g, '')
              }
              this.vModel.number = number
              if (user.company.bank) {
                let bank = user.company.bank.split('|')
                this.vModel.account_bank = bank[0]
                this.vModel.account_number = bank[1].replace(/-/g, '')
                this.vModel.account_name = bank[2]
                this.vModel.bank = bank.join(' ')
              }
              this.vModel.representation_name = user.company.representation_name
              this.vModel.address = user.company.address
              this.vModel.address2 = user.company.address2
              this.vModel.type = user.company.type
              this.vModel.business = user.company.business
              this.vModel.in_charge_name = user.company.in_charge_name
              this.vModel.email = user.company.email
              this.vModel.addressDisabled = false
              if (user.company.bank_url) {
                let bank = (user.company.bank_url).split('/')
                let bankName = bank[bank.length - 1]
                this.vModel.bankName = bankName
                this.bankFile[0] = { name: bankName }
              }
              if (user.company.company_url) {
                let company = (user.company.company_url).split('/')
                let companyName = company[company.length - 1]
                this.vModel.companyName = companyName
                this.companyFile[0] = { name: companyName }
              }
            }
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    passwordEditSubmit () {
      if (this.vModel.password === '' && (this.vModel.mobile === null || this.vModel.mobile === '')) {
        if (this.vModel.name) {
          this.putUsersEdit()
        } else {
          this.$notify('error', '수정 실패', '수정 할 정보를 입력하세요.')
        }
      } else {
        this.vModel.validation = 'on'
        if (this.vModel.password) {
          if (this.vModel.password && this.vModel.password.length > 5 && this.vModel.password.length < 255 && this.vModel.password === this.vModel.passwordConfirm) {
            if (this.vModel.mobile) {
              if (this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12) {
                this.putUsersEdit()
              }
            } else {
              this.putUsersEdit()
            }
          }
        } else if (this.vModel.mobile) {
          if (this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12) {
            if (this.vModel.password) {
              if (this.vModel.password.length > 5 && this.vModel.password.length < 255 && this.vModel.password === this.vModel.passwordConfirm) {
                this.putUsersEdit()
              }
            } else {
              this.putUsersEdit()
            }
          }
        }
      }
    },
    companyEditSubmit () {
      if (this.vModel.number.length === 10 &&
        this.vModel.account_number.length > 10 &&
        this.vModel.account_number.length < 16 &&
        this.vModel.representation_name.length <= 14 &&
        (this.vModel.address.length + this.vModel.address2.length) <= 100 &&
        this.vModel.type.length <= 10 &&
        this.vModel.business.length <= 10 &&
        this.vModel.in_charge_name.length <= 14 &&
        this.vModel.email.length <= 100) {
        if (confirm('회원정보를 수정 하겠습니까?')) {
          this.putCompanyEdit()
        }
      } else {
        this.vModel.companyValidation = 'on'
        this.vModel.accountValidation = 'on'
      }
    },
    putUsersEdit: function () {
      this.response.spinner = true
      let id = ''
      if (['manager', 'advertiser'].includes(this.response.name)) {
        id = this.response.user_id
      } else {
        id = this.response.user_session.id
      }
      let send = {
        name: this.vModel.name,
        mobile_chk: this.vModel.mobile_chk
      }
      if (this.vModel.email_yn === '1') {
        send.email_yn = this.vModel.email_yn
      }
      if (this.vModel.mobile_yn === '1') {
        send.mobile_yn = this.vModel.mobile_yn
      }
      if (this.vModel.password) {
        send.password = this.vModel.password
      }
      if (this.vModel.mobile) {
        send.mobile = this.vModel.mobile
      }
      if (['ADMINISTRATOR', 'MANAGER', 'AGENCY'].includes(this.response.user_session.role)) {
        send.email = this.vModel.company_email
      }
      this.xhttp({
        url: 'user/' + id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.userEdit = response.data
          this.respSuccess()
          this.vModel.validation = ''
          this.$notify('primary', '수정 완료', '수정 완료되었습니다.')
        }
      }).catch((error) => {
        this.response.userEdit = error.response
        this.respError(error)
      })
    },
    putCompanyEdit: function () {
      this.$refs.bankFile.active = true
      this.$refs.companyFile.active = true
      let send = {
        number: this.vModel.number,
        bank: this.vModel.account_bank + '|' + this.vModel.account_number + '|' + this.vModel.account_name,
        business: this.vModel.business,
        type: this.vModel.type,
        address: this.vModel.address,
        address2: this.vModel.address2,
        representation_name: this.vModel.representation_name,
        in_charge_name: this.vModel.in_charge_name,
        email: this.vModel.email
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
          this.response.userEdit = response.data
          this.userDataRole()
          this.vModel.companyValidation = ''
          this.vModel.accountValidation = ''
          this.$notify('primary', '수정 완료', '수정 완료되었습니다.')
        }
      }).catch((error) => {
        this.response.userEdit = error.response
        this.respError(error)
      })
    },
    userEditBack () {
      this.$router.go(-1)
    },
    addressSearch () {
      this.vModel.addressBox = true
    },
    addressBox () {
      this.vModel.addressBox = false
    },
    authMobile: function () { // 휴대폰 인증
      this.response.spinner = true
      if (!this.vModel.mobile || this.vModel.mobile.length < 10 || this.vModel.mobile.length > 11) {
        this.$notify('error', '오류', '휴대폰 번호를 정확히 입력해 주세요.')
      } else {
        let send = {
          mobile: this.vModel.mobile
        }
        this.xhttp({
          url: 'user/authMobile',
          method: 'post',
          data: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.userEdit = response.data
            this.vModel.mobileChk1 = true
            this.vModel.mobileChk2 = true
            this.respSuccess()
            this.$notify('primary', '인증번호 전송완료', '휴대폰 인증번호가 전송되었습니다.')
          }
        }).catch((error) => {
          this.response.userEdit = error.response
          this.respError(error)
        })
      }
    },
    confirmMobile () {
      if (this.vModel.mobileConfirm) {
        this.vModel.mobileChk2 = false
        this.vModel.mobile_chk = 1
      } else {
        this.vModel.mobileValidation = 'on'
      }
    },
    reAuthMobile () {
      this.vModel.mobileChk1 = false
      this.vModel.mobileChk2 = false
      this.vModel.mobile_chk = 0
      this.vModel.mobile = ''
      this.vModel.mobileConfirm = ''
    },
    emailCheck () {
      let send = {
        email: this.vModel.company_email
      }
      if (send.email) {
        this.xhttp({
          url: 'user/email',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            if (response.data.data === true) {
              this.style.display = 'block'
            } else {
              this.style.display = 'none'
            }
          }
          this.respSuccess()
        }).catch((error) => {
          this.response.emailResponse = error.response
          this.respError(error)
        })
      }
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      let message = error.response.data.messages.message
      if (message) {
        this.$notify('error', '오류', message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    }
  },
  watch: {
    daumPostCode: function () {
      this.vModel.addressBox = false
      this.vModel.addressDisabled = false
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
  },
  computed: {
    resultUsers () {
      if (this.response.user && this.response.user.success === true && this.response.user.data) {
        return this.response.user.data
      } else {
        return false
      }
    },
    passwordValidation () {
      if (this.vModel.validation === 'on' && this.vModel.password) {
        return this.vModel.password.length > 5 && this.vModel.password.length < 255
      } else {
        return ''
      }
    },
    passwordConfirmValidation () {
      if (this.vModel.validation === 'on' && this.vModel.password) {
        return this.vModel.password === this.vModel.passwordConfirm
      } else {
        return ''
      }
    },
    mobileValidation () {
      if (this.vModel.mobileValidation === 'on') {
        return this.vModel.mobileConfirm.length > 0
      } else {
        return ''
      }
    },
    numberValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.number.length === 10
      } else {
        return ''
      }
    },
    accountValidation () {
      if (this.vModel.accountValidation === 'on') {
        return this.vModel.account_number.length > 10 && this.vModel.account_number.length < 16
      } else {
        return ''
      }
    },
    representationValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.representation_name.length <= 14
      } else {
        return ''
      }
    },
    addressValidation () {
      if (this.vModel.companyValidation === 'on') {
        return (this.vModel.address.length + this.vModel.address2.length) <= 100
      } else {
        return ''
      }
    },
    typeValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.type.length <= 10
      } else {
        return ''
      }
    },
    businessValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.business.length <= 10
      } else {
        return ''
      }
    },
    inChargeNameValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.in_charge_name.length <= 14
      } else {
        return ''
      }
    },
    emailValidation () {
      if (this.vModel.companyValidation === 'on') {
        return this.vModel.email.length <= 100
      } else {
        return ''
      }
    }
  }
}
</script>
