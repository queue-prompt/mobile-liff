<template>
  <div class="be-content">
    <div class="main-content container-fluid px-3">
      <div class="splash-container" style="margin-top: -20px;">
        <div class="card" style="min-height: 85vh;">
          <div class="card-header card-header-divider text-left">กรุณาใส่รหัสหน่วยงาน</div>
          <div class="card-body">
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="mb-3">
                  <input type="text" class="form-control" id="login-event" v-model="entityId" placeholder="รหัสหน่วยงาน">
                </div>

                <div class="mt-3" v-if="!validate">
                  <p class="text-danger">&nbsp; ไม่พบหน่วยงาน กรุณาลองใหม่</p>
                </div>
              </div>

              <div class="col-12 position-absolute start-50 translate-middle-x" style="bottom: 30px;">
                <div class="d-grid gap-2 mt-3">
                  <button type="button" class="btn btn-success btn-lg" @click="submitEvent" :disabled="entityId == ''">ตกลง</button>
                </div> 
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // computed: {
    //   validate() {
    //     return this.$store.state.appState.validateEntity
    //   },

    // },
    data() {
      return {
        entityId: '',
        validate: true,
      }
    },
    methods: {
      async submitEvent() {
        if (this.entityId == '') return 
        this.validate = true

        this.$store.commit("appState/setState", { key: "isLoading", payload: true });

        const searchResult = await this.$store.dispatch('appState/searchEntity',this.entityId)

        setTimeout(() => {
          
          this.$store.commit("appState/setState", { key: "isLoading", payload: false });
        
          if(!searchResult) {
            this.validate = false
            return
          }

          this.validate = true
          window.location.href = 'http://' + window.location.host + '?entityId=' + this.entityId
        }, 1200);
      }
    },
    
  }
</script>

<style scoped>

</style>