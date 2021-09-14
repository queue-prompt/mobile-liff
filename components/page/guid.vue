<template>
  <div class="card">
    <div class="card-header card-header-divider">
      เงื่อนไขก่อนการลงทะเบียน
      <!-- <span class="card-subtitle">Card subtitle description</span> -->
    </div>
    <div class="card-body card-header-divider">
      <div class="row">
        <div class="col-12">
          <div
            class="card-subtitle p-2"
            style="height: 50vh; font-size: 1.1rem; color: #333; overflow: auto;" 
          >
            <div class="" v-html="preRegisterText"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="" @click="accept = !accept">
            <h4 class="">
              <IconSquare :checked="accept" />
              <span class="ml-1">ยอมรับเงื่อนไข</span>
            </h4>
          </div>

          <div class="d-grid gap-2 mt-3">
            <button
              type="button"
              class="btn btn-primary btn-xl"
              @click="next"
              :disabled="!accept"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconSquare from "./IconSquare.vue";
export default {
  components: {
    IconSquare,
  },
  props: {
    next: { type: Function, required: true },
  },
  computed: {
    preRegisterText() {
      return this.$store.state.appState.preRegisterText;
    },
  },
  data() {
    return {
      accept: false,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
</style>
