<template>
  <div class="row">
    <div class="col"> 
      <p class="fw-bold">{{topic}}</p>
    </div>
    <div class="col text-end">
      <p>{{value ? value : '-'}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['topic', 'value'],
  }
</script>

<style scoped>

</style>