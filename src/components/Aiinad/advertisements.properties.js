/**
 * 광고 관련 속성 및 관련 공통 메서드
 */
import * as af from '@/components/Aiinad/common.functions'

export const config = {
  perPage: 15
}

/**
 * 광고 그룹 (Order)
 */
export const order = {
  PER_PAGE: config.perPage,
  typeOptions: [
    { value: null, text: '검색 대상' },
    { value: 'OL_NAME', text: '광고 그룹명 / 광고명' },
    { value: 'AD_ID', text: '광고 아이디' },
    { value: 'AGENCY', text: '대행사' },
    { value: 'ADVERTISER', text: '광고주' }
  ],
  statusOptions: [
    { value: null, text: '광고 그룹/광고 상태' },
    { value: 'DRAFT', text: '[광고 그룹] 승인 대기' },
    { value: 'APPROVED', text: '[광고 그룹] 승인' },
    { value: 'ARCHIVED', text: '[광고 그룹] 중단' },
    { value: 'LI_DRAFT', text: '[광고] 승인 대기' },
    { value: 'LI_READY', text: '[광고] 준비' },
    { value: 'LI_DELIVERING', text: '[광고] 게재 중' }
  ],
  toStatusText: (value, isArchived) => {
    if (isArchived) {
      return '<span class="badge mb-1 badge-danger">중단</span>'
    }

    if (value === 'APPROVED') {
      return '<span class="badge mb-1 badge-light">승인</span>'
    } else if (value === 'DRAFT') {
      return '<span class="badge mb-1 badge-primary">승인 대기</span>'
    } else {
      return value
    }
  },
  /**
   * 광고 status Code의 텍스트 반환
   * @param value
   * @param cnt
   * @returns string
   */
  toLineItemStatusText (value, cnt) {
    let text = `알 수 없음 (${value})`
    switch (value) {
      case 'PAUSED_INVENTORY_RELEASED':
        text = '<span class="badge mb-1 badge-warning">정지(IR)'
        break
      case 'READY':
        text = '<span class="badge mb-1 badge-outline-success">준비'
        break
      case 'READY_R':
        text = '<span class="badge mb-1 badge-success">게재 중(R)'
        break
      case 'DELIVERING':
        text = '<span class="badge mb-1 badge-success">게재 중'
        break
      case 'COMPLETED':
        text = '<span class="badge mb-1 badge-light">완료'
        break
      case 'INACTIVE':
        text = '<span class="badge mb-1 badge-primary">승인 대기'
        break
      case 'DRAFT':
        text = '<span class="badge mb-1 badge-outline-primary">임시'
        break
      case 'PAUSED':
        text = '<span class="badge mb-1 badge-warning">일시정지'
        break
      case '__ARCHIVED__':
        text = '<span class="badge mb-1 badge-danger">중단'
        break
    }
    return text + ' (' + cnt + ')</span>'
  }
}

/**
 * 광고 (LineItem)
 */
export const lineItem = {
  PER_PAGE: config.perPage,
  MAX_FREQUENCY_CAPS: 3,
  MAX_PAGE_TARGETINGS: 20,
  CPM_MIN_UNIT_PRICE: 2000,
  adTypeCds: {
    'DISPLAY_BANNER': '0x0',
    'INNER_COVER': '2x5',
    'RICH_MEDIA': '3x1'
  },
  getAdTypeLabel: (adTypeCd) => {
    const _adTypes = {
      '0x0': { label: 'Display', code: 'DISPLAY_BANNER' },
      '2x5': { label: 'Inner Cover', code: 'INNER_COVER' },
      '3x1': { label: 'Rich Media', code: 'RICH_MEDIA' }
    }

    return af.arrGet(_adTypes, adTypeCd + '.label', null)
  },
  lineItemTypes: [
    { label: 'Sponsorship', value: 'SPONSORSHIP' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Network', value: 'NETWORK' },
    { label: 'Bulk', value: 'BULK' },
    { label: 'Price priority', value: 'PRICE_PRIORITY' },
    { label: 'House', value: 'HOUSE' },
    { label: 'AdSense', value: 'ADSENSE' },
    { label: 'AdExchange', value: 'AD_EXCHANGE' }
  ],
  unitTypesAll: [
    { label: '노출수', value: 'IMPRESSIONS' },
    { label: '클릭수', value: 'CLICKS' },
    { label: '조회 가능 노출수', value: 'VIEWABLE_IMPRESSIONS' }
  ],
  unitTypes: [
    { label: '노출수', value: 'IMPRESSIONS' }
  ],
  unitTypesForRichMedia: [
    { label: '조회 가능 노출수', value: 'VIEWABLE_IMPRESSIONS' }
  ],
  goalTypes: [
    { label: 'None', value: 'NONE' },
    { label: 'Lifetime', value: 'LIFETIME' },
    { label: 'Daily', value: 'DAILY' }
  ],
  creativeRotationTypes: [
    { label: '균등게재', value: 'EVEN', description: '광고 소재가 균등하게 순환게재됩니다.' },
    { label: '최적화 게재', value: 'OPTIMIZED', description: '가장 높은 클릭률(CTR)을 보이는 광고 소재가 더 자주 게재됩니다.' }
    // { label: 'Manual', value: 'MANUAL' },
    // { label: '순차게재', value: 'SEQUENTIAL', description: '지정한 순서에 따라 광고 소재가 순환게재됩니다. 1에서 80 사이의 숫자를 입력해야 합니다.' }
  ],
  startDateTimeTypes: [
    { label: '시작 날짜 시간 사용', value: 'USE_START_DATE_TIME' },
    { label: '즉시', value: 'IMMEDIATELY' },
    { label: '1시간 뒤', value: 'ONE_HOUR_FROM_NOW' }
  ],
  roadblockingTypes: [
    { label: '하나만', value: 'ONLY_ONE', description: '광고에 여러 개의 광고 소재가 연결되어 있는 경우 페이지당 하나의 광고 소재만 표시합니다.' },
    { label: '하나 이상', value: 'ONE_OR_MORE', description: '광고와 연관된 여러 개의 광고를 표시할 수 있습니다.' },
    { label: '최대한 많이', value: 'AS_MANY_AS_POSSIBLE', description: '가능한 한 많은 광고 단위에 광고 소재를 표시합니다.' }
  ],
  deliveryRateTypes: [
    { label: '균등하게', value: 'EVENLY' },
    { label: '프런트로드', value: 'FRONTLOADED' },
    { label: '빠른 속도', value: 'AS_FAST_AS_POSSIBLE' }
  ],
  creativePlaceholdersTypes: [
    { label: 'Display', value: '0x0', descript: '(PC, MOBILE) = XXx x YYY' },
    // { label: '팝 커버', value: '1x1', descript: 'PC-1x1, MOBILE-1x2' },
    // { label: '풀 커버', value: '2x1', descript: 'MOBILE ONLY' },
    // { label: '하프 커버', value: '2x2', descript: 'MOBILE ONLY' },
    // { label: '팝-풀 커버', value: '2x3', descript: 'MOBILE ONLY' },
    { label: 'Rich Media', value: '3x1', descript: 'PC, MOBILE' },
    { label: 'Inner Cover', value: '2x5', descript: 'PC, MOBILE' }
  ],
  computedStatus: [
    { label: 'Delivery extended', value: 'DELIVERY_EXTENDED' },
    { label: 'Delivering', value: 'DELIVERING' },
    { label: 'Ready', value: 'READY' },
    { label: 'Paused', value: 'PAUSED' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Paused inventory released', value: 'PAUSED_INVENTORY_RELEASED' },
    { label: 'Pending approval', value: 'PENDING_APPROVAL' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Disapproved', value: 'DISAPPROVED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Canceled', value: 'CANCELED' }
  ],
  costTypes: [
    { label: '노출당비용(CPM)', value: 'CPM' },
    // { label: '클릭당비용(CPC)', value: 'CPC' },
    { label: '조회 가능 CPM (vCPM)', value: 'VCPM' }
  ],
  deviceTargetingTypeCds: {
    'PC': 30000,
    'MOBILE_SMARTPHONE': 30001,
    'MOBILE_TABLET': 30002
  },
  deviceTargetingTypes: [
    { text: 'PC', value: 30000, disabled: false },
    { text: 'MOBILE (스마트폰)', value: 30001, disabled: false },
    { text: 'MOBILE (태블릿)', value: 30002, disabled: false }
  ],
  frequencyCapTypes: [
    { label: '분(Minutes)', value: 'MINUTE' },
    { label: '시간(Hour)', value: 'HOUR' },
    { label: '일자(Day)', value: 'DAY' }
  ],
  geoTargetingTypes: [
    // { label: '* 미지정', value: 0 },
    { label: '대한민국', value: 2410 },
    { label: '서울', value: 21318 },
    { label: '부산광역시', value: 21319 },
    { label: '대구광역시', value: 21320 },
    { label: '인천광역시', value: 21321 },
    { label: '광고광역시', value: 21322 },
    { label: '대전광역시', value: 21323 },
    { label: '울산광역시', value: 21324 },
    { label: '경기도', value: 21325 },
    { label: '강원도', value: 21326 },
    { label: '충청북도', value: 21327 },
    { label: '충청남도', value: 21328 },
    { label: '전라북도', value: 21329 },
    { label: '전라남도', value: 21330 },
    { label: '경상북도', value: 21331 },
    { label: '경상남도', value: 21332 },
    { label: '제주도', value: 21333 },
    { label: '경기도 수원시', value: 1009877 }
  ],
  keywordsTargetingTypes: [
  ],
  tmpDayTypes: [
    { text: '일', value: 'SUNDAY' },
    { text: '월', value: 'MONDAY' },
    { text: '화', value: 'TUESDAY' },
    { text: '수', value: 'WEDNESDAY' },
    { text: '목', value: 'THURSDAY' },
    { text: '금', value: 'FRIDAY' },
    { text: '토', value: 'SATURDAY' }
  ],
  contentCategoryTypes: (currentUser) => {
    let categories = [
      {
        id: '정치',
        label: '정치',
        children: [
          {
            id: '정치_청와대',
            label: '정치_청와대'
          },
          {
            id: '정치_국회/정당',
            label: '정치_국회/정당'
          },
          {
            id: '정치_북한',
            label: '정치_북한'
          },
          {
            id: '정치_행정',
            label: '정치_행정'
          },
          {
            id: '정치_국방/외교',
            label: '정치_국방/외교'
          },
          {
            id: '정치_정치일반',
            label: '정치_정치일반'
          }
        ]
      },
      {
        id: '경제',
        label: '경제',
        children: [
          {
            id: '경제_금융',
            label: '경제_금융'
          },
          {
            id: '경제_증권',
            label: '경제_증권'
          },
          {
            id: '경제_산업/재계',
            label: '경제_산업/재계'
          },
          {
            id: '경제_중기/벤처',
            label: '경제_중기/벤처'
          },
          {
            id: '경제_부동산',
            label: '경제_부동산'
          },
          {
            id: '경제_글로벌 경제',
            label: '경제_글로벌 경제'
          },
          {
            id: '경제_생활경제',
            label: '경제_생활경제'
          },
          {
            id: '경제_경제 일반',
            label: '경제_경제 일반'
          }
        ]
      },
      {
        id: '사회',
        label: '사회',
        children: [
          {
            id: '사회_사건사고',
            label: '사회_사건사고'
          },
          {
            id: '사회_교육',
            label: '사회_교육'
          },
          {
            id: '사회_노동',
            label: '사회_노동'
          },
          {
            id: '사회_언론',
            label: '사회_언론'
          },
          {
            id: '사회_환경',
            label: '사회_환경'
          },
          {
            id: '사회_인권/복지',
            label: '사회_인권/복지'
          },
          {
            id: '사회_식품/의료',
            label: '사회_식품/의료'
          },
          {
            id: '사회_지역',
            label: '사회_지역'
          },
          {
            id: '사회_인물',
            label: '사회_인물'
          },
          {
            id: '사회_사회 일반',
            label: '사회_사회 일반'
          }
        ]
      },
      {
        id: '생활/문화',
        label: '생활/문화',
        children: [
          {
            id: '생활/문화_건강정보',
            label: '생활/문화_건강정보'
          },
          {
            id: '생활/문화_자동차/시승기',
            label: '생활/문화_자동차/시승기'
          },
          {
            id: '생활/문화_도로/교통',
            label: '생활/문화_도로/교통'
          },
          {
            id: '생활/문화_여행/레저',
            label: '생활/문화_여행/레저'
          },
          {
            id: '생활/문화_음식/맛집',
            label: '생활/문화_음식/맛집'
          },
          {
            id: '생활/문화_패션/뷰티',
            label: '생활/문화_패션/뷰티'
          },
          {
            id: '생활/문화_공연/전시',
            label: '생활/문화_공연/전시'
          },
          {
            id: '생활/문화_책',
            label: '생활/문화_책'
          },
          {
            id: '생활/문화_종교',
            label: '생활/문화_종교'
          },
          {
            id: '생활/문화_날씨',
            label: '생활/문화_날씨'
          },
          {
            id: '생활/문화_생활문화 일반',
            label: '생활/문화_생활문화 일반'
          }
        ]
      },
      {
        id: '세계',
        label: '세계',
        children: [
          {
            id: '세계_아시아/호주',
            label: '세계_아시아/호주'
          },
          {
            id: '세계_미국/중남미',
            label: '세계_미국/중남미'
          },
          {
            id: '세계_유럽',
            label: '세계_유럽'
          },
          {
            id: '세계_중동/아프리카',
            label: '세계_중동/아프리카'
          },
          {
            id: '세계_세계 일반',
            label: '세계_세계 일반'
          }
        ]
      },
      {
        id: 'IT/과학',
        label: 'IT/과학',
        children: [
          {
            id: 'IT/과학_모바일',
            label: 'IT/과학_모바일'
          },
          {
            id: 'IT/과학_인터넷/SNS',
            label: 'IT/과학_인터넷/SNS'
          },
          {
            id: 'IT/과학_통신/뉴미디어',
            label: 'IT/과학_통신/뉴미디어'
          },
          {
            id: 'IT/과학_IT 일반',
            label: 'IT/과학_IT 일반'
          },
          {
            id: 'IT/과학_보안/해킹',
            label: 'IT/과학_보안/해킹'
          },
          {
            id: 'IT/과학_컴퓨터',
            label: 'IT/과학_컴퓨터'
          },
          {
            id: 'IT/과학_게임/리뷰',
            label: 'IT/과학_게임/리뷰'
          },
          {
            id: 'IT/과학_과학 일반',
            label: 'IT/과학_과학 일반'
          }
        ]
      },
      {
        id: '스포츠',
        label: '스포츠',
        children: [
          {
            id: '스포츠_야구',
            label: '스포츠_야구'
          },
          {
            id: '스포츠_해외야구',
            label: '스포츠_해외야구'
          },
          {
            id: '스포츠_축구',
            label: '스포츠_축구'
          },
          {
            id: '스포츠_해외축구',
            label: '스포츠_해외축구'
          },
          {
            id: '스포츠_농구',
            label: '스포츠_농구'
          },
          {
            id: '스포츠_배구',
            label: '스포츠_배구'
          },
          {
            id: '스포츠_골프',
            label: '스포츠_골프'
          },
          {
            id: '스포츠_스포츠 일반',
            label: '스포츠_스포츠 일반'
          },
          {
            id: '스포츠_E-스포츠',
            label: '스포츠_E-스포츠'
          }
        ]
      },
      {
        id: 'TV/연예',
        label: 'TV/연예',
        children: [
          {
            id: 'TV/연예_방송/TV',
            label: 'TV/연예_방송/TV'
          },
          {
            id: 'TV/연예_드라마',
            label: 'TV/연예_드라마'
          },
          {
            id: 'TV/연예_뮤직',
            label: 'TV/연예_뮤직'
          },
          {
            id: 'TV/연예_해외연예',
            label: 'TV/연예_해외연예'
          }
        ]
      }
    ]

    // 관리자 테스트용
    if (af.Role.allowAdminOrManager(currentUser)) {
      categories.push({
        id: 'DEVTEST',
        label: 'DEVTEST',
        children: [
          { id: 'DEVTEST_SUB1', label: 'DEVTEST_SUB1' },
          { id: 'DEVTEST_SUB2', label: 'DEVTEST_SUB2' },
          { id: 'DEVTEST_SUB3', label: 'DEVTEST_SUB3' },
          { id: 'DEVTEST_SUB15', label: 'DEVTEST_SUB15' }
        ]
      })
    }

    return categories
  },
  /**
   * value|목표 단위로 과금 방식 반환
   * @param (goalUnitType)
   */
  getCostTypeByGoalUnitType: (goalUnitType) => {
    let costType = 'CPM'
    if ((goalUnitType) === 'CLICKS') {
      costType = 'CPC'
    } else if ((goalUnitType) === 'VIEWABLE_IMPRESSIONS') {
      costType = 'VCPM'
    }
    return costType
  }
}

/**
 * 광고 소재(Creative)
 */
export const creative = {
  PER_PAGE: config.perPage,
  /**
   * CreativeTemplate Variable Key를 텍스트로 변환
   * @param uniqueName
   * @returns {string}
   */
  getCreativeTemplateVariableValueToText: (uniqueName) => {
    if (uniqueName === 'CREATIVE_FILE') {
      return '광고 소재 파일'
    } else if (uniqueName === 'CREATIVE_TYPE') {
      return '광고 소재 유형'
    } else {
      return uniqueName
    }
  },
  /**
   * RichMediaTypeCd로 광고 소재 사이즈 반환
   * @param richMediaTypeCd
   * @returns {string}
   */
  getSizeByRichMediaTypeCd: (richMediaTypeCd) => {
    if (richMediaTypeCd === 'WINDOW_PLAY') {
      return '320x100'
    } else {
      return '336x280'
    }
  }
}
