import Vue from 'vue'
import Router from 'vue-router'
import AuthRequired from '@/utils/AuthRequired'
Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "app" */ './views/app'),
    redirect: '/dashboard/index',
    beforeEnter: AuthRequired,
    children: [
      {
        path: 'customer',
        component: () => import('./views/customer'),
        redirect: '/customer/contacts',
        children: [
          { name: 'contactsIndex', path: 'contacts', component: () => import(/* webpackChunkName: "Customer" */ './views/customer/Contacts') },
          { name: 'contactsView', path: 'contacts/:contact_id', component: () => import(/* webpackChunkName: "contact" */ './views/customer/ContactsView') },
          { name: 'contactsCreate', path: 'contacts/create', component: () => import(/* webpackChunkName: "Customer" */ './views/customer/ContactsForm') },
          { name: 'contactsEdit', path: 'contacts/:contact_id/edit', component: () => import(/* webpackChunkName: "Customer" */ './views/customer/ContactsForm') },
          { name: 'guestIndex', path: 'guest', component: () => import(/* webpackChunkName: "Customer" */ './views/customer/GuestIndex') },
          { name: 'guestView', path: 'guest/:guest_id/edit', component: () => import(/* webpackChunkName: "Customer" */ './views/customer/GuestView') }
        ]
      },
      /*
        기존은 src 디렉토리에 /app 디렉토리 기준으로 묶여 /app/{parent}/{child} 방식의 메뉴 링크 방식을 사용했으나,
        현재는 /contac로 바로 1차 혹은 /{parent}/{child} 형식의 메뉴 구조를 사용하기위한 path 설정
       */
      {
        path: 'advertisements',
        component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements'),
        redirect: '/advertisements/me/orders',
        children: [
          { path: ':advertiser_id/orders', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/OrderIndex'), name: 'orderIndex' },
          { path: ':advertiser_id/orders/create', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/OrderCreate'), name: 'orderCreate' },
          { path: ':advertiser_id/orders/:order_id', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/OrderEdit'), name: 'orderEdit' },
          { path: ':advertiser_id/orders/:order_id/lineItems', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/LineItemIndex'), name: 'lineItemIndex' },
          { path: ':advertiser_id/orders/:order_id/lineItems/create', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/LineItemCreate'), name: 'lineItemCreate' },
          { path: ':advertiser_id/orders/:order_id/lineItems/:line_item_id', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/LineItemEdit'), name: 'lineItemEdit' },
          { path: ':advertiser_id/orders/:order_id/lineItems/:line_item_id/creatives', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/CreativeIndex'), name: 'creativeIndex' },
          { path: ':advertiser_id/orders/:order_id/lineItems/:line_item_id/creatives/create', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/CreativeCreate'), name: 'creativeCreate' },
          { path: ':advertiser_id/orders/:order_id/lineItems/:line_item_id/creatives/:creative_id', component: () => import(/* webpackChunkName: "advertisements" */ './views/advertisements/CreativeEdit'), name: 'creativeEdit' },
          { name: 'adBuilderText', path: 'adBuilder/show', component: () => import(/* webpackChunkName: "builder" */ './views/builder/show') },
          { name: 'adBuilderHome', path: 'adBuilder', component: () => import(/* webpackChunkName: "builder" */ './views/builder/home') },
          { name: 'adBuilderIndex', path: 'adBuilderList', component: () => import(/* webpackChunkName: "builder" */ './views/builder/list') },
          { name: 'NATIVE_BANNER', path: 'adBuilder/:builder_id/NativeBanner', component: () => import(/* webpackChunkName: "builder" */ './views/builder/NativeBanner') },
          { name: 'TWO_SIDED_BANNER', path: 'adBuilder/TwoSidedBanner', component: () => import(/* webpackChunkName: "builder" */ './views/builder/TwoSidedBanner') },
          { name: 'PARALLAX', path: 'adBuilder/Parallax', component: () => import(/* webpackChunkName: "builder" */ './views/builder/Parallax') },
          { name: 'NATIVE_VOD_16x9', path: 'adBuilder/NativeVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/NativeVOD') },
          { name: 'NATIVE_VOD_4x3', path: 'adBuilder/NativeVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/NativeVOD') },
          { name: 'NATIVE_VOD_1x1', path: 'adBuilder/NativeVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/NativeVOD') },
          { name: 'EXTENDED_VOD', path: 'adBuilder/ExtendedVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/ExtendedVOD') },
          { name: 'VOD_SHOPPING_BOX', path: 'adBuilder/ShoppingVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/ShoppingVOD') },
          { name: 'WINDOW_PLAY', path: 'adBuilder/WindowPlay', component: () => import(/* webpackChunkName: "builder" */ './views/builder/WindowPlay') },
          { name: 'DROP_BANNER_VOD', path: 'adBuilder/DropVOD', component: () => import(/* webpackChunkName: "builder" */ './views/builder/DropVOD') }
        ]
      },
      {
        path: 'members',
        component: () => import('./views/members'),
        redirect: '/members/user',
        children: [
          { name: 'memberIndex', path: 'user', component: () => import(/* webpackChunkName: "user" */ './views/members/memberIndex') },
          { name: 'memberEdit', path: 'user/:user_id/edit', component: () => import(/* webpackChunkName: "user" */ './views/members/memberEdit') }
        ]
      },
      {
        path: 'managements',
        component: () => import('./views/managements'),
        redirect: '/managements/userEdit',
        children: [
          { name: 'userEdit', path: 'userEdit', component: () => import(/* webpackChunkName: "user" */ './views/managements/userEdit') },
          { name: 'managerIndex', path: 'manager', component: () => import(/* webpackChunkName: "user" */ './views/managements/managerIndex') },
          { name: 'managerEdit', path: 'manager/:user_id/edit', component: () => import(/* webpackChunkName: "user" */ './views/managements/userEdit') },
          { name: 'managerCreate', path: 'manager/create', component: () => import(/* webpackChunkName: "user" */ './views/managements/userCreate') },
          { name: 'advertiserIndex', path: 'advertiser', component: () => import(/* webpackChunkName: "user" */ './views/managements/advertiserIndex') },
          { name: 'advertiserEdit', path: 'advertiser/:user_id/edit', component: () => import(/* webpackChunkName: "user" */ './views/managements/userEdit') },
          { name: 'advertiserCreate', path: 'advertiser/create', component: () => import(/* webpackChunkName: "user" */ './views/managements/userCreate') }
        ]
      },
      {
        path: 'dashboard',
        component: () => import('./views/dashboard'),
        redirect: '/dashboard/index',
        children: [
          { name: 'routesRedirect', path: 'index', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/routesRedirect') },
          { name: 'adDashboard', path: 'advertiser', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Advertiser') },
          { name: 'pubDashboard', path: 'publisher', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Publisher') },
          { name: 'agencyDashboard', path: 'agency', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Agency') },
          { name: 'agentDashboard', path: 'agent', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Agent') },
          { name: 'adminDashboard', path: 'admin', component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard/Admin') }
        ]
      },
      {
        path: 'reports',
        component: () => import('./views/reports'),
        redirect: '/reports/campaign',
        children: [
          { name: 'reportPublisherPeriod', path: 'publisher', component: () => import(/* webpackChunkName: "reports" */ './views/reports/PublisherPeriod') },
          { name: 'reportPublisherDaily', path: 'publisher/daily', component: () => import(/* webpackChunkName: "reports" */ './views/reports/PublisherDaily') },
          { name: 'reportAgencyIndex', path: 'agency', component: () => import(/* webpackChunkName: "reports" */ './views/reports/AgencyIndex') },
          { name: 'reportAgentIndex', path: 'agent', component: () => import(/* webpackChunkName: "reports" */ './views/reports/AgentIndex') },
          { name: 'reportAdvertiserIndex', path: 'advertiser', component: () => import(/* webpackChunkName: "reports" */ './views/reports/AdvertiserIndex') },
          { name: 'reportCampaignIndex', path: 'campaign', component: () => import(/* webpackChunkName: "reports" */ './views/reports/CampaignIndex') },
          { name: 'reportCampaignPeriod', path: 'campaign/:advertiser_name/:line_item_id', component: () => import(/* webpackChunkName: "reports" */ './views/reports/CampaignPeriod') },
          { name: 'reportCampaignDaily', path: 'campaign/:advertiser_name/:line_item_id/daily', component: () => import(/* webpackChunkName: "reports" */ './views/reports/CampaignDaily') },
          { name: 'reportCreativeIndex', path: 'creative', component: () => import(/* webpackChunkName: "reports" */ './views/reports/CreativeIndex') },
          { name: 'reportKeywordIndex', path: 'campaign/:line_item_id/keyword', component: () => import(/* webpackChunkName: "reports" */ './views/reports/KeywordIndex') }
        ]
      },
      {
        path: 'media',
        component: () => import('./views/media'),
        redirect: '/media/publishers',
        children: [
          { name: 'ContentControl', path: 'contentControl', component: () => import(/* webpackChunkName: "media" */ './views/media/ContentControl') },
          { name: 'PressConnectionReport', path: 'pressConnectionReport', component: () => import(/* webpackChunkName: "media" */ './views/media/PressConnectionReport') },
          { name: 'Category', path: 'categories', component: () => import(/* webpackChunkName: "media" */ './views/media/Category') },
          { name: 'Contents', path: 'contents', component: () => import(/* webpackChunkName: "media" */ './views/media/Contents') },
          { name: 'Keywords', path: 'keywords', component: () => import(/* webpackChunkName: "media" */ './views/media/Keywords') },
          { name: 'CategoryValidation', path: 'categoryValidation', component: () => import(/* webpackChunkName: "media" */ './views/media/CategoryValidation') },
          { name: 'Publishers', path: 'publishers', component: () => import(/* webpackChunkName: "media" */ './views/media/Publishers') },
          { name: 'SiteIndex', path: 'publishers/:user_id/sites', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteIndex') },
          { name: 'SiteIndexList', path: 'sites', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteIndex') },
          { name: 'SiteIndexPublisher', path: 'siteList', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteIndex') },
          { name: 'SiteCreateSupply', path: 'siteList/create', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteShowSupply') },
          { name: 'SiteShowSupply', path: 'siteList/:site_id', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteShowSupply') },
          { name: 'SiteShow', path: 'publishers/:user_id/sites/:site_id', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteShow') },
          { name: 'SiteCreate', path: 'publishers/:user_id/sites/create', component: () => import(/* webpackChunkName: "media" */ './views/media/SiteShow') },
          { name: 'GroupIndex', path: 'publishers/:user_id/sites/:site_id/groups', component: () => import(/* webpackChunkName: "media" */ './views/media/GroupIndex') },
          { name: 'GroupShow', path: 'publishers/:user_id/sites/:site_id/groups/:group_id', component: () => import(/* webpackChunkName: "media" */ './views/media/GroupShow') },
          { name: 'GroupCreate', path: 'publishers/:user_id/sites/:site_id/groups/create', component: () => import(/* webpackChunkName: "media" */ './views/media/GroupShow') },
          { name: 'AdUnitIndex', path: 'publishers/:user_id/sites/:site_id/groups/:group_id/AdUnits', component: () => import(/* webpackChunkName: "media" */ './views/media/AdUnitIndex') },
          { name: 'AdUnitShow', path: 'publishers/:user_id/sites/:site_id/groups/:group_id/AdUnits/:ad_unit_id', component: () => import(/* webpackChunkName: "media" */ './views/media/AdUnitShow') },
          { name: 'AdUnitCreate', path: 'publishers/:user_id/sites/:site_id/groups/:group_id/AdUnits/create', component: () => import(/* webpackChunkName: "media" */ './views/media/AdUnitShow') }
        ]
      },
      {
        path: 'points',
        component: () => import('./views/points'),
        redirect: '/points/charge',
        children: [
          { name: 'pointCharge', path: 'charge', component: () => import(/* webpackChunkName: "points" */ './views/points/Charge') },
          { name: 'pointRefund', path: 'refund', component: () => import(/* webpackChunkName: "points" */ './views/points/Refund') },
          { name: 'pointHistory', path: 'history', component: () => import(/* webpackChunkName: "points" */ './views/points/History') },
          { name: 'pointRefundIndex', path: 'refundList', component: () => import(/* webpackChunkName: "points" */ './views/points/refundIndex') },
          { name: 'pointRefundHistory', path: 'refundHistory', component: () => import(/* webpackChunkName: "points" */ './views/points/refundHistory') },
          { name: 'pointDelivery', path: 'delivery', component: () => import(/* webpackChunkName: "points" */ './views/points/delivery') },
          { name: 'accountHistory', path: 'account', component: () => import(/* webpackChunkName: "points" */ './views/points/accountHistory') },
          { name: 'pointTest', path: 'test', component: () => import(/* webpackChunkName: "points" */ './views/points/test') }
        ]
      },
      {
        path: 'app/dashboards',
        component: () => import(/* webpackChunkName: "dashboards" */ './views/app/dashboards'),
        redirect: '/app/dashboards/default',
        children: [
          { path: 'default', component: () => import(/* webpackChunkName: "dashboards" */ './views/app/dashboards/Default') },
          { path: 'analytics', component: () => import(/* webpackChunkName: "dashboards" */ './views/app/dashboards/Analytics') },
          { path: 'ecommerce', component: () => import(/* webpackChunkName: "dashboards" */ './views/app/dashboards/Ecommerce') },
          { path: 'content', component: () => import(/* webpackChunkName: "dashboards" */ './views/app/dashboards/Content') }
        ]
      },
      {
        path: 'app/pages',
        component: () => import(/* webpackChunkName: "pages" */ './views/app/pages'),
        redirect: '/app/pages/data-list',
        children: [
          { path: 'data-list', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/DataList') },
          { path: 'thumb-list', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/ThumbList') },
          { path: 'image-list', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/ImageList') },
          { path: 'details', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/Details') },
          { path: 'search', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/Search') },
          { path: 'mailing', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/Mailing') },
          { path: 'invoice', component: () => import(/* webpackChunkName: "pages" */ './views/app/pages/Invoice') }
        ]
      },
      {
        path: 'app/applications',
        component: () => import(/* webpackChunkName: "applications" */ './views/app/applications'),
        redirect: '/app/applications/todo',
        children: [
          { path: 'todo', component: () => import(/* webpackChunkName: "applications" */ './views/app/applications/Todo') },
          { path: 'survey', component: () => import(/* webpackChunkName: "applications" */ './views/app/applications/Survey') },
          { path: 'survey/:id', component: () => import(/* webpackChunkName: "applications" */ './views/app/applications/SurveyDetail'), props: true },
          { path: 'chat', component: () => import(/* webpackChunkName: "applications" */ './views/app/applications/Chat') }
        ]
      },
      {
        path: 'app/ui',
        component: () => import(/* webpackChunkName: "ui" */ './views/app/ui'),
        redirect: '/app/ui/alerts',
        children: [
          { path: 'alerts', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Alerts') },
          { path: 'badges', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Badges') },
          { path: 'buttons', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Buttons') },
          { path: 'cards', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Cards') },
          { path: 'carousel', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Carousel') },
          { path: 'charts', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Charts') },
          { path: 'collapse', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Collapse') },
          { path: 'dropdowns', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Dropdowns') },
          { path: 'editors', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Editors') },

          { path: 'form-components', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/FormComponents') },
          { path: 'icons', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Icons') },
          { path: 'input-groups', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/InputGroups') },
          { path: 'jumbotron', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Jumbotron') },
          { path: 'maps', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Maps') },
          { path: 'modal', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Modal') },
          { path: 'navigation', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Navigation') },
          { path: 'popover-tooltip', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/PopoverTooltip') },
          { path: 'sortable', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Sortable') },
          { path: 'tables', component: () => import(/* webpackChunkName: "ui" */ './views/app/ui/Tables') }
        ]
      }
    ]
  },
  { path: '/error', component: () => import(/* webpackChunkName: "error" */ './views/Error') },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ './views/user'),
    redirect: '/user/login',
    children: [
      { name: 'userLogin', path: 'login', component: () => import(/* webpackChunkName: "user" */ './views/user/Login') },
      { name: 'userPassword', path: 'password', component: () => import(/* webpackChunkName: "user" */ './views/user/Password') },
      { name: 'userRegister', path: 'register/:userType_id', component: () => import(/* webpackChunkName: "user" */ './views/user/Register') },
      { name: 'userRegisterType', path: 'register', component: () => import(/* webpackChunkName: "user" */ './views/user/RegisterType') }
    ]
  },
  { path: '*', component: () => import(/* webpackChunkName: "error" */ './views/Error') }
]

const router = new Router({
  linkActiveClass: 'active',
  routes,
  mode: 'history'
})

export default router
