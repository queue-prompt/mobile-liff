<template>
  <div>
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
      :width="width"
      :height="height"
      color="#10a254"
      loader="spinner"
      :opacity="opacityLoading"
    />
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  computed: {
    isLoading() {
      return this.$store.state.appState.isLoading;
    },
    opacityLoading() {
      return this.$store.state.appState.opacityLoading;
    },
  },
  data() {
    return {
      testLoading: true,
      width: 90,
      height: 90,
    };
  },
};
</script>

<style scoped>
</style>
