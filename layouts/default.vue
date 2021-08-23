<template>
  <div class="be-wrapper be-nosidebar-left">
    <Loading />

    <Nuxt />
  </div>
</template>

<script>
import Loading from "../components/loadingPage.vue";

export default {
  components: {
    Loading,
  },
  async mounted() {
    await liff.init({
      liffId: "1656257347-RrNWv1p3",
    });

    if (this.$route.query.e) {
      window.localStorage.removeItem('isCheckQueue')
      window.localStorage.setItem("entityId", this.$route.query.e);
    }

    if (this.$route.query.entityId) {
      window.localStorage.removeItem('isCheckQueue')
      window.localStorage.setItem("entityId", this.$route.query.entityId);
    }

    const isCheckQueue = localStorage.getItem('isCheckQueue')
    if (this.$route.query.q == "search" || isCheckQueue) {
      window.localStorage.setItem('isCheckQueue', true)
      return this.$router.push({ name: "my-reserve", query: { q: "search" } });
    }

    this.$store.commit("appState/setState", {
      key: "opacityLoading",
      payload: 0.8,
    });
    this.$store.commit("appState/setState", {
      key: "isLoading",
      payload: true,
    });

    await this.$store.dispatch("appState/init");

    this.$store.commit("appState/setState", {
      key: "isLoading",
      payload: false,
    });
    this.$store.commit("appState/setState", {
      key: "opacityLoading",
      payload: 0.5,
    });
  },
};
</script>

<style >
.container,
.container-lg,
.container-md,
.container-sm {
  max-width: 480px;
}

body {
  font-family: Arial, sans-serif !important;
}

.btn-primary,
.btn-primary {
  color: #ffffff;
  background-color: #10a254;
}

.btn-primary:hover,
.btn-primary.hover {
  color: #ffffff;
  box-shadow: inset 0 -1px 0 #10a254;
  background-color: #10a254;
  border-color: #10a254;
  border-bottom-color: #10a254;
  filter: brightness(0.95);
}

/* Active */
.btn-primary:active,
.btn-primary.active,
.btn-primary:not([disabled]):not(.disabled):active,
.btn-primary:not([disabled]):not(.disabled).active,
.show > .btn-primary.dropdown-toggle {
  color: #ffffff;
  box-shadow: inset 0 2px 0 #10a254;
  background-color: #10a254;
  border-color: #10a254;
  border-top-color: #10a254;
  filter: brightness(0.85);
}

/* active and focus */
.btn-primary:active:hover,
.btn-primary:active:focus,
.btn-primary:active.focus,
.btn-primary.active:hover,
.btn-primary.active:focus,
.btn-primary.active.focus,
.btn-primary:not([disabled]):not(.disabled):active:hover,
.btn-primary:not([disabled]):not(.disabled):active:focus,
.btn-primary:not([disabled]):not(.disabled):active.focus,
.btn-primary:not([disabled]):not(.disabled).active:hover,
.btn-primary:not([disabled]):not(.disabled).active:focus,
.btn-primary:not([disabled]):not(.disabled).active.focus,
.show > .btn-primary.dropdown-toggle:hover,
.show > .btn-primary.dropdown-toggle:focus,
.show > .btn-primary.dropdown-toggle.focus {
  color: #ffffff;
  background-color: #10a254;
  border-color: #10a254;
  border-top-color: #10a254;
  box-shadow: inset 0 2px 0 #10a254;
}

.be-top-header .container-fluid {
  background-color: #10a254;
}

a.nav-link .user-name {
  color: white;
}

.rice-check {
  src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktY2hlY2siIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTEwLjk3IDQuOTdhLjc1Ljc1IDAgMCAxIDEuMDcgMS4wNWwtMy45OSA0Ljk5YS43NS43NSAwIDAgMS0xLjA4LjAyTDQuMzI0IDguMzg0YS43NS43NSAwIDEgMSAxLjA2LTEuMDZsMi4wOTQgMi4wOTMgMy40NzMtNC40MjVhLjI2Ny4yNjcgMCAwIDEgLjAyLS4wMjJ6Ii8+Cjwvc3ZnPg==";
}
</style>
