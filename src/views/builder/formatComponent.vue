<template>
  <div>
    <div class="adBuilder_mobile">
      <div class="mobile-com" id="mobile-com" @scroll="handleScroll">
        <template v-if="this.file">
          <div v-if="vModel.time && !this.type" style="text-align:center;margin: 278px 0 0;">
            <h5>{{vModel.info.title}}</h5>
            <p>{{vModel.info.desc}}</p>
            <p>{{vModel.info.etc}}</p>
          </div>
          <div v-else>
            <div class="adBuilder_box2" style="margin-top:10px;"></div>
            <div class="adBuilder_box1"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box1"></div>
            <div id="adBuilder_BannerBox">
              <template v-if="this.format === 'NATIVE BANNER'">
                <div id="mci-native-banner" class="cf" style="width:100%;overflow: hidden;">
                  <div :style="`width:100%;height:` + player.height + `px`">
                  <template v-if="file.main">
                    <template v-if="file.main.length > 1">
                      <swiper :options="vModel.nativeBanner.swiperOption" style="padding:0;">
                        <swiper-slide v-for="(banner,index) in file.main" :key="index">
                          <b-link :href="text.url" target="_blank">
                            <img :src="banner" :style="`width:100%;height:` + player.height + `px`"/>
                          </b-link>
                        </swiper-slide>
                        <div class="swiper-pagination swiper-pagination-white" style="width: auto;
    margin-left: 5px;" slot="pagination"></div>
                      </swiper>
                    </template>
                    <template v-else>
                      <b-link :href="text.url" target="_blank">
                        <img :src="file.main[0]" :style="`width:100%;height:` + player.height + `px`"/>
                      </b-link>
                    </template>
                  </template>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                    <div class="mci-tap-text">
                      <p class="mci-tap-desc mci-txt-one">{{file.desc}}</p>
                      <p class="mci-tap-tit mci-txt-one">{{file.title}}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'PARALLAX'">
                <div id="mci-parallax-banner" class="mt-2 mb-2">
                  <b-link :href="result.url" target="_blank">
                    <div :style="vModel.parallax.imgStyle"></div>
                  </b-link>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                    <div class="mci-tap-text">
                      <p class="mci-tap-desc mci-txt-one">{{file.desc}}</p>
                      <p class="mci-tap-tit mci-txt-one">{{file.title}}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'NATIVE VOD (16:9)'">
                <div id="mci-nativeVod-banner-16x9" class="cf position-relative">
                  <div :style="`height:` + player.height + `px;`">
                    <template v-if="file">
                    <iframe
                      :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                      id="nativeVodPlayer_16x9"
                      :width="player.width"
                      :height="player.height"
                      frameborder="0"
                      allow="autoplay"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen>
                    </iframe>
                    <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.height - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_16x9')">
                      <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                    </button>
                    </template>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                    <div class="mci-tap-text">
                      <p class="mci-tap-desc mci-txt-one">{{file.desc}}</p>
                      <p class="mci-tap-tit mci-txt-one">{{file.title}}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'NATIVE VOD (4:3)'">
                <div id="mci-nativeVod-banner-4x3" class="cf position-relative">
                  <div :style="`height:` + player.width /4 *3 + `px;`">
                    <template v-if="file">
                      <iframe
                        :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                        id="nativeVodPlayer_4x3"
                        :width="player.width"
                        :height="player.width /4 *3"
                        frameborder="0"
                        allow="autoplay"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen>
                      </iframe>
                      <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.width /4 *3 - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_4x3')">
                        <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                      </button>
                    </template>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'NATIVE VOD (1:1)'">
                <div id="mci-nativeVod-banner-1x1" class="cf position-relative">
                  <div :style="`height:` + player.width + `px;`">
                    <template v-if="file">
                      <iframe
                        :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                        id="nativeVodPlayer_1x1"
                        :width="player.width"
                        :height="player.width"
                        frameborder="0"
                        allow="autoplay"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen>
                      </iframe>
                      <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.width - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_1x1')">
                        <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                      </button>
                    </template>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'TWO-SIDED BANNER'">
                <div id="mci-twoSided-banner">
                  <div class="mci-twoSided-wrap" :style="vModel.twosided.imgStyle">
                    <div class="mci-face mci-front">
                      <img :src="file.main"/>
                    </div>
                    <div class="mci-face mci-back position-relative">
                      <iframe
                        :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                        id="twoSidedPlayer"
                        :width ="player.width"
                        :height = "player.height"
                        frameborder="0"
                        allow="autoplay"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen>
                      </iframe>
                      <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('twoSidedPlayer')">
                        <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                      </button>
                    </div>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                    <div class="mci-tap-text">
                      <p class="mci-tap-desc mci-txt-one">{{file.desc}}</p>
                      <p class="mci-tap-tit mci-txt-one">{{file.title}}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'EXTENDED VOD'">
                <div id="mci-extendedVod-banner" class="cf" style="margin-bottom:10px;">
                  <transition name="slide-fade">
                    <div :style="vModel.extendedVod.background" style="width:100%;" v-show="vModel.extendedVod.bool">
                      <b-link :style="vModel.extendedVod.linkBox"
                              style="position:absolute;display:block;width:300px;margin: -30px 0 0 -150px;left:50%;transition:all .5s;z-index:999;">
                      <span class="d-inline-block"
                            style="vertical-align: top;width:20%;height:76px;margin-top:-8px;" :style="vModel.extendedVod.icon"/>
                        <p class="d-inline-block" style="color:#fff;width:75%;margin-left:3%;line-height: 15px;font-size:14px;vertical-align: top;">
                          {{result.headline}}
                        </p>
                      </b-link>
                      <transition name="fade">
                        <div :style="vModel.extendedVod.vimeo" v-show="vModel.extendedVod.vimeo_state">
                          <iframe
                            :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                            id="extendedVodPlayer"
                            :width="player.width - 30"
                            :height="((player.width - 30)/16*9)"
                            frameborder="0"
                            allow="autoplay"
                            webkitallowfullscreen
                            mozallowfullscreen
                            allowfullscreen>
                          </iframe>
                          <button class="mci-vimeo-mutebox" :style="`right:25px;top:` + (90 - 37 + ((player.width - 30)/16*9)) + `px;`" @click="vimeoMuteDom('extendedVodPlayer')">
                            <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                          </button>
                        </div>
                      </transition>
                      <div style="position:absolute;left:0;bottom:0;width:100%;height:auto;" v-show="vModel.extendedVod.vimeo_state">
                        <b-link :href="result.url" class="mci-tap-bar" style="background:#fff;">
                          <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                          <span class="mci-tap-bar-arrow">></span>
                        </b-link>
                      </div>
                    </div>
                  </transition>
                </div>
              </template>
              <template v-else-if="this.format === 'VOD & SHOPPING BOX'">
                <div id="mci-shoppingVod-banner" class="cf">
                  <div class="position-relative" :style="`height:` + player.height + `px;`">
                    <iframe
                      :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                      id="shoppingVodPlayer"
                      :width ="player.width"
                      :height = "player.height"
                      frameborder="0"
                      allow="autoplay"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen>
                    </iframe>
                    <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('shoppingVodPlayer','mci-shoppingVod-banner')">
                      <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                    </button>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                  </div>
                  <swiper :options="swiperOption" style="padding:7px 0 7px 7px;border:solid #dedede;border-width: 0 1px 1px;" v-if="file.itemData">
                    <swiper-slide :style="vModel.shoppingVod.slideStyle">
                      <b-link :href="result.itemData[0].url" target="_blank">
                        <img :src="result.item[0]" style="width:100%"/>
                        <p class="mci-shoppinglist-txt mci-txt-two" v-html="result.itemData[0].text"></p>
                      </b-link>
                    </swiper-slide>
                    <swiper-slide :style="vModel.shoppingVod.slideStyle">
                      <b-link :href="result.itemData[1].url" target="_blank">
                        <img :src="result.item[1]" style="width:100%"/>
                        <p class="mci-shoppinglist-txt mci-txt-two" v-html="result.itemData[1].text"></p>
                      </b-link>
                    </swiper-slide>
                    <swiper-slide :style="vModel.shoppingVod.slideStyle">
                      <b-link :href="result.itemData[2].url" target="_blank">
                        <img :src="result.item[2]" style="width:100%"/>
                        <p class="mci-shoppinglist-txt mci-txt-two" v-html="result.itemData[2].text"></p>
                      </b-link>
                    </swiper-slide>
                    <template v-if="result.itemData.length > 3">
                      <swiper-slide :style="vModel.shoppingVod.slideStyle">
                        <b-link :href="result.itemData[3].url" target="_blank">
                          <img :src="result.item[3]" style="width:100%"/>
                          <p class="mci-shoppinglist-txt mci-txt-two" v-html="result.itemData[3].text"></p>
                        </b-link>
                      </swiper-slide>
                      <template v-if="result.itemData.length > 4">
                        <swiper-slide :style="vModel.shoppingVod.slideStyle">
                          <b-link :href="result.itemData[4].url" target="_blank">
                            <img :src="result.item[4]" style="width:100%"/>
                            <p class="mci-shoppinglist-txt mci-txt-two" v-html="result.itemData[4].text"></p>
                          </b-link>
                        </swiper-slide>
                      </template>
                    </template>
                  </swiper>
                </div>
              </template>
              <template v-else-if="this.format === 'WINDOW PLAY'">
                <div id="mci-windowPlay-banner" class="cf" style="margin-bottom:10px;">
                  <div :style="vModel.windowPlay.background" style="position:relative;width:340px;height:174px;">
                    <div style="position:absolute;width:110px;right: 5%;top: 37px;">
                      <b-link :href="result.url" target="_blank">
                        <img :src="result.banner" style="width:100%;max-height:105px;"/>
                      </b-link>
                    </div>
                    <div class="position-absolute" style="top:37px;left:5%;">
                      <iframe
                        :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                        id="windowPlayPlayer"
                        :width ="180"
                        :height = "100"
                        frameborder="0"
                        allow="autoplay"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen>
                      </iframe>
                      <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('windowPlayPlayer')">
                        <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="this.format === 'DROP BANNER & VOD'">
                <div id="mci-dropVod-banner" class="cf mb-2" :style="`height:` + (player.width/6*5) + `px;`">
                  <div :style="`height:` + player.height + `px;position:relative;overflow:hidden;background:#000;`">
                    <div id="mci-dropVod-box" class="moveEffect" :style="`top: -` + player.height + `px;width:` + player.width + `px;`">
                      <div class="mci-dropVod-items" :style="`height:` + player.height + `px;`">
                        <div id="video-container" style="opacity: 0;transition:  all 2s;">
                          <iframe
                            :src = "result.video_link + `?api=1&background=1&muted=1&loop=1&autoplay=0`"
                            id="dropVodPlayer"
                            :width ="player.width"
                            :height = "player.height"
                            frameborder="0"
                            allow="autoplay"
                            webkitallowfullscreen
                            mozallowfullscreen
                            allowfullscreen>
                          </iframe>
                          <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('dropVodPlayer')">
                            <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                          </button>
                        </div>
                      </div>
                      <div class="mci-dropVod-items" style="height: 191px;">
                        <img class="mci-dropVod-img clicktag" data-clicktag="clickTAG" :src="result.main" alt="Bottom" style="height:100%">
                      </div>
                      <div id="mci-dropVod-description" class="mci-dropVod-through moveEffect" :style="`top: -` + player.height + `px;`"></div>
                    </div>
                  </div>
                  <div style="width:100%;height:auto;">
                    <b-link :href="result.url" class="mci-tap-bar" target="_blank">
                      <p class="mci-tap-bar-tit">{{file.tapbar}}</p>
                      <span class="mci-tap-bar-arrow">></span>
                    </b-link>
                    <div class="mci-tap-text">
                      <p class="mci-tap-desc mci-txt-one">{{file.desc}}</p>
                      <p class="mci-tap-tit mci-txt-one">{{file.title}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="adBuilder_box2" style="margin-top:10px;"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box1"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box1"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
            <div class="adBuilder_box2"></div>
          </div>
        </template>
        <template v-else-if="!this.file && !this.type">
          <div class="adBuilder_box2" style="margin-top:10px;"></div>
          <div class="adBuilder_box1"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box1"></div>
          <div id="adBuilder_BannerBox">
            <template v-if="this.format === 'NATIVE BANNER'">
              <div id="mci-native-banner" class="cf" style="width:100%;overflow: hidden;">
                <swiper :options="vModel.nativeBanner.swiperOption" style="padding:0;">
                  <swiper-slide v-for="(banner,index) in vModel.nativeBanner.img" :key="index">
                    <b-link href="" target="_blank">
                      <img :src="banner" :style="`width:100%;height:` + player.height + `px`"/>
                    </b-link>
                  </swiper-slide>
                  <div class="swiper-pagination swiper-pagination-white" style="width: auto;
    margin-left: 5px;" slot="pagination"></div>
                </swiper>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                  <div class="mci-tap-text">
                    <p class="mci-tap-desc mci-txt-one">리지 알만토(Lizzie Armanto)로 부터 영감을 받은 특별한 프로 스케이트 풋웨어 & 어패럴 컬렉션: 캠페인 제목</p>
                    <p class="mci-tap-tit mci-txt-one">Sponsor</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'PARALLAX'">
              <div id="mci-parallax-banner" class="mt-2 mb-2">
                <b-link>
                  <div :style="vModel.parallax.imgStyle"></div>
                </b-link>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                  <div class="mci-tap-text">
                    <p class="mci-tap-desc mci-txt-one">리지 알만토(Lizzie Armanto)로 부터 영감을 받은 특별한 프로 스케이트 풋웨어 & 어패럴 컬렉션: 캠페인 제목</p>
                    <p class="mci-tap-tit mci-txt-one">Sponsor</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'NATIVE VOD (16:9)'">
              <div id="mci-nativeVod-banner-16x9" class="cf position-relative">
                <div :style="`height:` + player.height + `px;`">
                  <iframe
                    src = "https://player.vimeo.com/video/366175010?api=1&background=1&muted=1&loop=1&autoplay=0"
                    id="nativeVodPlayer_16x9"
                    :width="player.width"
                    :height="player.height"
                    frameborder="0"
                    allow="autoplay"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen>
                  </iframe>
                  <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.height - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_16x9')">
                    <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                  </button>
                </div>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                  <div class="mci-tap-text">
                    <p class="mci-tap-desc mci-txt-one">리지 알만토(Lizzie Armanto)로 부터 영감을 받은 특별한 프로 스케이트 풋웨어 & 어패럴 컬렉션: 캠페인 제목</p>
                    <p class="mci-tap-tit mci-txt-one">Sponsor</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'NATIVE VOD (4:3)'">
              <div id="mci-nativeVod-banner-4x3" class="cf position-relative">
                <div :style="`height:` + player.width /4 *3 + `px;`">
                  <iframe
                    src = "https://player.vimeo.com/video/360223049?api=1&background=1&muted=1&loop=1&autoplay=0"
                    id="nativeVodPlayer_4x3"
                    :width="player.width"
                    :height="player.width /4 *3"
                    frameborder="0"
                    allow="autoplay"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen>
                  </iframe>
                  <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.width /4 *3 - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_4x3')">
                    <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                  </button>
                </div>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'NATIVE VOD (1:1)'">
              <div id="mci-nativeVod-banner-1x1" class="cf position-relative">
                <div :style="`height:` + player.width + `px;`">
                  <iframe
                    src = "https://player.vimeo.com/video/360226007?api=1&background=1&muted=1&loop=1&autoplay=0"
                    id="nativeVodPlayer_1x1"
                    :width="player.width"
                    :height="player.width"
                    frameborder="0"
                    allow="autoplay"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen>
                  </iframe>
                  <button class="mci-vimeo-mutebox" :style="`right:10px;top:` + (player.width - 37) + `px`" @click="vimeoMuteDom('nativeVodPlayer_1x1')">
                    <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                  </button>
                </div>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'TWO-SIDED BANNER'">
              <div id="mci-twoSided-banner">
                <div class="mci-twoSided-wrap" :style="vModel.twosided.imgStyle">
                  <div class="mci-face mci-front">
                    <img src="https://i.vimeocdn.com/video/814638704.jpg"/>
                  </div>
                  <div class="mci-face mci-back position-relative">
                    <iframe
                      src = "https://player.vimeo.com/video/360457483?api=1&background=1&muted=1&loop=1&autoplay=0"
                      id="twoSidedPlayer"
                      :width="player.width"
                      :height="player.height"
                      frameborder="0"
                      allow="autoplay"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen>
                    </iframe>
                    <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('twoSidedPlayer')">
                      <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                    </button>
                  </div>
                </div>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                  <div class="mci-tap-text">
                    <p class="mci-tap-desc mci-txt-one">리지 알만토(Lizzie Armanto)로 부터 영감을 받은 특별한 프로 스케이트 풋웨어 & 어패럴 컬렉션: 캠페인 제목</p>
                    <p class="mci-tap-tit mci-txt-one">Sponsor</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'EXTENDED VOD'">
              <div id="mci-extendedVod-banner" class="cf" style="margin-bottom:10px;">
                <transition name="slide-fade">
                  <div :style="vModel.extendedVod.background" style="width:100%;" v-show="vModel.extendedVod.bool">
                    <b-link :style="vModel.extendedVod.linkBox"
                            style="position:absolute;display:block;width:300px;margin: -30px 0 0 -150px;left:50%;transition:all .5s;z-index:999;">
                      <span class="d-inline-block"
                            style="vertical-align: top;width:20%;height:76px;margin-top:-8px;background-size:100%;background-repeat: no-repeat;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIxODkuMTcycHgiIGhlaWdodD0iMTg3LjMyNHB4IiB2aWV3Qm94PSIwIDAgMTg5LjE3MiAxODcuMzI0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxODkuMTcyIDE4Ny4zMjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnIGRpc3BsYXk9Im5vbmUiPjxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE4My4yMTEsMTgyLjA1OWgtMTc5di0xNzloMTc5VjE4Mi4wNTl6IE01LjIxMSwxODEuMDU5aDE3N3YtMTc3aC0xNzdWMTgxLjA1OXoiLz48L2c+PHBhdGggZGlzcGxheT0ibm9uZSIgZmlsbD0ibm9uZSIgZD0iTTE2NC40OSw4MC42NzVjLTAuMzM2LTEuNzMxLTAuOTUxLTMuOTY4LTIuMTgxLTUuOTc5Yy0xLjE3NC0xLjk1Ny0yLjkwNi0zLjYzMi00Ljg2LTQuMjQ4Yy0xLjI4Ni0wLjM5MS0zLjA3NC0wLjQ0NC00LjA4LTAuMzkxdjM0LjE0Nmg0LjY5M3YxLjIyOWgtMTcuOTk1di0xLjIyOWg0LjY5NVY3MC4wNTdjLTAuNzgyLTAuMDU0LTIuNjI2LTAuMDU0LTQuMDIzLDAuMzkxYy0yLjQ1OCwwLjc4NC00LjAyNCwyLjY4My00LjkxNyw0LjI0OGMtMC45NTEsMS41NjUtMS45LDMuOTY5LTIuMTI1LDUuOTc5aC0xLjU2M2wwLjMzNC0xMS44NDlsMzMuMjUxLDAuMDAxbDAuMzM1LDExLjg0OEgxNjQuNDkgTTExMi40MDgsODAuMjI5bDcuOTM3LDMuMTI4YzIuNDAyLDAuOTQ5LDQuNjQsMi4xNzksNi4zMTUsNC43NDljMS4wNjMsMS42MjEsMS43MzEsMy42MzUsMS43MzEsNi4wMzdjMCwyLjE3OC0wLjU1OCw1Ljk3OC0zLjkxMSw4Ljk0Yy0yLjY4MywyLjQwMy01LjQ3NywzLjEyOS04Ljk5OCwzLjEyOWMtMy4xODQsMC00LjUyNC0wLjU1OC02Ljg3NC0xLjMzOWMtMS42NzQtMC41NjEtMi40MDItMC44NC0zLjEyNy0wLjg0Yy0wLjUwNCwwLTEuNjIyLDAuMTY4LTIuMzQ4LDEuMzk2aC0yLjAxNGwtMC4yMjMtMTMuMDJoMS4zNDFjMC4yMjQsMC43ODMsMC44OTYsMy4zNTQsMi40MDMsNS44MTJjMS4wMDcsMS42MTksMi4zNDgsMy4xMjgsMy44LDQuMTM0YzEuMzQxLDAuOTUyLDMuODAxLDIuMTgyLDYuOTg1LDIuMTgyYzMuMTMsMCw0Ljc1LTEuMDA2LDUuMjU0LTEuMzQyYzEuNDUzLTEuMDA1LDIuNDU4LTIuNzM4LDIuNDU4LTQuNTg0YzAtNC4yNDUtMy42MzItNS42OTgtNi43NjItNi45MjhsLTYuNjQ4LTIuNjI3Yy0yLjE4MS0wLjg0LTQuMjQ3LTEuOS01Ljg2OS00LjA4Yy0xLjQ1My0xLjkwMS0xLjk1NS0zLjk2OC0xLjk1NS01Ljg2N2MwLTEuNzg3LDAuMzM0LTUuOTI0LDMuOTEyLTguNjY0YzEuODQyLTEuNDUxLDQuNDEyLTIuNDAxLDcuNi0yLjQwMWMxLjk1NSwwLDMuNjg4LDAuMzkyLDUuMDg1LDAuOTVjMS4wNjMsMC40NDcsMS44NDQsMC44MzksMi42MjYsMC44MzljMC43ODMsMCwxLjczMS0wLjQ0NywyLjM0OC0xLjAwOGgyLjAxMnYxMC4zOTZoLTEuMzQyYy0wLjc4MS0yLjM0OC0yLjA2Ny00LjYzOS0zLjQwOC02LjE0NmMtMi42ODMtMy4wMTktNS40NzctMy4zNTQtNy41NDUtMy4zNTRjLTEuNTY0LDAtMy40MDksMC4xNjgtNC44MDUsMS4yMjljLTEuMjg1LDEuMDA3LTEuNjIyLDIuMjM1LTEuNjIyLDMuNjMyYzAsMS41MSwwLjQ0NywyLjYyOCwxLjY3NywzLjY4OUMxMDkuNzI5LDc5LjM5LDExMC45MDEsNzkuNjE0LDExMi40MDgsODAuMjI5eiBNODMuNjMzLDgxLjE3OGMwLTIuMjkxLTAuNTU3LTYuOTMtMi42ODMtOS4zODljLTEuMTcyLTEuMzQzLTMuMTgzLTIuNTE1LTUuOTc4LTIuNTE1Yy0zLjQ2NSwwLTUuMzEsMS45LTUuODY5LDIuNTE1Yy0xLjU2MywxLjc4OS0yLjY4MSw1LjE5Ny0yLjY4MSw5LjM4OXYxMi4wMTdjMCwxLjk1MywwLjMzNSw0LjkxNiwxLjIyOSw2Ljk4NGMxLjUwOCwzLjUyLDQuNTI1LDQuODA0LDcuNTQzLDQuODA0YzQuNjk0LDAsNi40MjctMi44NDgsNy4yMDgtNC44MDRjMC44OTYtMi4yOTEsMS4yMjktNC44NjMsMS4yMjktNi45ODRWODEuMTc4eiBNODUuOTgsMTAyLjQ2OWMtMy4xMjksMi4zNDktNy4zMiwzLjc0NC0xMS4wMDgsMy43NDRjLTMuNTIxLDAtNy42NTYtMS4zMzktMTAuODk4LTMuNzQ0Yy01LjQ3Ni00LjAyMy03LjU0NS0xMC4yODItNy41NDUtMTUuMzEyYzAtNS4xNDIsMi4xODItMTEuMjg5LDcuNTQ1LTE1LjMxM2MzLjI0Mi0yLjQ1OCw3LjMyMi0zLjgsMTAuODk4LTMuOGMzLjc0NCwwLDcuODIzLDEuMzk3LDExLjAwOCwzLjgwMWM1LjM2NSw0LjAyMyw3LjU0NiwxMC4xMTMsNy41NDYsMTUuMzEyQzkzLjUyNiw5My40MTUsOTAuNTA4LDk5LjExNiw4NS45OCwxMDIuNDY5eiBNNTEuNzg1LDEwNS40MzFIMjAuNjU2di0xLjIyOWg0LjY5NFY3MC4wNTZoLTQuNjk0di0xLjIyOWgxNy45OTV2MS4yMjloLTQuNjk0djM0LjE0Nmg0LjA4MWMzLjg1NSwwLDcuMzE5LTEuNjc4LDkuNzc5LTQuNDczYzEuMjg0LTEuNDUxLDIuNTctMy41NzUsMy4wMTgtNi40MjZoMS41NjRMNTEuNzg1LDEwNS40MzF6Ii8+PHBhdGggZGlzcGxheT0ibm9uZSIgZmlsbD0ibm9uZSIgZD0iTTE2Mi44ODYsMTE0Ljc5MnY3LjkyNmgtMS42NHYtNy45MjZoLTIuOTc3di0xLjQxNmg3LjU5NnYxLjQxNkgxNjIuODg2IE0xNDYuOTY5LDExNC40OTJjLTEuMTEzLDAtMS43ODMsMC40ODQtMS43ODMsMS4yOThjMCwwLjg5MywwLjU3OCwwLjk0MywyLjM3NSwxLjQxNmMxLjU4NywwLjQwNiwzLjM3MSwwLjc4NywzLjM3MSwyLjc5NWMwLDIuMTEyLTEuODc2LDIuOTI2LTMuNzEzLDIuOTI2Yy0yLjIxNSwwLTMuOTM1LTEuMDUxLTMuOTM1LTMuMzA3aDEuNjE0YzAsMS40NDMsMS4wODcsMi4wMDksMi40MTIsMi4wMDljMS4yNjEsMCwyLjAwNy0wLjU1MywyLjAwNy0xLjQ3MWMwLTAuOTctMC43OTktMS4xNDMtMi4xNzYtMS40OTZjLTEuOTgyLTAuNTExLTMuNTE3LTAuODQtMy41MTctMi43NDJjMC0xLjY2NCwxLjM1MS0yLjcyOCwzLjQ1LTIuNzI4YzEuOTAxLDAsMy40MSwwLjg1MywzLjQ4OSwyLjkzOWgtMS41NjFDMTQ4Ljg5OSwxMTQuOTY0LDE0OC4xMjQsMTE0LjQ5MiwxNDYuOTY5LDExNC40OTJ6IE0xMzEuMDY4LDExNC41M2MtMS43MjEsMC0yLjgzNCwxLjM3Ny0yLjgzNCwzLjQ5YzAsMi4xNzYsMS4xMDIsMy41NDEsMi44NTksMy41NDFjMS43MDYsMCwyLjgwOC0xLjM5MiwyLjgwOC0zLjUyOUMxMzMuOTAxLDExNS44OTYsMTMyLjgsMTE0LjUzLDEzMS4wNjgsMTE0LjUzeiBNMTMxLjA2OCwxMjIuOTM5Yy0yLjY3OCwwLTQuNDg3LTEuOTgxLTQuNDg3LTQuODk0YzAtMi43NDEsMS42NTMtNC44OTMsNC41MTMtNC44OTNjMi42MzgsMCw0LjQ2LDEuOTkyLDQuNDYsNC44OTNDMTM1LjU1NCwxMjAuOTU4LDEzMy43MzEsMTIyLjkzOSwxMzEuMDY4LDEyMi45Mzl6IE0xMTIuNzExLDEyMi43MTd2LTkuMzQxaDEuNjUydjcuOTI0aDQuNzV2MS40MTdIMTEyLjcxMXogTTg5LjQ4MSwxMTQuNTNjLTEuNzE4LDAtMi44MzUsMS4zNzctMi44MzUsMy40OWMwLDIuMTc2LDEuMTA0LDMuNTQxLDIuODYxLDMuNTQxYzEuNzA0LDAsMi44MDktMS4zOTIsMi44MDktMy41MjlDOTIuMzE2LDExNS44OTYsOTEuMjEyLDExNC41Myw4OS40ODEsMTE0LjUzeiBNODkuNDgxLDEyMi45MzljLTIuNjc2LDAtNC40ODctMS45ODEtNC40ODctNC44OTRjMC0yLjc0MSwxLjY1Mi00Ljg5Myw0LjUxNC00Ljg5M2MyLjYzNywwLDQuNDYsMS45OTIsNC40Niw0Ljg5M0M5My45NjgsMTIwLjk1OCw5Mi4xNDUsMTIyLjkzOSw4OS40ODEsMTIyLjkzOXogTTc1LjA3NCwxMjIuNzE3bC00LjM1NC02Ljg3NXY2Ljg3NWgtMS41NDd2LTkuMzQxaDEuNzE3bDQuMzA0LDYuODg4di02Ljg4OGgxLjU3M3Y5LjM0MUg3NS4wNzR6IE01Ni42OTIsMTIyLjg5OWMtMi42NDksMC0zLjg1NS0xLjI0Ni0zLjg1NS0zLjgzdi01LjY5M2gxLjYzOHY2LjAyMWMwLDEuNDQyLDAuNzc0LDIuMTUxLDIuMjQ1LDIuMTUxYzEuODYxLDAsMi4xMzgtMS4wNzYsMi4xMzgtMi42NjR2LTUuNTA5aDEuNjR2NS43MTlDNjAuNDk3LDEyMS42NjcsNTkuMjExLDEyMi44OTksNTYuNjkyLDEyMi44OTl6IE00MC44NTUsMTE0LjcxNEgzOC40OHYyLjkyNmgyLjE2NmMxLjA3NCwwLDIuMTUxLTAuMTU4LDIuMTUxLTEuNDk1QzQyLjc5OCwxMTQuOTEsNDEuODM5LDExNC43MTQsNDAuODU1LDExNC43MTR6IE00Mi44NzYsMTE4LjI2OWMxLjE5NCwwLjI2MiwxLjMxMiwxLjE2OCwxLjM4OSwyLjEyNWMwLjA5MywxLjExNiwwLjExOCwxLjkwMywwLjQ5OSwyLjMyM2gtMS43NTdjLTAuMjM1LTAuMzU2LTAuMjQ5LTAuOTk5LTAuMzA0LTEuODY0Yy0wLjA5MS0xLjQ2OS0wLjQ1Ny0xLjk5My0yLjA0NC0xLjk5M0gzOC40OHYzLjg1N2gtMS42Mjh2LTkuMzQxaDQuNDIzYzEuNjc5LDAsMy4xNDgsMC42NjksMy4xNDgsMi41OThDNDQuNDI0LDExNy4xMDIsNDMuODU5LDExNy45MjgsNDIuODc2LDExOC4yNjl6IE0yNC44MzUsMTE4LjQ1M2gtMi40Mjh2Mi45MjVoMi40NTJjMS4xMDMsMCwyLjAyMS0wLjI2NCwyLjAyMS0xLjQ1NUMyNi44ODEsMTE4LjYzNywyNS44OTcsMTE4LjQ1MywyNC44MzUsMTE4LjQ1M3ogTTI0LjY5LDExNC43MDFoLTIuMjgzdjIuNTcxaDIuMjI5YzEuMjIxLDAsMS44MzgtMC4zNDEsMS44MzgtMS4yODVDMjYuNDc1LDExNC44MTksMjUuNjIxLDExNC43MDEsMjQuNjksMTE0LjcwMXogTTI2Ljc2MiwxMTcuNjkyYzEuMDYzLDAuMjYxLDEuNzU4LDEuMDYzLDEuNzU4LDIuMjY4YzAsMS42NTItMS4yMDYsMi43NTctMi45NSwyLjc1N2gtNC43NjJ2LTkuMzQxaDQuMjY0YzIuMDIsMCwzLjAzLDAuOTU5LDMuMDMsMi4zNDhDMjguMTAyLDExNi42MywyNy41NSwxMTcuMzc2LDI2Ljc2MiwxMTcuNjkyeiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTkuNjA2LDc1LjI4Yy0xLjI5My0zLjc4My0yLjIzNC02LjUxOC0zLjQyNi04LjQ3MWMtMS42NDUtMi42OTQtMy44NjMtNC4wMDctNi43NzUtNC4wMDdjLTIuOTkyLDAtNi41MiwxLjM0OS0xMi45MTYsMy43ODRsLTMxLjQzOCwxNC45OTJsMy43MDktMzVjMC4yMDMtOS40NjcsMC4yOTktMTMuNzkzLTIuNTUxLTE2LjcwNWMtMi42Ni0yLjcyMy02LjY0OC0yLjcyMy0xMi42NjgtMi43MjNjLTYuMjA3LDAtMTAuMzIxLDAtMTIuOTc3LDIuNzkxYy0yLjgzNiwyLjk1NS0yLjY0OCw3LjI2Mi0yLjIyOSwxNi42OTNsMy45OTYsMzQuOTQzTDUwLjU3NCw2Ni41NzVjLTUuODMxLTIuMTI5LTkuNjg4LTMuNTQyLTEyLjcwNi0zLjU0MmMtMi45LDAtNS4xMDQsMS4yNS02LjczNiwzLjgxM2MtMS4xODgsMS44NjQtMi4wNDUsNC4zMTItMy4zMjQsOC4xNDdjLTIuMDQ1LDYuMzQ1LTMuMTg0LDkuODM3LTEuNDUxLDEzLjEzNWMxLjg4NSwzLjU2Myw2LjA0NCw0Ljc5NSwxNS4xNjQsNy40OTJsMzQuODQsNS45MjNsLTI0LjQwMiwyNi41ODVjLTUuNzg5LDcuMjM0LTguNDIzLDEwLjU0NC03Ljg5NSwxNC40NzdjMC41MDQsMy42ODYsMy40OTUsNS44NTgsOC45NDQsOS44MDNjNC42MywzLjM1NSw3LjY4OCw1LjU1OSwxMC45OTUsNS41NTljNC43OTQsMCw3LjU2MS00LjI0NSwxMi41NjctMTEuOTY0bDE2Ljk5Ny0zMC45NjJsMTcuMzI0LDMwLjk5NmM1LjE5OSw3LjY5OSw4LjA2NCwxMS45MywxMi43OTEsMTEuOTNjMy4zMiwwLDYuMjgxLTIuMjA5LDEwLjc2Ni01LjU4YzUuNDM2LTMuOTMyLDguNDIyLTYuMTAyLDguOTE2LTkuNzgxYzAuNTQzLTMuOTM2LTIuMDk2LTcuMjQ5LTcuOTAyLTE0LjQ4MmwtMjQuNjkxLTI2LjU3OWwzNS4xMjEtNS45MTdjOS4xNzYtMi43MTIsMTMuMzU0LTMuOTQ3LDE1LjIwNy03LjUwMkMxNjIuODA4LDg0Ljg2NCwxNjEuNjAzLDgxLjI2OSwxNTkuNjA2LDc1LjI4eiIvPjwvc3ZnPg==)"/>
                      <p class="d-inline-block" style="color:#fff;width:75%;margin-left:3%;line-height: 15px;font-size:14px;vertical-align: top;">
                        WE ALLOW BRANDS TO PRODUCE CREATIVE ONLINE ADVERTISING
                      </p>
                    </b-link>
                    <transition name="fade">
                      <div :style="vModel.extendedVod.vimeo" v-show="vModel.extendedVod.vimeo_state">
                        <iframe
                          src = "https://player.vimeo.com/video/366175010?api=1&background=1&muted=1&loop=1&autoplay=0"
                          id="extendedVodPlayer"
                          :width="player.width - 30"
                          :height="((player.width - 30)/16*9)"
                          frameborder="0"
                          allow="autoplay"
                          webkitallowfullscreen
                          mozallowfullscreen
                          allowfullscreen>
                        </iframe>
                        <button class="mci-vimeo-mutebox" :style="`right:25px;top:` + (90 - 37 + ((player.width - 30)/16*9)) + `px;`" @click="vimeoMuteDom('extendedVodPlayer')">
                          <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                        </button>
                      </div>
                    </transition>
                    <div style="position:absolute;left:0;bottom:0;width:100%;height:auto;" v-show="vModel.extendedVod.vimeo_state">
                      <b-link class="mci-tap-bar" style="background:#fff;">
                        <p class="mci-tap-bar-tit">자세히보기</p>
                        <span class="mci-tap-bar-arrow">></span>
                      </b-link>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else-if="this.format === 'WINDOW PLAY'">
              <div id="mci-windowPlay-banner" class="cf" style="margin-bottom:10px;">
                <div :style="vModel.windowPlay.background" style="position:relative;width:340px;height:174px;">
                  <div style="position:absolute;width:110px;right: 5%;top: 37px;">
                    <b-link>
                      <img src="https://i.vimeocdn.com/video/811474688.jpg" style="width:100%;max-height:105px;"/>
                    </b-link>
                  </div>
                  <div class="position-absolute" style="top:37px;left:5%;height: 100px;">
                    <iframe
                      src = "https://player.vimeo.com/video/366175010?api=1&background=1&muted=1&loop=1&autoplay=0"
                      id="windowPlayPlayer"
                      :width ="180"
                      :height = "100"
                      frameborder="0"
                      allow="autoplay"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen>
                    </iframe>
                    <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('windowPlayPlayer')">
                      <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="this.format === 'DROP BANNER & VOD'">
              <div id="mci-dropVod-banner" class="cf mb-2" :style="`height:` + (player.width/6*5) + `px;`">
                <div :style="`height:` + player.height + `px;position:relative;overflow:hidden;background:#000;`">
                  <div id="mci-dropVod-box" class="moveEffect" :style="`top: -` + player.height + `px;width:` + player.width + `px;`">
                    <div class="mci-dropVod-items" :style="`height:` + player.height + `px;`">
                      <div id="video-container" style="opacity: 0;transition:  all 2s;">
                        <iframe
                          src = "https://player.vimeo.com/video/360457483?api=1&background=1&muted=1&loop=1&autoplay=0"
                          id="dropVodPlayer"
                          :width ="player.width"
                          :height = "player.height"
                          frameborder="0"
                          allow="autoplay"
                          webkitallowfullscreen
                          mozallowfullscreen
                          allowfullscreen>
                        </iframe>
                        <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('dropVodPlayer')">
                          <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                        </button>
                      </div>
                    </div>
                    <div class="mci-dropVod-items" style="height: 191px;">
                      <img class="mci-dropVod-img clicktag" data-clicktag="clickTAG" src="https://i.vimeocdn.com/video/814638704.jpg" alt="Bottom" style="height:100%">
                    </div>
                    <div id="mci-dropVod-description" class="mci-dropVod-through moveEffect" :style="`top: -` + player.height + `px;`"></div>
                  </div>
                </div>
                <div style="width:100%;height:auto;">
                  <b-link class="mci-tap-bar">
                    <p class="mci-tap-bar-tit">자세히보기</p>
                    <span class="mci-tap-bar-arrow">></span>
                  </b-link>
                  <div class="mci-tap-text">
                    <p class="mci-tap-desc mci-txt-one">리지 알만토(Lizzie Armanto)로 부터 영감을 받은 특별한 프로 스케이트 풋웨어 & 어패럴 컬렉션: 캠페인 제목</p>
                    <p class="mci-tap-tit mci-txt-one">Sponsor</p>
                  </div>
                </div>
              </div>
            </template>
            <div id="mci-shoppingVod-banner" class="cf"
                 v-show="this.format === 'VOD & SHOPPING BOX'">
              <div class="position-relative" :style="`height:` + player.height + `px;`">
                <iframe
                  src = "https://player.vimeo.com/video/360457483?api=1&background=1&muted=1&loop=1&autoplay=0"
                  id="shoppingVodPlayer"
                  :width ="player.width"
                  :height = "player.height"
                  frameborder="0"
                  allow="autoplay"
                  webkitallowfullscreen
                  mozallowfullscreen
                  allowfullscreen>
                </iframe>
                <button class="mci-vimeo-mutebox" style="right:10px;bottom:10px;" @click="vimeoMuteDom('shoppingVodPlayer','mci-shoppingVod-banner')">
                  <img id="mci-vimeo-mutebox-img" src="/../../assets/img/mute_01.jpg"/>
                </button>
              </div>
              <div style="width:100%;height:auto;">
                <b-link class="mci-tap-bar">
                  <p class="mci-tap-bar-tit">자세히보기</p>
                  <span class="mci-tap-bar-arrow">></span>
                </b-link>
              </div>
              <swiper :options="swiperOption" style="padding:7px 0 7px 7px;border:solid #dedede;border-width: 0 1px 1px;">
                <swiper-slide :style="vModel.shoppingVod.slideStyle" v-for="(banner,index) in vModel.shoppingVod.banners" :key="index">
                  <b-link href="" target="_blank">
                    <img :src="banner" style="width:100%"/>
                    <p class="mci-shoppinglist-txt mci-txt-two" v-html="vModel.shoppingVod.text[index]"></p>
                  </b-link>
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <div class="adBuilder_box2" style="margin-top:10px;"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box1"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box1"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
          <div class="adBuilder_box2"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['index', 'file', 'text', 'format', 'type'],
  created () {
    this.vimeoScript()
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true
      },
      vModel: {
        info: {
          title: 'Sample Converting...',
          desc: '약 1분정도 소요됩니다.',
          etc: '* 기다리지 않아도 저장됩니다.'
        },
        time: true,
        nativeBanner: {
          img: [
            'https://i.vimeocdn.com/video/812392461.jpg',
            'https://i.vimeocdn.com/video/812392475.jpg',
            'https://i.vimeocdn.com/video/812392449.jpg',
            'https://i.vimeocdn.com/video/812392489.jpg'
          ],
          tap: true,
          swiperOption: {
            centeredSlides: true,
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            }
          }
        },
        twosided: {
          imgStyle: {
            height: '191px',
            transform: 'rotateY(0deg)',
            transition: '0s'
          },
          bool: true,
          tap: true
        },
        parallax: {
          imgStyle: {
            width: '340px',
            height: '191px',
            background: 'url(https://i.vimeocdn.com/video/814925916.jpg) no-repeat',
            backgroundPositionX: 0,
            backgroundPositionY: 0,
            backgroundSize: '1700px 955px'
          },
          currentScroll: 0,
          tap: true
        },
        nativeVod: {
          bool: [true, true, true],
          tap: [true, true, true]
        },
        extendedVod: {
          box: {
            height: '0px'
          },
          icon: {
            background: '',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat'
          },
          bool: false,
          tap: true,
          vimeo_state: false,
          currentScroll: 0,
          background: {
            position: 'relative',
            height: '100px',
            background: '#d21f35',
            backgroundSize: '100% 322px',
            backgroundRepeat: 'no-repeat'
          },
          linkBox: {
            top: '55px'
          },
          vimeo: {
            padding: '90px 0 0 0',
            textAlign: 'center'
          }
        },
        shoppingVod: {
          ulStyle: {
            width: '580px'
          },
          slideStyle: {
            width: '95px',
            marginLeft: '7px'
          },
          banners: [
            'https://i.vimeocdn.com/video/812392461.jpg',
            'https://i.vimeocdn.com/video/812392475.jpg',
            'https://i.vimeocdn.com/video/812392449.jpg',
            'https://i.vimeocdn.com/video/812392489.jpg',
            'https://i.vimeocdn.com/video/812392434.jpg'
          ],
          text: [
            '아이템1<br>1000원',
            '아이템2<br>2000원',
            '아이템3<br>3000원',
            '아이템4<br>4000원',
            '아이템5<br>5000원'
          ],
          bool: true,
          tap: true
        },
        windowPlay: {
          background: {
            background: 'url("http://static.yieldmo.com/icons/af-beta/89735629-4e74-4c21-95b2-d0d146d801f0.jpg")',
            backgroundSize: '100%'
          },
          bool: true
        },
        DropVod: {
          bool: true,
          tap: true
        }
      },
      player: {
        width: 340,
        height: 191
      }
    }
  },
  methods: {
    vimeoScript () {
      var vimeoScript = document.createElement('script')
      vimeoScript.src = 'https://player.vimeo.com/api/player.js'
      vimeoScript.async = true
      document.head.appendChild(vimeoScript)
    },
    vimeoMuteDom: function (type, id) {
      let iframe = document.getElementById(type)
      let vimeoPlayer = new Vimeo.Player(iframe)
      vimeoPlayer.getVolume().then(function (volme) {
        if (volme === 0) {
          vimeoPlayer.setVolume(1)
          if (id === 'mci-shoppingVod-banner') {
            document.querySelector('#mci-shoppingVod-banner #mci-vimeo-mutebox-img').src = '/../../assets/img/mute_02.jpg'
          } else if (id === 'mci-nativeVod-h-banner') {
            document.querySelector('#mci-nativeVod-h-banner #mci-vimeo-mutebox-img').src = '/../../assets/img/mute_02.jpg'
          } else {
            document.getElementById('mci-vimeo-mutebox-img').src = '/../../assets/img/mute_02.jpg'
          }
        } else {
          vimeoPlayer.setVolume(0)
          if (id === 'mci-shoppingVod-banner') {
            document.querySelector('#mci-shoppingVod-banner #mci-vimeo-mutebox-img').src = '/../../assets/img/mute_01.jpg'
          } else if (id === 'mci-nativeVod-h-banner') {
            document.querySelector('#mci-nativeVod-h-banner #mci-vimeo-mutebox-img').src = '/../../assets/img/mute_01.jpg'
          } else {
            document.getElementById('mci-vimeo-mutebox-img').src = '/../../assets/img/mute_01.jpg'
          }
        }
      })
    },
    handleScroll: function (e) {
      var currentScrollPosition = e.srcElement.scrollTop
      var adBannerTop = document.getElementById('adBuilder_BannerBox').offsetTop - 70
      let screenHeight = 604
      let wrapHeight = 278
      var tapbarColor = ['#e2863b', '#922c88', '#145388', '#576a3d', '#880a1f']
      if (this.format === 'NATIVE BANNER') {
        let scrollDown = adBannerTop - screenHeight + wrapHeight
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2) + 50) {
          if (this.vModel.nativeBanner.tap) {
            this.vModel.nativeBanner.tap = false
            setTimeout(() => {
              var tapbarNum = parseInt(Math.random() * 5)
              var dom = document.getElementById('mci-native-banner')
              dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
              dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
              dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
              dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
            }, 2000)
          }
        }
      } else if (this.format === 'PARALLAX') {
        let parallaxWidth = this.player.width
        let parallaxHeight = this.player.height
        let scrollDown = adBannerTop - screenHeight + wrapHeight + 15
        let scrollSlice = (screenHeight / 2) / 25
        let num = 0
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2)) {
          if (this.vModel.parallax.tap) {
            this.vModel.parallax.tap = false
            setTimeout(() => {
              var tapbarNum = parseInt(Math.random() * 5)
              var dom = document.getElementById('mci-parallax-banner')
              dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
              dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
              dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
              dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
            }, 2000)
          }
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
              if (currentScrollPosition > scrollDown + (scrollSlice * num)) {
                this.vModel.parallax.imgStyle.backgroundPositionX = (-parallaxWidth * j) + 'px'
                this.vModel.parallax.imgStyle.backgroundPositionY = (-parallaxHeight * i) + 'px'
                num += 1
              }
            }
          }
        }
        this.vModel.parallax.currentScroll = currentScrollPosition
      } else if (this.format === 'NATIVE VOD (16:9)') {
        let iframe = document.getElementById('nativeVodPlayer_16x9')
        let vimeoPlayer = new Vimeo.Player(iframe)
        let scrollDown = adBannerTop - screenHeight + wrapHeight
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2)) {
          if (this.vModel.nativeVod.bool[0]) {
            this.vModel.nativeVod.bool[0] = false
            vimeoPlayer.play()
            if (this.vModel.nativeVod.tap[0]) {
              this.vModel.nativeVod.tap[0] = false
              setTimeout(() => {
                var tapbarNum = parseInt(Math.random() * 5)
                var dom = document.getElementById('mci-nativeVod-banner-16x9')
                dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
              }, 2000)
            }
          }
        } else {
          if (!this.vModel.nativeVod.bool[0]) {
            this.vModel.nativeVod.bool[0] = true
            vimeoPlayer.pause()
          }
        }
      } else if (this.format === 'NATIVE VOD (4:3)') {
        let iframe = document.getElementById('nativeVodPlayer_4x3')
        let vimeoPlayer = new Vimeo.Player(iframe)
        let nativeVodHeight = 285
        let scrollDown = adBannerTop - screenHeight + nativeVodHeight
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2)) {
          if (this.vModel.nativeVod.bool[1]) {
            this.vModel.nativeVod.bool[1] = false
            vimeoPlayer.play()
            if (this.vModel.nativeVod.tap[1]) {
              this.vModel.nativeVod.tap[1] = false
              setTimeout(() => {
                var tapbarNum = parseInt(Math.random() * 5)
                var dom = document.getElementById('mci-nativeVod-banner-4x3')
                dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
              }, 2000)
            }
          }
        } else {
          if (!this.vModel.nativeVod.bool[1]) {
            this.vModel.nativeVod.bool[1] = true
            vimeoPlayer.pause()
          }
        }
      } else if (this.format === 'NATIVE VOD (1:1)') {
        let iframe = document.getElementById('nativeVodPlayer_1x1')
        let vimeoPlayer = new Vimeo.Player(iframe)
        let nativeVodHeight = 370
        let scrollDown = adBannerTop - screenHeight + nativeVodHeight
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2) - 50) {
          if (this.vModel.nativeVod.bool[2]) {
            this.vModel.nativeVod.bool[2] = false
            vimeoPlayer.play()
            if (this.vModel.nativeVod.tap[2]) {
              this.vModel.nativeVod.tap[2] = false
              setTimeout(() => {
                var tapbarNum = parseInt(Math.random() * 5)
                var dom = document.getElementById('mci-nativeVod-banner-1x1')
                dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
              }, 2000)
            }
          }
        } else {
          if (!this.vModel.nativeVod.bool[2]) {
            this.vModel.nativeVod.bool[2] = true
            vimeoPlayer.pause()
          }
        }
      } else if (this.format === 'TWO-SIDED BANNER') {
        let iframe = document.getElementById('twoSidedPlayer')
        let vimeoPlayer = new Vimeo.Player(iframe)
        let scrollDown = adBannerTop - screenHeight + wrapHeight
        if (currentScrollPosition > scrollDown + (screenHeight / 4) && currentScrollPosition < scrollDown + (screenHeight / 2)) {
          if (this.vModel.twosided.bool) {
            this.vModel.twosided.bool = false
            this.vModel.twosided.imgStyle.transform = 'rotateY(180deg)'
            this.vModel.twosided.imgStyle.transition = '0.8s'
            vimeoPlayer.play()
            if (this.vModel.twosided.tap) {
              this.vModel.twosided.tap = false
              setTimeout(() => {
                var tapbarNum = parseInt(Math.random() * 5)
                var dom = document.getElementById('mci-twoSided-banner')
                dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
              }, 2000)
            }
          }
        } else {
          if (!this.vModel.twosided.bool) {
            this.vModel.twosided.bool = true
            vimeoPlayer.pause()
          }
        }
      } else if (this.format === 'EXTENDED VOD') {
        if (document.getElementById('mci-extendedVod-banner')) {
          let iframe = document.getElementById('extendedVodPlayer')
          let vimeoPlayer = new Vimeo.Player(iframe)
          let extendedVodHeight = 95
          let extendedBoxHeight = 322
          let scrollDown = adBannerTop - screenHeight + extendedVodHeight
          if (currentScrollPosition > scrollDown + 30 && currentScrollPosition < scrollDown + (extendedBoxHeight - extendedVodHeight) + 30) {
            if (this.vModel.extendedVod.bool === false) {
              this.vModel.extendedVod.bool = true
            } else {
              this.vModel.extendedVod.background.height = extendedVodHeight + (currentScrollPosition - scrollDown) - 30 + 'px'
              this.vModel.extendedVod.linkBox.top = '50%'
              if (this.vModel.extendedVod.vimeo_state) {
                this.vModel.extendedVod.vimeo_state = false
                vimeoPlayer.pause()
              }
            }
          } else {
            if (currentScrollPosition < scrollDown + 30) {
              this.vModel.extendedVod.background.height = extendedVodHeight + 'px'
            } else {
              this.vModel.extendedVod.background.height = extendedBoxHeight + 'px'
              this.vModel.extendedVod.linkBox.top = '55px'
              this.vModel.extendedVod.vimeo_state = true
              vimeoPlayer.play()
              var dom = document.getElementById('mci-extendedVod-banner')
              if (this.vModel.extendedVod.tap) {
                this.vModel.extendedVod.tap = false
                setTimeout(() => {
                  var tapbarNum = parseInt(Math.random() * 5)
                  dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                  dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                  dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                  dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
                }, 2000)
              }
            }
          }
        }
      } else if (this.format === 'VOD & SHOPPING BOX') {
        let iframe = document.getElementById('shoppingVodPlayer')
        let vimeoPlayer = new Vimeo.Player(iframe)
        let shoppingVodHeight = 327
        let scrollDown = adBannerTop - screenHeight + shoppingVodHeight
        if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2)) {
          if (this.vModel.shoppingVod.bool) {
            this.vModel.shoppingVod.bool = false
            vimeoPlayer.play()
            if (this.vModel.shoppingVod.tap) {
              this.vModel.shoppingVod.tap = false
              setTimeout(() => {
                var tapbarNum = parseInt(Math.random() * 5)
                var dom = document.getElementById('mci-shoppingVod-banner')
                dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
              }, 2000)
            }
          }
        } else {
          if (!this.vModel.shoppingVod.bool) {
            this.vModel.shoppingVod.bool = true
            vimeoPlayer.pause()
          }
        }
      } else if (this.format === 'WINDOW PLAY') {
        if (document.getElementById('mci-windowPlay-banner')) {
          let iframe = document.getElementById('windowPlayPlayer')
          let vimeoPlayer = new Vimeo.Player(iframe)
          let windowPlayHeight = 174
          let scrollDown = adBannerTop - screenHeight + windowPlayHeight + 50
          if (currentScrollPosition > scrollDown && currentScrollPosition < scrollDown + (screenHeight / 2) + 50) {
            if (this.vModel.windowPlay.bool) {
              this.vModel.windowPlay.bool = false
              vimeoPlayer.play()
            }
          } else {
            if (!this.vModel.windowPlay.bool) {
              this.vModel.windowPlay.bool = true
              vimeoPlayer.pause()
            }
          }
        }
      } else if (this.format === 'DROP BANNER & VOD') {
        if (document.getElementById('mci-dropVod-banner')) {
          let iframe = document.getElementById('dropVodPlayer')
          let vimeoPlayer = new Vimeo.Player(iframe)
          let scrollDown = adBannerTop - screenHeight + wrapHeight
          if (currentScrollPosition > scrollDown + (screenHeight / 4) && currentScrollPosition < scrollDown + (screenHeight / 2)) {
            if (this.vModel.DropVod.bool) {
              // down
              document.getElementById('mci-dropVod-box').style.top = '0px'
              document.getElementById('mci-dropVod-description').style.top = '0px'
              document.getElementById('mci-dropVod-box').setAttribute('class', 'moveEffect scaleEffect')
              setTimeout(() => {
                document.getElementById('mci-dropVod-box').setAttribute('class', 'moveEffect')
                document.getElementById('video-container').style.opacity = '1'
                vimeoPlayer.play()
                if (this.vModel.DropVod.tap) {
                  this.vModel.DropVod.tap = false
                  setTimeout(() => {
                    var tapbarNum = parseInt(Math.random() * 5)
                    var dom = document.getElementById('mci-dropVod-banner')
                    dom.querySelector('.mci-tap-bar').style.background = tapbarColor[tapbarNum]
                    dom.querySelector('.mci-tap-bar').style.border = '1px solid ' + tapbarColor[tapbarNum]
                    dom.querySelector('.mci-tap-bar-tit').style.color = '#fff'
                    dom.querySelector('.mci-tap-bar-arrow').style.color = '#fff'
                  }, 2000)
                }
              }, 500)
              this.vModel.DropVod.bool = false
            }
          } else {
            if (!this.vModel.DropVod.bool) {
              // up
              document.getElementById('mci-dropVod-box').style.top = '-191px'
              document.getElementById('mci-dropVod-description').style.top = '-191px'
              document.getElementById('mci-dropVod-box').setAttribute('class', 'moveEffect scaleEffect')
              setTimeout(() => {
                document.getElementById('mci-dropVod-box').setAttribute('class', 'moveEffect')
                vimeoPlayer.pause()
              }, 500)
              this.vModel.DropVod.bool = true
            }
          }
        }
      }
    }
  },
  computed: {
    result () {
      if (this.file) {
        return this.file
      } else {
        return ''
      }
    }
  },
  watch: {
    file: function (val) {
      if (val) {
        if (['NATIVE VOD (16:9)', 'NATIVE VOD (4:3)', 'NATIVE VOD (1:1)', 'TWO-SIDED BANNER', 'WINDOW PLAY', 'DROP BANNER & VOD'].includes(this.format)) {
          setTimeout(() => {
            if (this.file) {
              this.vModel.time = false
            }
          }, 60000)
        }
        if (this.format === 'TWO-SIDED BANNER') {
          this.vModel.twosided.bool = true
          this.vModel.twosided.imgStyle.transform = 'rotateY(0deg)'
          this.vModel.twosided.imgStyle.transition = '0.5s'
        } else if (this.format === 'PARALLAX') {
          this.vModel.time = false
          this.vModel.parallax.imgStyle.background = 'url("' + val.parallax[0] + '")'
        } else if (this.format === 'NATIVE BANNER') {
          this.vModel.time = false
        } else if (this.format === 'EXTENDED VOD') {
          this.vModel.extendedVod.background.background = 'url("' + val.bg + '")'
          this.vModel.extendedVod.icon.background = 'url("' + val.icon + '")'
        } else if (this.format === 'VOD & SHOPPING BOX') {
          setTimeout(() => {
            if (this.file) {
              this.vModel.time = false
            }
          }, 30000)
        } else if (this.format === 'WINDOW PLAY') {
          this.vModel.windowPlay.background.background = 'url("' + val.bg + '")'
        }
      }
    },
    index: function () {
      document.getElementById('mobile-com').scrollTop = 0
      document.querySelector('.mci-tap-bar').style.background = '#fff'
      document.querySelector('.mci-tap-bar').style.border = '1px solid #dedede'
      document.querySelector('.mci-tap-bar-tit').style.color = '#141414'
      document.querySelector('.mci-tap-bar-arrow').style.color = '#141414'
    },
    format: function () {
      this.vModel.parallax.bool = true
    }
  }
}
</script>
