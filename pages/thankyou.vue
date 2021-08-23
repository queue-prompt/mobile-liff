<template>
  <div>
    <nav class="navbar navbar-expand fixed-top be-top-header">
      <div class="container-fluid">
        <div class="be-right-navbar">
          <ul class="nav navbar-nav d-flex flex-row float-right be-user-nav">
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                data-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                <span class="user-name" style="font-size: 1.3rem">
                  {{ organizationData.organization }}</span
                ></a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="be-content">
      <div class="main-content container px-3">
        <div class="row">
          <div class="col-12">
            <div
              class="alert alert-success alert-icon alert-dismissible"
              role="alert"
            >
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <h3>จองสำเร็จ !</h3>
                <ul class="">
                  <li class="">
                    <p class="">
                      กรุณาบันทึกหน้าจอนี้ หรือจดรหัสการไว้<br />
                      เพื่อให้เจ้าหน้าที่ตรวจสอบในวันมารับบริการ
                    </p>
                  </li>
                  <li class="">
                    <p class="">ท่านสามารถ ตรวจสอบ คิวภายหลังได้ดังนี้</p>
                  </li>
                  <ol>
                    <li class="">
                      <p class="">หน้าแรกของการจอง เลือกตรวจคิว</p>
                    </li>
                    <li class="">
                      <p class="">
                        Website :
                        <a
                          class="btn btn-outline-primary"
                          href="https://xn--42c6cjhs2b6b5k.com/"
                          >คิวพร้อม.com</a
                        >
                      </p>
                    </li>
                    <!-- <li class="">
                      <p class="">
                        Line id :
                        <code class="ms-3" style="font-size: 1.2rem"
                          >@คิวพร้อม.com</code
                        >
                        <a
                          class="mt-1"
                          style="line-height: 48px"
                          href="https://lin.ee/5AN2aAF"
                          ><img
                            src="https://i.imgur.com/QaPFuzo.png"
                            alt="เพิ่มเพื่อน"
                            height="36"
                            border="0"
                        /></a>
                        <br />

                        กดที่นี่เพื่อเพิ่มเพื่อน
                      </p>
                    </li> -->
                  </ol>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-12" id="userQueues">
            <card-reserve :reservedList="reservedList" page="thankyou" />
          </div>

          <div class="col-12 mb-5">

            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-primary btn-lg" @click="newRegister">
                จองเพิ่มให้บุคคลอื่น
              </button>
            </div>
          </div>
        </div>

        <SplashFooter />
      </div>
    </div>
  </div>
</template>

<script>
import SplashFooter from "../components/SlpashFooter.vue";

import Swal from "sweetalert2";
import RowComponent from "../components/rowDisplay.vue";
import CardReserve from "../components/cardReserve.vue";
import { mapState } from "vuex";

export default {
  components: {
    RowComponent,
    CardReserve,
    SplashFooter,
  },
  computed: {
    ...mapState({
      userReservedVuex: (state) => state.appState.userReservedList,
      organizationData: (state) => state.appState.organizationData,
    }),
    canReserve() {
      return this.$store.state.appState.canReserve;
    },
  },
  async mounted() {
    if (this.userReservedVuex.length == 0) {
      return this.$router.push("/");
    }

    if (this.$route.params.from == "reserve") {
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });
      await setTimeout(() => {
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: false,
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "สำเร็จ !",
          text: "คุณได้จองคิวสำเร็จ",
          showConfirmButton: false,
          timer: 2500,
        });
      }, 1200);
    }

    this.reservedList = this.userReservedVuex;
  },
  data() {
    return {
      reservedList: [],
    };
  },

  methods: {
    newRegister() {
      this.$store.dispatch("reserve/newRegisterQueue");
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });

      setTimeout(() => {
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: false,
        });
        if (this.canReserve == false) {
          commit("setState", { key: "entityShutdown", payload: true });
          commit("setState", {
            key: "entityShutdownText",
            payload: `ยังไม่เปิดให้บริการ กรุณาลองใหม่ในภายหลัง`,
          });
        }

        this.$router.push("/");
      }, 1000);
    },
  },
};
</script>

<style scoped>
</style>
