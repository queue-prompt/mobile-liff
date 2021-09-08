<template>
  <div class="">
    <div class="">
      <div class="">
        <div class="main-content container-fluid px-3">
          <div class="splash-container">
            <div
              style="margin-top: -20px"
              class="card card-border-color card-border-color-primary"
            >
              <div class="card-header">
                <img
                  v-if="defaultLogo == false && organizationData.organization"
                  class="logo-img img-fluid"
                  :src="organizationData.image"
                  @error="setAltImg"
                  alt="logo"
                  style="object-fit: cover; max-height: 120px"
                />

                <img
                  v-else
                  class="logo-img img-fluid"
                  src="~assets/img/logo_80h.png"
                  alt="logo"
                  style="object-fit: cover; max-height: 150px"
                />

                <h3 class="">
                  {{ organizationData.organization }}
                </h3>
              </div>

              <div class="card-body">
                <form class="">
                  <div class="row text-center">
                    <h3>ระบบลงทะเบียนจองคิว</h3>
                    <h3 v-if="organizationData.type == '100' || organizationData.type == '200'">
                      {{ organizationData.type | getEventType }}
                    </h3>

                    <h3 v-else>
                      {{ organizationData.type }}
                    </h3>


                    <h4 class="">
                      {{
                        organizationData.price
                          ? `( มีค่าใช้จ่าย ${organizationData.price} บาท )`
                          : ""
                      }}<span></span>
                    </h4>
                  </div>

                  <div class="card mt-3 card-border mb-0">
                    <div class="card-boby card-subtitle text-center p-2">
                      <p class="">
                        ตารางจองคิว <br />
                        <strong style="background: yellow"
                          >(ระบบจะเปิดรับจองล่วงหน้า 1 วันเท่านั้น)</strong
                        >
                      </p>
                      <p class="" v-for="d in dateList" :key="d.date">
                        {{ d.date | thaiDate }}
                        <span class="ml-2"
                          >เปิดรับทั้งหมด {{ d.open }} คิว</span
                        >
                      </p>
                      <!-- <p class="">ดูตารางทั้งหมด</p> -->
                    </div>
                  </div>
                  <div class="form-group login-submit">
                    <p class="text-secondary text-end" style="color: '#ccc'" v-if="isReserved && canReserve">
                      <em>( ระบบจะอัพเดตทุก 5 นาที )</em> 
                    </p>
        
                    <h5 v-if="todayReserve && !entityShutdown">
                      วันที่ {{ todayReserve.date | thaiDate }}:

                      <span class="ml-1"
                        >เปิดรับ {{ todayReserve.open }} คิว</span
                      >
                      <span class="float-right"
                        >เหลือ
                        {{ todayReserve.open - todayReserve.reserve }} คิว</span
                      >
                    </h5>

                    <h5 v-if="entityShutdownText !== ''" class="text-center">
                      <span class="ml-2 text-danger">{{
                        entityShutdownText
                      }}</span>
                    </h5>

                    <button
                      :disabled="!canReserve"
                      type="button"
                      class="btn btn-primary btn-xl"
                      @click="next('register')"
                    >
                      เริ่มจองคิว
                    </button>

                    <!-- <button
                      type="button"
                      class="btn btn-info btn-lg mt-3"
                      @click="next('dashboard')"
                    >
                      สถานที่ที่เปิดให้บริการ
                    </button> -->
                    <button
                      type="button"
                      class="btn btn-secondary mt-3"
                      @click="next('my-reserve')"
                    >
                      ตรวจสอบคิว
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <SplashFooter />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SplashFooter from "../components/SlpashFooter.vue";
import _ from "lodash-core";
import { mapState } from "vuex";
export default {
  components: {
    SplashFooter,
  },
  data() {
    return { 
      defaultLogo: false,
      isReserved: false
    };
  },
  computed: {
    ...mapState({
      entityId: (state) => state.appState.entityId,
      organizationData: (state) => state.appState.organizationData,
      dateList: (state) => state.appState.dateReserve,
      canReserve: (state) => state.appState.canReserve,
      entityShutdown: (state) => state.appState.entityShutdown,
      entityShutdownText: (state) => state.appState.entityShutdownText,
    }),
    todayReserve() {
      const dataReserve = this.$store.state.appState.dateReserve;
      const tomorrowObj = _.head(dataReserve);
      return tomorrowObj;
    },
  },
  filters: {
    getEventType(type) {
      if (!type) return "";

      switch (type) {
        case "100":
          return "ตรวจโควิด-19";

        case "200":
          return "ฉีดวัคซีนโควิด-19";

        default:
          return "-";
      }
    },
    thaiDate(yyyymmdd) {
      let [yyyy, mm, dd] = yyyymmdd.split("-");
      const MM = [
        " ",
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",

        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ];
      return `${dd} ${MM[parseInt(mm)]} ${parseInt(yyyy) + 543}`;
    },
  },
  watch: {
    todayReserve(newData) {
      if(newData) {
        this.getPrevReserveData(newData)
      }
    }
  },
  mounted() {
    if(this.todayReserve) {
      this.getPrevReserveData(this.todayReserve)
    }
  },
  methods: {
    getPrevReserveData(dateData) {
      const dateLocalStorage = localStorage.getItem(`r:${this.entityId}:${dateData.date}`)
      if(dateLocalStorage) {
        this.isReserved = true
      }
    },
    async next(page) {
      if (page == "register") {
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: true,
        });
        await this.$store.dispatch("appState/fetchInformationRegister", {
          type: "pre_register",
          entityId: this.entityId,
        });
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: false,
        });
      }

      this.$router.push(`/${page}`);
    },
    setAltImg(event) {
      this.defaultLogo = true;
    },
  },
};
</script>

<style scoped>
.splash-container {
  margin-top: -16px;
}
</style>


