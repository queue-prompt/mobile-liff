<template>
  <div class="">
    <div class="card">
      <div class="card-header card-header-divider">
        เลือกวันนัดหมาย <span class="text-danger">*</span>
        <button
          @click="reloadTimeSlot"
          class="btn btn-secondary btn-sm float-right"
        >
          Refresh
          <i class="bi bi-arrow-repeat"></i>
        </button>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-12" style="min-height: 65vh; height: auto">
            <div 
              style="overflow-x: hidden; overflow-y: auto;" 
              :style="dateSlots && dateSlots.length < 7 ? 'height: auto;' : 'height:200px;' "
            >
              <div class="row row-cols-3 mt-3 mx-auto" v-if="dateSlots && dateSlots.length > 0">
                <div
                  class="col mb-2"
                  v-for="(date, index) in dateSlots"
                  :key="index"
                >
                  <input
                    type="radio"
                    class="btn-check"
                    name="reserve-date-name"
                    :id="`reserve-date-${index}`"
                    autocomplete="off"
                    @change="selectReserveDate(date.date, 'reserveDate')"
                    :disabled="date.date < todayDate || !date.active"
                  />
                  <label
                    class="btn btn-outline-primary"
                    :for="`reserve-date-${index}`"
                    style="min-height: 62px; height: auto; min-width: 70px;"
                  >
                    <div>{{ date.date | getDateNumber }}</div>
                    <div>{{ date.date | getMountName }}</div>
                  </label>
                </div>
              </div>
            </div>

            <div class="my-3"></div>

            <div>
              <!-- Warning to revisit -->
              <div  class="text-danger text-center mt-5" v-if="!validateReserve && !validateSameDate && reserveDate == ''">
                <hr />
                <h4>กรุณาเลือกวันนัดหมาย</h4>
              </div>

              <div v-if="validateReserve" class="text-danger text-center mt-5">
                <hr />
                <h4>วันที่เลือกจะเปิดให้บริการจองคิว</h4>
                <h4>
                  ในวันที่ {{ validateReserveDateText | getDateTh }} 
                </h4>
                <h4>
                  ตั้งแต่เวลา 09:00 น.
                </h4>
              </div>

              <div v-if="validateSameDate" class="text-danger text-center mt-5">
                <hr />
                <h4>คุณได้ทำการจองคิว</h4>
                <h4>ในวันที่ {{ reserveDate | getDateTh }} ไปแล้ว</h4>
              </div>

              <table
                class="table mt-3"
                style="font-size: 1.5rem; cursor: pointer"
                v-if="timeslotList && timeslotList.length > 0 && !validateSameDate"
              >
                <thead>
                  <tr>
                    <th scope="col" colspan="2">เลือกเวลานัดหมาย <span class="text-danger">*</span></th>
                    <th scope="col" class="text-center">คิวว่าง</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(data, index) in timeslotList"
                    :key="index"
                    class="align-middle"
                    :class="[classRowActive(index, rowActive)]"
                    @click.stop="selectReserveTime(data.time, index, data)"
                  >
                    <td style="width: 8%">
                      <CheckBox
                        :checked="reserveTime == data.time"
                        :isDisabled="data.open - data.reserve == 0 "
                      />
                    </td>
                    <td class="text-teft ml-0 pl-0">
                      {{ data.time | getFormatTime }}
                    </td>
                    <td class="text-center">
                      <span class="bold em">{{ data | calRestOfQueue(entityIdVuex, reserveDate) }} </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Button reserve -->
          <div class="col-12 mt-4">
            <div class="row">
              <div class="col">
                <button
                  class="btn btn-primary btn-xl w-100"
                  @click="openModalConfirm"
                  :disabled="!canReserve"
                >
                  จอง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="activeModal"
      class="modal-container modal-effect-1"
      id="md-confirm-reserve"
      style="perspective: none"
    >
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center mt-3 mb-5">
            <h4 class="fw-bold">คุณต้องการจองคิว</h4>
            <div class="my-5 fw-bold">
              <h3>วันที่ {{ reserveDate | getDateTh }}</h3>
              <h3>เวลา {{ reserveTime | getFormatTime }}</h3>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-12 mb-3">
              <button
                type="button"
                class="btn btn-primary btn-xl btn-block"
                @click="submitReserve"
              >
                ยืนยันการจอง
              </button>
            </div>

            <div class="col-12">
              <button
                type="button"
                class="btn btn-secondary btn-lg btn-block"
                @click="closeModalConfirm"
              >
                ยกเลิก
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
import _ from 'lodash-core';
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { formatTime, formatDate, monthNameById } from "../../static/transform";
import { mapState } from "vuex";
import CheckBox from "../CheckBock.vue";
export default {
  components: {
    CheckBox,
  },
  computed: {
    ...mapState({
      entityIdVuex: (state) => state.appState.entityId,
      entityDataVuex: (state) => state.appState.organizationData,
      userIdVuex: (state) => state.appState.userId,
      timeslotListVuex: (state) => state.reserve.timeslotList,
      userFormVuex: (state) => state.appState.user,
      diff_ms: (state) => state.appState.diff_ms,
    }),
    dateReserveVuex() {
      const reserveMode = this.entityDataVuex.reserveMode  == 1 ? 1 : 0
      const dataReserveList = this.$store.state.appState.dateReserve

      if(reserveMode == 0) {
        const reserveValue = this.entityDataVuex.reserveValue ? this.entityDataVuex.reserveValue : 1
        return _.take(dataReserveList, reserveValue)
      }

      if(reserveMode == 1) {
        return _.take(dataReserveList, 30)
      }
    },
    canReserve() {
      if (this.reserveDate == "") return false;
      if (this.reserveTime == "") return false;

      return true;
    },
  },
  filters: {
    getDateNumber(date) {
      if (!date || date == '') return "-";
      const dateNumber = date.split("-")[2];
      return parseInt(dateNumber);
    },
    getMountName(date) {
      if (!date || date == '') return "-";
      return monthNameById(date);
    },
    getDateTh(date) {
      if (!date || date == '') return "-";
      return formatDate(date);
    },
    getFormatTime(time) {
      if (!time || time == '') return "-";
      return formatTime(time);
    },
    calRestOfQueue(data, entityId, reserveDate) {
      const restOfQueue = data.open - data.reserve;
      let localTimeSlots = localStorage.getItem(`t:${entityId}:${reserveDate}:${data.time}`);

      if(localTimeSlots) {
        return 'เต็ม'
      }

      if (restOfQueue > 0) {
        return restOfQueue;
      } else {
        return "เต็ม";
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    if (!this.userFormVuex.idCardNumber) {
      this.$router.push("/");
    }

    if (this.dateReserveVuex.length == 0) {
      Swal.fire({
        icon: "error",
        title: "ไม่พบข้อมูล",
        text: "ยังไม่เปิดให้บริการจองคิว",
        showConfirmButton: true,
        confirmButtonText: "ปิดหน้าต่าง",
        allowOutsideClick: false,
      });
    }

    this.dateSlots = this.dateReserveVuex;
  },
  data() {
    return {
      activeModal: false,
      loading: true,
      dateSlots: {},
      timeslotList: [],

      todayDate: dayjs().format("YYYY-MM-DD"),

      reserveDate: "",
      reserveTime: "",

      validateTimeslot: false,
      validateSameDate: false,
      validateReserve: false,
      validateReserveDateText: "",

      rowActive: -1,
    };
  },

  methods: {
    async reloadTimeSlot() {
      if (this.reserveDate == "") return;

      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });

      await this.$store.dispatch("reserve/getTimeSlots", this.reserveDate);
      
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: false,
      });

      if (!this.validateReserve && !this.validateSameDate) {
        this.timeslotList = this.timeslotListVuex;
      }

      this.reserveTime = "";
    },
    async checkModeAdvance() {
      const today = dayjs().add(this.diff_ms, 'ms');

      const transformReserveDate = `${this.reserveDate}T09:00:00`
      const timestamp = dayjs(transformReserveDate)
      const timeDiffDay = timestamp.diff(today, "day");
      const reserveValue = this.entityDataVuex.reserveValue ? this.entityDataVuex.reserveValue : 1

      const canReserveDate = dayjs(this.reserveDate)
        .subtract(reserveValue, "day") 
        .format("YYYY-MM-DD");

      // console.log(timeDiffDay, reserveValue, canReserveDate)
      if (timeDiffDay >= reserveValue) {
        this.validateReserveDateText = canReserveDate;
        this.validateReserve = true;
        return false;
      }

      this.validateReserveDateText = "";
      this.validateReserve = false;
      return true;

    },
    checkModeAll() {
      const reserveDateEntity = this.entityDataVuex.reserveDate
      const today = dayjs();
      const timestamp = dayjs(reserveDateEntity);
      const timeDiffDay = timestamp.diff(today, "day");


      if(timeDiffDay > 0) {
        this.validateReserveDateText = reserveDateEntity;
        this.validateReserve = true;
        return false;
      }

      this.validateReserveDateText = "";
      this.validateReserve = false;
      return true;
    },
    async checkDateRange() {
      this.reserveTime = "";

      const reserveMode = this.entityDataVuex.reserveMode  == 1 ? 1 : 0

      if(reserveMode == 0) {
        return await this.checkModeAdvance()
      }

      if(reserveMode == 1) {
        return this.checkModeAll()
      }
    },
    async selectReserveDate(value) {
      this.reserveDate = value;
      this.timeslotList = [];

      const isSame = this.isReserveSameDate();
      if (isSame) {
        this.validateReserve = false;
        return;
      }

      const inDateRange = await this.checkDateRange();

      if (!inDateRange) return;
      this.loading = true;
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });
      await this.$store.dispatch("reserve/getTimeSlots", this.reserveDate);
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: false,
      });
      this.loading = false;

      this.timeslotList = this.timeslotListVuex;
      this.reserveTime = "";

      if (this.timeslotListVuex.length == 0 || 1)
        return (this.validateTimeslot = true);
      this.validateTimeslot = false;
    },
    selectReserveTime(time, rowIndex, data) {
      if (data.open - data.reserve == 0) {
        return;
      }
      this.reserveTime = time;
      this.rowActive = rowIndex;
      var self = this;
      setTimeout(function () {
        self.rowActive = -1;
      }, 150);
    },
    openModalConfirm() {
      this.activeModal = true;

      setTimeout(function () {
        const myModalEl = document.getElementById("md-confirm-reserve");
        myModalEl.classList.add("modal-show");
      }, 10);
    },
    closeModalConfirm() {
      const myModalEl = document.getElementById("md-confirm-reserve");
      myModalEl.classList.remove("modal-show");
      this.activeModal = false;
    },
    isReserveSameDate() {
      const localUserReserve = localStorage.getItem(
        `${this.entityIdVuex}:${this.reserveDate}:${this.userIdVuex}`
      );
      if (localUserReserve) {
        this.validateSameDate = true;
        return true;
      }
      this.validateSameDate = false;
      return false;
    },
    async submitReserve() {
      this.closeModalConfirm();

      const payload = {
        date: this.reserveDate,
        time: this.reserveTime,
      };

      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });
      const resultReserve = await this.$store.dispatch(
        "reserve/registerQueue",
        payload
      );

      if (resultReserve) {
        await this.$store.dispatch("appState/fetchUserReserved");
        this.$store.commit("appState/setState", {
          key: "isLoading",
          payload: true,
        });
        return this.$router.push({
          name: "thankyou",
          params: { from: "reserve" },
        });
      }

      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: false,
      });

      const isSame = this.isReserveSameDate();
      if (isSame) {
        this.reserveTime = "";
        this.validateReserve = false;
        return;
      }

      await this.reloadTimeSlot();
      this.reserveTime = "";
    },

    classRowActive(tableRow, activeRow) {
      return tableRow == activeRow ? "rowActive" : "";
    },
  },
};
</script>

<style scoped>
.btn-check:disabled + .btn,
.btn-check[disabled] + .btn {
  border-color: #b3b3b3;
  color: #b3b3b3;
}

.rowActive {
  background-color: aliceblue;
}

.btn-check:active + .btn-outline-primary,
.btn-check:checked + .btn-outline-primary,
.btn-outline-primary.active,
.btn-outline-primary.dropdown-toggle.show,
.btn-outline-primary:active {
  background-color: #10a254;
  border-color: #10a254;
}

.modal-content {
  width: 80%;
  top: 120px;
  z-index: 1050;
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
