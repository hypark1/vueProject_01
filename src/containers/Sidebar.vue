<template>
  <div class="sidebar" @mouseenter="isMenuOver=true" @mouseleave="isMenuOver=false" @touchstart="isMenuOver=true">
    <div class="main-menu">
      <vue-perfect-scrollbar class="scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }">
        <ul class="list-unstyled">
          <template v-if="roleMenuDom(menuRole.dashboard)">
            <li :class="{ active : selectedParentMenu==='dashboard' }"><a
              @click.prevent="openSubMenu($event,'dashboard')" href="#dashboard"><i class="iconsminds-file-clipboard-file---text"></i>대시보드</a></li>
          </template>
          <template v-if="roleMenuDom(menuRole.managements)">
            <li :class="{ active : selectedParentMenu==='managements' }"><a
              @click.prevent="openSubMenu($event,'managements')" href="#managements"><i class="iconsminds-id-card"></i>회원 관리</a></li>
          </template>
          <template v-if="roleMenuDom(menuRole.points)">
            <li :class="{ active : selectedParentMenu==='points' }"><a
              @click.prevent="openSubMenu($event,'points')" href="#points"><i class="iconsminds-money-bag"></i>포인트 관리</a></li>
          </template>
          <template v-if="roleMenuDom(menuRole.advertisements)">
            <li :class="{ active : selectedParentMenu==='advertisements' }"><a
              @click.prevent="openSubMenu($event,'advertisements')" href="#advertisements"><i class="iconsminds-scooter"></i>{{
              $t('menu.advertisements') }}</a></li>
          </template>
          <template v-if="roleMenuDom(menuRole.media)">
            <li :class="{ active : selectedParentMenu==='media' }"><a
              @click.prevent="openSubMenu($event,'media')" href="#media"><i class="iconsminds-green-house"></i>미디어</a></li>
          </template>
          <template v-if="roleMenuDom(menuRole.reports)">
            <li :class="{ active : selectedParentMenu==='reports' }"><a
              @click.prevent="openSubMenu($event,'reports')" href="#reports"><i class="iconsminds-file-clipboard-file---text"></i>보고서</a></li>
          </template>
          <li :class="{ active : selectedParentMenu==='customer' }"><a
            @click.prevent="openSubMenu($event,'customer')" href="#customer"><i class="iconsminds-business-man-woman"></i>{{
            $t('menu.customer') }}</a></li>
          <template v-if="roleMenuDom(menuRole.members)">
          <li :class="{ active : selectedParentMenu==='members' }"><a
            @click.prevent="openSubMenu($event,'members')" href="#members"><i class="iconsminds-gear"></i>관리자 페이지</a></li>
          </template>
        </ul>
      </vue-perfect-scrollbar>
    </div>

    <div class="sub-menu">
      <vue-perfect-scrollbar class="scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }">

        <ul class="list-unstyled" data-link="dashboard" :class="{'d-block':selectedParentMenu==='dashboard' }">
          <template v-if="roleMenuDom(menuRole.dashboard_adminOrManager)">
            <router-link tag="li" :to="({ name: 'adminDashboard' })">
              <a><i class="simple-icon-support"></i>대시보드</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.dashboard_advertiser)">
          <router-link tag="li" :to="({ name: 'adDashboard' })">
            <a><i class="simple-icon-support"></i>대시보드</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.dashboard_publisher)">
          <router-link tag="li" :to="({ name: 'pubDashboard' })">
            <a><i class="simple-icon-support"></i>대시보드</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.dashboard_agency)">
            <router-link tag="li" :to="({ name: 'agencyDashboard' })">
              <a><i class="simple-icon-support"></i>대시보드</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.dashboard_agent)">
            <router-link tag="li" :to="({ name: 'agentDashboard' })">
              <a><i class="simple-icon-support"></i>대시보드</a>
            </router-link>
          </template>
        </ul>
        <ul class="list-unstyled" data-link="customer" :class="{'d-block':selectedParentMenu==='customer' }">
          <router-link tag="li" :to="({ name: 'contactsIndex', query: { page: 1 } })">
            <a><i class="simple-icon-earphones-alt"></i>{{$t('menu.contacts') }}</a>
          </router-link>
          <router-link tag="li" :to="({ name: 'guestIndex' })">
            <a><i class="simple-icon-earphones-alt"></i>비회원 문의</a>
          </router-link>
        </ul>
        <ul class="list-unstyled" data-link="advertisements" :class="{'d-block':selectedParentMenu==='advertisements' }">
          <template v-if="roleMenuDom(menuRole.advertisements)">
          <router-link tag="li" to="/advertisements/me/orders">
            <a><i class="simple-icon-notebook"></i>{{$t('menu.advertisements')}}</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.adBuilder)">
            <router-link tag="li" :to="({ name: 'adBuilderHome' })">
              <a><i class="simple-icon-notebook"></i>Rich Media 소재 생성</a>
            </router-link>
            <router-link tag="li" :to="({ name: 'adBuilderIndex' })">
              <a><i class="simple-icon-notebook"></i>Rich Media 소재 목록</a>
            </router-link>
          </template>
        </ul>
        <ul class="list-unstyled" data-link="media" :class="{'d-block':selectedParentMenu==='media' }">
          <template v-if="roleMenuDom(menuRole.media_admin)">
            <router-link tag="li" :to="({ name: 'Publishers', query: { page: 1 } })"><a><i class="
simple-icon-puzzle"></i> 업체관리</a></router-link>
            <router-link tag="li" :to="({ name: 'SiteIndexList' })"><a><i class="
simple-icon-puzzle"></i> 사이트관리</a></router-link>
            <router-link tag="li" :to="({ name: 'ContentControl' })"><a><i class="
simple-icon-puzzle"></i> 컨텐츠 관리</a></router-link>
            <router-link tag="li" :to="({ name: 'PressConnectionReport' })"><a><i class="
simple-icon-puzzle"></i> 매체 유입 보고서</a></router-link>
            <!--
            <router-link tag="li" :to="({ name: 'Category' })"><a><i class="
simple-icon-puzzle"></i> 컨텐츠 카테고리 관리</a></router-link>
            <router-link tag="li" :to="({ name: 'CategoryValidation' })"><a><i class="
simple-icon-puzzle"></i> 컨텐츠 카테고리 검증</a></router-link>
            <router-link tag="li" :to="({ name: 'Contents' })"><a><i class="
simple-icon-puzzle"></i> 분류 완료 컨텐츠</a></router-link>
-->
            <router-link tag="li" :to="({ name: 'Keywords' })"><a><i class="
simple-icon-puzzle"></i> 키워드 관리</a></router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.media_publishers)">
          <router-link tag="li" :to="({ name: 'SiteIndexPublisher' })"><a><i class="simple-icon-puzzle"></i> 사이트관리</a></router-link>
          </template>
        </ul>
        <ul class="list-unstyled" data-link="members" :class="{'d-block':selectedParentMenu==='members' }">
          <router-link tag="li" :to="({ name: 'memberIndex', query: { page: 1 } })"><a><i class="simple-icon-social-reddit"></i> 회원 관리</a></router-link>
        </ul>
        <ul class="list-unstyled" data-link="managements" :class="{'d-block':selectedParentMenu==='managements' }">
          <template v-if="roleMenuDom(menuRole.managements_userEdit)">
          <router-link tag="li" :to="({ name: 'userEdit' })">
            <a><i class="simple-icon-social-reddit"></i> 내 정보 수정</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.managements_manager)">
          <router-link tag="li" :to="({ name: 'managerIndex', query: { page: 1 } })">
            <a><i class="simple-icon-social-reddit"></i> 영업 매니저 관리</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.managements_advertiser)">
          <router-link tag="li" :to="({ name: 'advertiserIndex', query: { page: 1 } })">
            <a><i class="simple-icon-social-reddit"></i> 광고주 관리</a>
          </router-link>
          </template>
        </ul>
        <ul class="list-unstyled" data-link="points" :class="{'d-block':selectedParentMenu==='points' }">
          <template v-if="roleMenuDom(menuRole.points_refund)">
          <router-link tag="li" :to="({ name: 'pointCharge' })">
            <a><i class="simple-icon-magic-wand"></i>포인트 충전</a>
          </router-link>
          <router-link tag="li" :to="({ name: 'pointRefund' })">
            <a><i class="simple-icon-rocket"></i>포인트 환불요청</a>
          </router-link>
          <router-link tag="li" :to="({ name: 'pointHistory', query: { page: 1 } })">
            <a><i class="simple-icon-paper-plane"></i>포인트 이력</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.points_refundIndex)">
          <router-link tag="li" :to="({ name: 'pointRefundIndex', query: { page: 1 } })">
            <a><i class="simple-icon-paper-plane"></i>포인트 환불요청</a>
          </router-link>
          <router-link tag="li" :to="({ name: 'pointRefundHistory', query: { page: 1 } })">
            <a><i class="simple-icon-paper-plane"></i>포인트 환불이력</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.points_delivery)">
            <router-link tag="li" :to="({ name: 'pointDelivery' })">
              <a><i class="simple-icon-magic-wand"></i>포인트 전달</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.points_accountHistory)">
            <router-link tag="li" :to="({ name: 'accountHistory' })">
              <a><i class="simple-icon-magic-wand"></i>가상계좌 충전 이력</a>
            </router-link>
          </template>
        </ul>
        <ul class="list-unstyled" data-link="reports" :class="{'d-block':selectedParentMenu==='reports' }">
          <template v-if="roleMenuDom(menuRole.reports_publisher)">
          <router-link tag="li" :to="({ name: 'reportPublisherPeriod', query: { type: 1, start: datePickerRange.start, end: datePickerRange.end } })">
            <a><i class="simple-icon-support"></i>매체사 리포트</a>
          </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.reports_agency)">
            <router-link tag="li" :to="({ name: 'reportAgencyIndex', query: { page: 1 } })">
              <a><i class="simple-icon-support"></i>대행사별 보고서</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.reports_agent)">
            <router-link tag="li" :to="({ name: 'reportAgentIndex', query: { page: 1 } })">
              <a><i class="simple-icon-support"></i>영업자별 보고서</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.reports_advertiser)">
            <router-link tag="li" :to="({ name: 'reportAdvertiserIndex', query: { page: 1 } })">
              <a><i class="simple-icon-support"></i>광고주별 보고서</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.reports_campaign)">
            <router-link tag="li" :to="({ name: 'reportCampaignIndex', query: { page: 1 } })">
              <a><i class="simple-icon-support"></i>캠페인별 보고서</a>
            </router-link>
          </template>
          <template v-if="roleMenuDom(menuRole.reports_creative)">
            <router-link tag="li" :to="({ name: 'reportCreativeIndex', query: { page: 1, max: 10, start: datePickerRange.start, end: datePickerRange.end } })">
              <a><i class="simple-icon-support"></i>광고주 영업 현황</a>
            </router-link>
          </template>
        </ul>
      </vue-perfect-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { menuHiddenBreakpoint, subHiddenBreakpoint } from '@/constants/config'

export default {
  data () {
    return {
      selectedParentMenu: '',
      isMenuOver: false,
      user_session: JSON.parse(localStorage.getItem('user')),
      datePickerRange: {
        start: this.$moment(new Date()).add(-6, 'days').format('YYYY-MM-DD'),
        end: this.$moment(new Date()).add('days').format('YYYY-MM-DD')
      },
      menuRole: {
        advertisements: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT', 'ADVERTISER'], // 광고
        media: ['ADMINISTRATOR', 'MANAGER', 'PUBLISHER'], // 미디어
        media_admin: ['ADMINISTRATOR', 'MANAGER'], // 미디어 - 관리자
        media_publishers: ['PUBLISHER'], // 미디어 - 매체사
        members: ['ADMINISTRATOR', 'MANAGER'], // 관리자 페이지
        managements: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT', 'PUBLISHER', 'ADVERTISER'], // 관리
        managements_userEdit: ['AGENCY', 'AGENT', 'PUBLISHER', 'ADVERTISER'], // 관리 - 내정보수정
        managements_manager: ['ADMINISTRATOR', 'MANAGER', 'AGENCY'], // 관리 - 영업 매니저 관리
        managements_advertiser: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT'], // 관리 - 광고주 관리
        points: ['AGENCY', 'AGENT', 'ADVERTISER', 'ADMINISTRATOR', 'MANAGER'], // 포인트
        points_refundIndex: ['ADMINISTRATOR', 'MANAGER'], // 포인트 - 환불목록(관리자용)
        points_refund: ['AGENCY', 'AGENT', 'ADVERTISER'], // 포인트 - 충전,환불요청,이력
        points_delivery: ['AGENCY', 'AGENT'], // 포인트 - 전달
        points_accountHistory: ['ADMINISTRATOR', 'MANAGER'], // 포인트 - 가상계좌 충전 이력
        dashboard: ['ADMINISTRATOR', 'MANAGER', 'PUBLISHER', 'ADVERTISER', 'AGENCY', 'AGENT'], // 대시보드
        dashboard_adminOrManager: ['ADMINISTRATOR', 'MANAGER'], // 대시보드 - 관리자&운영자
        dashboard_advertiser: ['ADVERTISER'], // 대시보드 - 광고주
        dashboard_publisher: ['PUBLISHER'], // 대시보드 - 매체사
        dashboard_agency: ['AGENCY'], // 대시보드 - 광고대행사
        dashboard_agent: ['AGENT'], // 대시보드 - 영업매니저
        reports: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT', 'PUBLISHER', 'ADVERTISER'], // 보고서
        reports_publisher: ['ADMINISTRATOR', 'MANAGER', 'PUBLISHER'], // 보고서 - 매체사
        reports_agency: ['ADMINISTRATOR', 'MANAGER'], // 대행사별 보고서
        reports_agent: ['ADMINISTRATOR', 'MANAGER', 'AGENCY'], // 영업자별 보고서
        reports_advertiser: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT'], // 광고주별 보고서
        reports_campaign: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT', 'ADVERTISER'], // 캠페인별 보고서
        reports_creative: ['ADMINISTRATOR', 'MANAGER', 'AGENT'], // 광고주 영업 현황
        adBuilder: ['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT', 'ADVERTISER'] // 애드빌더
      }
    }
  },
  mounted () {
    this.selectMenu()
    window.addEventListener('resize', this.handleWindowResize)
    document.addEventListener('click', this.returnSelectedMenu)
    this.handleWindowResize()
  },
  beforeDestroy () {
    document.removeEventListener('click', this.returnSelectedMenu)
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    ...mapMutations(['changeSideMenuStatus', 'addMenuClassname', 'changeSelectedMenuHasSubItems']),
    roleMenuDom (target) {
      return target.includes(this.user_session.role)
    },
    selectMenu () {
      const currentParentUrl = this.$route.path.split('/').filter(x => x !== '')[0]
      /*
        기존 this.$route.path.split('/').filter(x => x !== '')[1]
        변경사유 : 기존은 parent의 고유값으로 /app이 항상 존재하여서 [1]번째의 값을 부모영역으로 봤지만,
        현재는 그런 고유 묶음이 없다.
       */
      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase()
      } else {
        this.selectedParentMenu = 'dashboards'
      }
    },
    changeSelectedParentHasNoSubmenu (parentMenu) {
      this.selectedParentMenu = parentMenu
      this.changeSelectedMenuHasSubItems(false)
      this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
    },
    openSubMenu (e, selectedParent) {
      this.changeSelectedMenuHasSubItems(true)

      const currentClasses = this.menuType ? this.menuType.split(' ').filter(x => x !== '') : ''

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (this.menuClickCount === 2 || this.menuClickCount === 0)
        ) {
          this.changeSideMenuStatus({ step: 3, classNames: this.menuType })
        } else if (
          currentClasses.includes('menu-hidden') &&
          (this.menuClickCount === 1 || this.menuClickCount === 3)
        ) {
          this.changeSideMenuStatus({ step: 2, classNames: this.menuType })
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (this.menuClickCount === 1 || this.menuClickCount === 3)
        ) {
          this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
        }
      } else {
        this.addMenuClassname({ classname: 'sub-show-temporary', currentClasses: this.menuType })
      }
      this.selectedParentMenu = selectedParent
    },
    addEvents () {
      document.addEventListener('click', this.handleDocumentClick)
    },
    removeEvents () {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    returnSelectedMenu () {
      if (!this.isMenuOver) {
        this.selectMenu()
      }
    },
    handleDocumentClick (e) {
      if (!this.isMenuOver) {
        let cont = true
        e.path.map(p => {
          if (p.nodeName !== 'svg' && p.className !== undefined && p.className.indexOf('menu-button') > -1) {
            cont = false
          }
        })
        if (cont) {
          this.toggle()
        }
      }
    },
    toggle () {
      const currentClasses = this.menuType.split(' ').filter(x => x !== '')
      if (currentClasses.includes('menu-sub-hidden') && this.menuClickCount === 3) {
        this.changeSideMenuStatus({ step: 2, classNames: this.menuType })
      } else if (currentClasses.includes('menu-hidden') || currentClasses.includes('menu-mobile')) {
        this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
      }
    },
    // Resize
    handleWindowResize (event) {
      if (event && !event.isTrusted) {
        return
      }
      let nextClasses = this.getMenuClassesForResize(this.menuType)
      this.changeSideMenuStatus({ step: 0, classNames: nextClasses.join(' ') })
    },
    getMenuClassesForResize (classes) {
      let nextClasses = classes.split(' ').filter(x => x !== '')
      const windowWidth = window.innerWidth

      if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push('menu-mobile')
      } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          !nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses.push('menu-sub-hidden')
        }
      } else {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden')
        }
      }
      return nextClasses
    },
    // Change Default Menu Type
    changeDefaultMenuType (containerClassnames) {
      let nextClasses = this.getMenuClassesForResize(containerClassnames)
      this.changeSideMenuStatus({ step: 0, classNames: nextClasses.join(' ') })
    }
  },
  computed: {
    ...mapGetters({
      menuType: 'getMenuType',
      menuClickCount: 'getMenuClickCount',
      selectedMenuHasSubItems: 'getSelectedMenuHasSubItems',
      currentUser: 'currentUser'
    })
  },
  watch: {
    menuType: function (val) {
      if (val.indexOf('show-temporary') > -1) {
        this.addEvents()
      } else {
        this.removeEvents()
      }
    },
    '$route' (to, from) {
      if (to.path !== from.path) {
        this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
        this.selectMenu()
        window.scrollTo(0, top)
      }
    }
  }
}
</script>
