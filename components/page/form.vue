<template>
  <div class="">
    <div class="card">
      <div class="card-header card-header-divider">
        ข้อมูลผู้ใช้บริการ
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <h4 class="text-center fw-bold"></h4>
          </div>

          <div class="col-12">
            <form
              action=""
              class="row g-3 needs-validation"
              novalidate
              @submit.prevent="submit"
            >

              <div class="col-12" v-if="organizationForCovid">
                <label for="input-prefix" class="form-label">ท่านจัดอยู่ในกลุ่มใด</label>

                <div class="form-group row pt-1 pb-1">
                  <div class="col-12 mt-1">
                    <label class="custom-control custom-radio text-wrap">
                      <input class="custom-control-input" type="radio" name="radio-stacked" :checked="groupOf == 'สูงอายุ'"  @change="selectGroupOfPerson('สูงอายุ')">
                      <span class="custom-control-label custom-control-color fs-5">กลุ่ม 1 ผู้มีอายุ 60 ปีขึ้นไป</span>
                    </label>
                    <label class="custom-control custom-radio text-wrap">
                      <input class="custom-control-input" type="radio" name="radio-stacked" :checked="groupOf == '7โรคเรื้อรัง'" @change="selectGroupOfPerson('7โรคเรื้อรัง')">
                      <span class="custom-control-label custom-control-color fs-5">กลุ่ม 2 บุคคลที่มีโรคประจำตัว 7 กลุ่มโรค</span>
                      <div class="ml-2 fst-italic text-break">
                        <span style="color: #aaa;">โรคทางเดินหายใจเรื้อรัง, โรคไตวายเรื้อรัง, โรคหัวใจและหลอดเลือด, โรคมะเร็งและภาวะภูมิคุ้มกันต่ำ, โรคหลอดเลือดสมอง, โรคเบาหวาน, โรคอ้วน</span>
                      </div>
                    </label>
                    <label class="custom-control custom-radio text-wrap">
                      <input class="custom-control-input" type="radio" name="radio-stacked" :checked="groupOf == 'ตั้งครรภ์'" @change="selectGroupOfPerson('ตั้งครรภ์')">
                      <span class="custom-control-label custom-control-color fs-5">กลุ่ม 3 ผู้ที่ตั้งครรภ์ อายุเกิน 12 สัปดาห์</span>
                    </label>
                    <label class="custom-control custom-radio text-wrap">
                      <input class="custom-control-input" type="radio" name="radio-stacked" :checked="groupOf == 'ทั่วไป'" @change="selectGroupOfPerson('ทั่วไป')">
                      <span class="custom-control-label custom-control-color fs-5">กลุ่ม 4 ประชาชนทั่วไป (นอกเหนือกลุ่มที่ 1, 2 และ 3) </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label for="input-prefix" class="form-label"
                  >คำนำหน้าชื่อ</label
                >
                <select
                  class="form-select form-select-lg"
                  id="input-prefix"
                  v-bind:class="{ isInitState: checkSelectInitState('prefix') }"
                  @change="(e) => selectForm(e, 'prefix')"
                  v-model="prefix"
                  required
                >
                  <option value="" selected disabled>
                    กรุณาเลือกคำนำหน้าชื่อ
                  </option>
                  <option
                    v-for="(prefix, index) in prefixList"
                    :key="index"
                    :value="prefix"
                  >
                    {{ prefix }}
                  </option>
                </select>
                <div class="invalid-feedback">กรุณาเลือกคำนำหน้าชื่อ</div>
              </div>

              <div class="col-12 mt-5">
                <label for="input-firstName" class="form-label"
                  >ชื่อ (ไม่ต้องใส่คำนำหน้า)</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="input-firstName"
                  v-model="firstName"
                  autocomplete="off"
                  placeholder="กรอกชื่อจริง"
                  @input="setFieldLocalStorage"
                  required
                />
                <div class="invalid-feedback">กรุณากรอกชื่อจริง</div>
              </div>

              <div class="col-12 mt-5">
                <label for="input-lastName" class="form-label">นามสกุล</label>
                <input
                  type="text"
                  class="form-control"
                  id="input-lastName"
                  v-model="lastName"
                  autocomplete="off"
                  placeholder="กรอกนามสกุล"
                  @input="setFieldLocalStorage"
                  required
                />
                <div class="invalid-feedback">กรุณากรอกนามสกุล</div>
              </div>

              <div class="col-12 mt-4" v-if="identityType === 0">
                <label for="input-idCardNumber" class="form-label"
                  >เลขบัตรประชาชน (ไม่ต้องขีด)
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="input-idCardNumber"
                  v-model="idCardNumber"
                  v-on:blur="checkIdCardState_OnBlur"
                  v-on:keydown="checkIdCardState_OnKeyup"
                  autocomplete="off"
                  @input="setFieldLocalStorage"
                  placeholder="กรอกเลขบัตรประชาชน"
                  required
                />
                <p class="text-danger ps-1" v-if="!validId">
                  เลขบัตรประชาชนผิด กรุณากรอกใหม่
                </p>
              </div>

              <div class="col-12 mt-2" v-if="identityType !== 0">
                <label for="input-customNumber" class="form-label">{{ identityType !== '' ? identityType:  'หมายเลขยืนยันตัวตน'}}</label>
                <input
                  type="text"
                  class="form-control"
                  id="input-customNumber"
                  v-model="idCardNumber"
                  autocomplete="off"
                  @input="setFieldLocalStorage"
                  :placeholder="`กรอก${identityType}`"
                  required
                />
              </div>

              <div class="col-12 mt-5">
                <div class="row">
                  <div class="col">
                    <label for="input-date" class="form-label"> วันเกิด </label>

                    <select
                      class="form-select form-select-lg"
                      id="input-date"
                      v-bind:class="{
                        isInitState: checkSelectInitState('date'),
                      }"
                      @change="(e) => selectForm(e, 'date')"
                      v-model="date"
                      required
                    >
                      <option value="" selected disabled>วัน</option>
                      <option
                        v-for="(date, index) in dateList"
                        :key="index"
                        :value="date"
                      >
                        {{ date }}
                      </option>
                    </select>
                    <div class="invalid-feedback">กรุณาเลือกวันเกิด</div>
                  </div>

                  <div class="col px-0">
                    <label for="input-month" class="form-label">
                      เดือนเกิด
                    </label>

                    <select
                      v-bind:class="{
                        isInitState: checkSelectInitState('month'),
                      }"
                      class="form-select form-select-lg"
                      id="input-month"
                      @change="(e) => selectForm(e, 'month')"
                      v-model="month"
                      required
                    >
                      <option value="" selected disabled>เดือน</option>
                      <option
                        v-for="(month, index) in monthList"
                        :key="index"
                        :value="month.monthId"
                      >
                        {{ month.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">กรุณาเลือกเดือนเกิด</div>
                  </div>

                  <div class="col">
                    <label class="form-label" for="input-year"> ปีเกิด </label>

                    <select
                      v-bind:class="{
                        isInitState: checkSelectInitState('year'),
                      }"
                      class="form-select form-select-lg"
                      id="input-year"
                      @change="(e) => selectForm(e, 'year')"
                      v-model="year"
                      required
                    >
                      <option value="" selected disabled>ปี</option>
                      <option
                        v-for="(year, index) in yearList"
                        :key="index"
                        :value="year"
                      >
                        {{ year }}
                      </option>
                    </select>
                    <div class="invalid-feedback">กรุณาเลือกปีเกิด</div>
                  </div>
                </div>
              </div>

              <div class="col-12 mt-5">
                <label for="input-mobile" class="form-label"
                  >เบอร์โทรศัพท์ (ไม่ต้องขีด)
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="input-mobile"
                  v-model="mobile"
                  autocomplete="off"
                  @keyup="setFieldLocalStorage"
                  required
                />
                <div class="invalid-feedback">กรุณาากรอกเบอร์โทรศัพท์</div>
              </div>

              <div class="col-12 mt-5">
                <label for="input-confirmMobile" class="form-label"
                  >ยืนยันเบอร์โทรศัพท์ (ไม่ต้องขีด)
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="input-confirmMobile"
                  v-model="confirmMobile"
                  autocomplete="off"
                  @keyup="setFieldLocalStorage"
                  required
                />
                <p class="text-danger ps-1" v-if="!compairMobile">
                  เบอร์โทรศัพท์ยืนยัน ไม่ตรงกัน
                </p>
              </div>

              <div class="col-12 mt-5" v-if="organizationData.entityId == mockEntityId">
                <label for="input-input-select-country" class="form-label">สัญชาติ</label>
                <select
                  class="form-select form-select-lg"
                  id="input-select-country"
                  v-bind:class="{ isInitState: checkSelectInitState('remark') }"
                  @change="(e) => selectForm(e, 'remark')"
                  v-model="remark"
                  required
                >
                  <option value="ไทย" selected>ไทย</option>
                  <option value="ลาว">ลาว</option>
                  <option value="พม่า">พม่า</option>
                  <option value="กัมพูชา">กัมพูชา</option>
                </select>
              </div>

              <div class="col-12 mt-5" v-if="organizationData.entityId !== mockEntityId">
                <label for="input-remark" class="form-label">ข้อมูลเพิ่มเติม (ถ้ามี)</label>
                <input
                  type="text"
                  class="form-control"
                  id="input-remark"
                  v-model="remark"
                  autocomplete="off"
                  maxlength="50"
                  @input="setFieldLocalStorage"
                />
                <p class="ml-1" style="color: #ccc;">{{ remark.length }} / 50 ตัวอักษร </p>
              </div>

              <div class="col-12 mt-5">
                <div class="d-grid gap-2 mt-3">

                  <button class="btn btn-primary btn-xl" type="submit">
                    ต่อไป
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="activeModal"
      class="modal-container modal-effect-1"
      id="md-confirm-form"
    >
      <div class="modal-content">
        <div class="modal-body">
          <ComfirmComponent :next="next" />

          <div class="row mt-3">
            <div class="col-12 mb-3">
              <button
                type="button"
                class="btn btn-primary btn-xl btn-block"
                @click="confirmForm"
              >
                ยืนยันข้อมูล
              </button>
            </div>

            <div class="col-12">
              <button
                class="btn btn-secondary btn-lg btn-block"
                @click="closeModal"
              >
                แก้ไขข้อมูล
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
import _ from "lodash-core";
import { dateList, monthList, yearList } from "../../static/birthDate";
import prefixList from "../../static/prefix";
import ComfirmComponent from "./confirm.vue";

export default {
  props: {
    next: { type: Function, required: true },
    organizationData: { type: Object, required: true }
  },
  components: {
    ComfirmComponent, 
  },
  computed: {
    userFormVuex() {
      return this.$store.state.appState.user;
    },
    organizationForCovid() {
      const organizationData = this.$store.state.appState.organizationData

      switch (organizationData.type) {
        case '100':
          return true

        case '200':
          return true
          
        default:
          return false
      }
    },
    compairMobile() {
      return this.mobile == this.confirmMobile;
    },
    checkInput() {
      if (this.prefix == "") return false;
      if (this.firstName == "") return false;
      if (this.lastName == "") return false;
      if (this.year == "") return false;
      if (this.month == "") return false;
      if (this.date == "") return false;
      if (this.mobile == "") return false;
      if (this.confirmMobile == "") return false;
      if (this.gender == "" || !this.gender) return false;
      if (this.idCardNumber == "") return false;
      if (this.compairMobile == false) return false;
      if (this.validId == false) return false;

      return true;
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    let userForm = localStorage.getItem("registerForm");
    if (userForm) {
      userForm = JSON.parse(userForm);
      this.identityType = this.organizationData.identityType
      this.restoreForm(userForm);
      let self = this;
      setTimeout(function () {
        self.idCardNumberState = self.idCardNumber ? "done" : "start";
      }, 1000);
    }
    this.dateList = dateList;
    this.monthList = monthList;
    this.yearList = yearList;
    this.groupOf = 'ทั่วไป'
    this.prefixList = prefixList;
    this.idCardNumberState = "start";
    this.remark = this.organizationData.entityId == this.mockEntityId ? 'ไทย' : ''
    this.validateInputForm();
  },
  data() {
    return {
      mockEntityId: '378816', // entityId ของแรงงานตรวจคนเข้าเมือง
      activeModal: false,
      idCardNumberState: "start", // start, done
      prefixList: [],
      dateList: [],
      monthList: [],
      yearList: [],
      groupOf: 'ทั่วไป',
      prefix: "",
      firstName: "",
      lastName: "",
      year: "",
      month: "",
      date: "",
      mobile: "",
      confirmMobile: "",
      gender: "",
      idCardNumber: "",
      remark: '',
      validId: true,
      isDebug: process.env.isDebug || false,
      identityType: 0
    };
  },
  methods: {
    selectForm(event, type) {
      const value = event.target.value;
      this[type] = value;
      if (type == "prefix") {
        this.getGenderByPrefix();
      }

      this.setFieldLocalStorage();
    },
    selectGroupOfPerson(type) {
      this.groupOf = type
      this.setFieldLocalStorage()
    },
    checkSelectInitState(field) {
      return this[field] == "" ? true : false;
    },
    setFieldLocalStorage() {
      const formPayload = {
        prefix: this.prefix,
        firstName: this.firstName,
        lastName: this.lastName,
        idCardNumber: this.idCardNumber,
        year: this.year,
        month: this.month,
        date: this.date,
        mobile: this.mobile,
        confirmMobile: this.mobile,
        gender: this.gender,
        remark: this.remark,
        identityType: this.organizationData.identityType
      };
      if (process.browser) {
        localStorage.setItem("registerForm", JSON.stringify(formPayload));
      }
    },
    restoreForm(form) {
      const {
        groupOf,
        prefix,
        firstName,
        lastName,
        idCardNumber,
        mobile,
        gender,
        year,
        month,
        date,
        remark,
        identityType
      } = form;

      this.groupOf = groupOf ? groupOf : 'ทั่วไป'
      this.prefix = prefix ? prefix : ''
      this.firstName = firstName ? firstName : ''
      this.lastName = lastName ? lastName : ''
      this.idCardNumber = this.identityType == identityType ? idCardNumber : ''
      this.year = year ? year : ''
      this.month = month ? month : ''
      this.date = date ? date : ''
      this.mobile = mobile ?mobile : ''
      this.confirmMobile = mobile ? mobile : ''
      this.gender = gender ? gender : ''
      this.remark = remark ? remark : ''
    },
    getGenderByPrefix() {
      const maleList = ["นาย", "เด็กชาย"];
      const isMale = _.includes(maleList, this.prefix);
      this.gender = isMale ? "male" : "female";
    },
    checkIdCardState_OnBlur(e) {
      this.idCardNumberState = "done";
      this.checkSumId(e);
    },
    checkIdCardState_OnKeyup(e) {
      if (this.idCardNumberState == "done") {
        this.checkSumId(e);
      }
    },
    checkSumId: _.debounce(function () {
      let _tmpIdCardNumber = this.idCardNumber;
      let self = this;
      if (_tmpIdCardNumber.length !== 13) {
        self.validId = false;
        return false;
      }
      if (_tmpIdCardNumber.substring(0, 1) == 0) {
        self.validId = false;
        return false;
      }
      let i = 0;
      let sum = 0;
      for (i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(_tmpIdCardNumber.charAt(i)) * (13 - i);
      if ((11 - (sum % 11)) % 10 != parseFloat(_tmpIdCardNumber.charAt(12))) {
        self.validId = false;
        return false;
      }
      self.validId = true;
      return true;
    }, 10),
    validateInputForm() {
      let forms = document.querySelectorAll(".needs-validation");
      Array.from(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    submit() {
      if (!this.checkInput) {
        return this.validateInputForm();
      }

      if(this.identityType === 0) {
        this.checkSumId();

        if (!this.validId) return
      }


      const tranformMonth = this.date < 10 ? `0${this.date}` : this.date;
      const birthDateTh = `${this.year}-${this.month}-${tranformMonth}`;
      const birthDate = `${parseInt(this.year) - 543}-${
        this.month
      }-${tranformMonth}`;
      const payload = {
        groupOf: this.groupOf,
        prefix: this.prefix,
        firstName: this.firstName,
        lastName: this.lastName,
        idCardNumber: this.idCardNumber,
        birthDateTh: birthDateTh,
        birthDate: birthDate,
        mobile: this.mobile,
        gender: this.gender,
        remark: this.remark
      };

      this.$store.commit("appState/setState", {
        key: "user",
        payload: payload,
      });

      this.$store.commit("appState/setState", {
        key: "userId",
        payload: this.idCardNumber,
      });
      this.activeModal = true;

      const self = this
      setTimeout(function () {
        if(self.validId) {
          const myModalEl = document.getElementById("md-confirm-form");
          myModalEl.classList.add("modal-show");
        }
      }, 10);
    },
    async confirmForm() {
      this.closeModal();

      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: true,
      });
      await this.$store.dispatch("reserve/getTokenByUserId");
      this.$store.commit("appState/setState", {
        key: "isLoading",
        payload: false,
      });
      this.next();
    },
    closeModal() {
      this.activeModal = false;
      const myModalEl = document.getElementById("md-confirm-form");
      myModalEl.classList.remove("modal-show");
    },
  },
};
</script>

<style scoped>
.text-danger {
  color: white !important;
  /* background-color: #dc3545!important; */
  background-color: red !important;
}
.isInitState {
  color: #6c757d;
}
.invalid-id {
  border-color: #ea4335 !important;
}
.form-control.is-valid:focus,
.was-validated :valid.form-control,
.form-select.is-valid:focus,
.was-validated :valid.form-select {
  border-color: #d5d8de !important;
  background-image: inherit !important;
  box-shadow: inherit !important;
}

.was-validated .custom-control-input:valid ~ .custom-control-label, 
.custom-control-input.is-valid ~ .custom-control-label {
  color: inherit; 
}

.form-label {
  font-size: 1.3rem;
  margin-top: 1.1rem;
}
input.form-control,
textarea.form-control {
  font-size: 1.3rem;
}
.form-select {
  font-size: 1.3rem;
}
.modal-content {
  width: 80%;
  z-index: 1050;
}
#md-confirm-form {
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

label {
  color: #333;
}

.custom-radio .custom-control-input:checked ~ .custom-control-label::after {
  content: url('/icons/check_white.svg');
}

</style>
