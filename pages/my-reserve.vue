<template>
  <div>
    <nav class="navbar navbar-expand fixed-top be-top-header">
      <div class="container-fluid">
        <div class="be-right-navbar">
          <ul class="nav navbar-nav d-flex flex-row float-right">
            <li
              class="nav-item"
              style="width: 36px"
              @click="backStep"
              v-if="showBackPage"
            >
              <a class="nav-link" href="#">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                    style="color: white; font-size: 2rem"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span class="user-name" style="font-size: 1.3rem"
                  >ข้อมูลการจองคิวของฉัน</span
                >
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="be-content">
      <div class="main-content container">
        <div class="card">
          <div class="card-body">
            <div class="mt-3">
              <div class="input-group mb-3">
                <input
                  class="form-control"
                  type="text"
                  :placeholder="identityType === 0 ? 'เลขบัตรประชาชน(ไม่ต้องขีด)' : identityType"
                  v-model="searchString"
                  @change="inputSearch"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="searchMyReserve"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>
            </div>

            <p class="text-left" v-if="reserveList && reserveList.length > 0">
              ข้อมูลการจองทั้งหมด
              {{ reserveList ? reserveList.length : "0" }} คิว
            </p>

            <div
              class="alert alert-dark alert-dismissible"
              :class="[alertColor]"
              role="alert"
              v-if="showNotFound"
            >
              <div class="icon">
                <span class="mdi mdi-close-circle-o"></span>
              </div>
              <div class="message">
                <p class="text-center">ไม่พบประวัติการจองคิว</p>
              </div>
            </div>
          </div>
        </div>

        <CardMyReserve :reservedList="reserveList" page="myReserve" />

        <SplashFooter />
      </div>
    </div>
  </div>
</template>

<script>
import CardMyReserve from "../components/cardReserve.vue";
import SplashFooter from "../components/SlpashFooter.vue";
export default {
  components: {
    CardMyReserve,
    SplashFooter,
  },
  computed: {
    identityType() {
      return this.$store.state.appState?.organizationData?.identityType || 0;
    },
    myReserveListVuex() {
      return this.$store.state.myReserve.myReserveList;
    },
    alertColor() {
      if (this.myReserveListVuex.length > 0) {
        return "alert-success";
      }

      return "alert-secondary";
    },
  },
  mounted() {
    this.searchString = "";
    this.reserveList = [];

    this.$store.commit("appState/setState", { key: "isLoading", payload: true });
    setTimeout(() => {
      const isCheckQueue = localStorage.getItem('isCheckQueue') 
      if (isCheckQueue) {
        this.showBackPage = false;
      }
      this.$store.commit("appState/setState", { key: "isLoading", payload: false });
    }, 1000);
  },
  data() {
    return {
      searchString: "",
      reserveList: [],
      showNotFound: false,
      showBackPage: true,
    };
  },
  methods: {
    inputSearch() {
      this.showNotFound = false;
    },
    async searchMyReserve() {
      if (this.searchString == "") {
        return;
      }

      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });

      await this.$store.dispatch(
        "myReserve/fetchAllMyReserved",
        this.searchString
      );

      setTimeout(() => {
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: false,
        });
        this.reserveList = this.myReserveListVuex;

        if (
          this.myReserveListVuex &&
          this.myReserveListVuex.length == 0 &&
          this.searchString !== ""
        ) {
          this.reserveList = [];
          return (this.showNotFound = true);
        }

        return (this.showNotFound = false);
      }, 1200);
    },
    backStep() {
      return this.$router.push("/");
    },
  },
};
</script>

<style scoped>
</style>
