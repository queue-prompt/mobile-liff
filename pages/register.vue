<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand fixed-top be-top-header">
      <div class="container-fluid">
        <div class="be-right-navbar">
          <ul class="nav navbar-nav d-flex flex-row float-right">
            <li class="nav-item" style="width: 36px" @click="backStep">
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
                  <!-- <i class="px-3 bi bi-arrow-left text-white fs-4"></i> -->
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
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
        <div class="">
          <div class="px-2">
            <Stepper
              :current="current"
              :total="total"
              currentColor="#10A254"
              defaultColor="#dad7d7"
            />
          </div>
        </div>

        <div v-if="current == 0">
          <GuidComponent :next="nextStep" />
        </div>

        <div v-if="current == 1">
          <FormComponent :next="nextStep" :organizationData="organizationData"/>
        </div>

        <div v-if="current == 2">
          <ReserveComponent />
        </div>

        <SplashFooter />
      </div>
    </div>
  </div>
</template>

<script>
import SplashFooter from "../components/SlpashFooter.vue";

import GuidComponent from "../components/page/guid.vue";
import FormComponent from "../components/page/form.vue";
import ReserveComponent from "../components/page/reserve.vue";
import Stepper from "../components/Steper";
export default {
  components: {
    GuidComponent,
    FormComponent,
    ReserveComponent,
    Stepper,
    SplashFooter,
  },
  computed: {
    organizationData() {
      return this.$store.state.appState.organizationData;
    },
  },
  data() {
    return {
      total: 3,
      current: 0,
      clickCount: 0,
    };
  },
  methods: {
    nextStep() {
      this.current = this.current + 1;
    },
    backStep() {
      if (this.current == 0) {
        return this.$router.push("/");
      }

      this.current = this.current - 1;
    },
    async testErrorReserve() {
      if (this.clickCount > 0) {
        this.clickCount += 1;
      } else {
        this.clickCount += 1;
        this.setTimeoutRef = setTimeout(() => {
          this.clickCount = 0;
        }, 5000);
      }
      if (this.clickCount >= 8) {
        clearTimeout(this.setTimeoutRef);
        console.log(`Wow, you clicked ${this.clickCount} times in 5 seconds`);

        await this.$store.dispatch("reserve/tesErrorRegister");
        this.clickCount = 0;
        return;
      }
    },
  },
};
</script>

<style scoped  >
.step-indicators {
  position: relative;
  display: flex;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.step-indicator {
  border: 2px solid;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  z-index: 2;
  background-color: white;
  box-sizing: border-box;
}

.step-indicators-line {
  position: absolute;
  height: 2px;
  top: 50%;
  left: 24px;
  right: 24px;
  transform: translateY(-50%);
  z-index: 1;
  background: rgb(223, 231, 239);
}

.bigger-icon {
  font-size: 2rem;
}
</style>
