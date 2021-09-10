<template>
  <div class="splash-footer" @click="skipEntityShutdown">
    © 2021 Powered by คิวพร้อม.com
    <br />
    <span style="color: gray; font-size: 0.9rem">v1.2.1</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickCount: 0,
    }
  },
  methods: {
    skipEntityShutdown() {
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
        this.$store.commit('appState/setState', {key: 'canReserve', payload: true})
        this.clickCount = 0;
        return;
      }
    },
  },
};
</script>

<style>
</style>
