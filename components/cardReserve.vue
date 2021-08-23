<template>
  <div>
    <div
      class="card card-border-color card-border-color-success"
      v-for="(user, index) in reservedList"
      :key="index"
    >
      <div class="card-header">
        <h2 class="my-0 py-0">
          รหัสการจองคิว
          <span style="font-weight: bolder" class="float-right">{{
            user.registerCode
          }}</span>
        </h2>
      </div>
      <div class="card-body">
        <h4 class="">
          {{ `${user.prefix} ${user.firstName} ${user.lastName}` }}
          <span class="ms-3" style="color: gray; font-style: italic"
            >({{ user.idCardNumber }})</span
          >
        </h4>
        <h4 class="">
          วันที่ {{ user.date | transformDate }},
          <span class="ms-3">{{ user.time | transformTime }}</span>
        </h4>
        <h4 class="">หน่วยงาน : {{ user.organization }}</h4>
        <a class="card-link text-center" href="#"></a>
        <button
          class="btn btn-secondary btn-block"
          @click="openPostRegisterModal(user.entityId)"
        >
          อ่านรายละเอียดวันมาใช้บริการ
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="activeModal"
      class="modal-container modal-effect-1"
      id="md-post-register"
    >
      <div class="modal-content">
        <div class="modal-body">
          <div class="card card-border">
            <div class="card-header card-header-divider">
              เงื่อนไขในวันมาใช้บริการ
            </div>
            <div class="card-body">
              <p class="" v-html="preRegisterVuex"></p>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <button
                class="btn btn-secondary btn-lg btn-block"
                @click="closeModal"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
import RowComponent from "./rowDisplay.vue";
import { formatDate, formatTime } from "../static/transform";
import _ from 'lodash-core';
export default {
  components: {
    RowComponent,
  },
  props: {
    reservedList: { type: Array, required: true },
    page: { type: String, required: true },
  },
  filters: {
    transformDate(date) {
      if (!date) return "-";
      return formatDate(date);
    },
    transformTime(time) {
      if (!time) return "-";
      return formatTime(time);
    },
  },
  computed: {
    preRegisterVuex() {
      return this.$store.state.appState.preRegisterText;
    },
  },
  data() {
    return {
      activeModal: false,
    };
  },
  methods: {
    transformDate(date) {
      if (!date) return "-";
      return formatDate(date);
    },
    transformTime(time) {
      if (!time) return "-";
      return formatTime(time);
    },

    async openPostRegisterModal(entityId) {
      await this.$store.dispatch("appState/fetchInformationRegister", {
        type: "pre_register",
        entityId: entityId,
      });

      this.activeModal = true;
      setTimeout(function () {
        const myModalEl = document.getElementById("md-post-register");
        myModalEl.classList.add("modal-show");
      }, 10);
    },
    closeModal() {
      this.activeModal = false;
      const myModalEl = document.getElementById("md-post-register");
      myModalEl.classList.remove("modal-show");
    },
  },
};
</script>

<style scoped>
.modal-content {
  width: 80%;
  z-index: 1050;
}
#md-post-register {
  font-size: 1.2rem;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #111;
  opacity: 0.9;
}
</style>
