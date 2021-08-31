<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h4 class="text-center fw-bold">ยืนยันการลงทะเบียน</h4>
      </div>

      <div class="col-12 mt-3">
        <div class="card">
          <div class="card-body">

            <div class="mb-3">
              <p class="text-secondary mb-0">กลุ่ม</p>
              <p>{{ userFormVuex.groupOf |  groupOfPerson}}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0"> คำนำหน้าชื่อ</p>
              <p>{{ userFormVuex.prefix }}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0">ชื่อ - นามสกุล</p>
              <p>{{ userFormVuex.firstName }} {{ userFormVuex.lastName }}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0">{{ typeIdNumber }}</p>
              <p>{{ userFormVuex.idCardNumber }}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0">วันเกิด</p>
              <p>{{ userFormVuex.birthDateTh | transFormBirthDate }}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0">เบอร์โทรศัพท์</p>
              <p>{{ userFormVuex.mobile }}</p>
            </div>

            <div class="mb-3">
              <p class="text-secondary mb-0">จังหวัด</p>
              <p>{{ userFormVuex.province }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash-core'
import { monthList } from '../../static/birthDate'
  export default {
    computed: {
      userFormVuex() {
        return this.$store.state.appState.user
      }
    },
    filters: {
      transFormBirthDate(birthDate) {
        if(!birthDate || birthDate == '') return '-'

        const dateSplit = birthDate.split('-')
        const monthName = _.filter(monthList, {monthId: dateSplit[1]})
        const newFormat = `${dateSplit[2]} ${monthName[0].name} ${dateSplit[0]}`

        return newFormat
      },
      groupOfPerson(group) {
        if(!group || group == '') return '-'

        switch (group) {
          case 'สูงอายุ':
            return 'ผู้มีอายุ 60 ปีขึ้นไป'

          case '7โรคเรื้อรัง':
            return 'บุคคลที่มีโรคประจำตัว 7 กลุ่มโรค'

          case 'ตั้งครรภ์':
            return 'ผู้ที่ตั้งครรภ์ อายุเกิน 12 สัปดาห์'

          case 'ทั่วไป':
            return 'ประชาชนทั่วไป'
        }
        
      }
    },
    mounted() {
      const getFormLocal = JSON.parse(localStorage.getItem('form'))

      if(getFormLocal.typeIdNumber == 'idCardNumber') {
        return this.typeIdNumber = 'เลขบัตรประชาชน'
      }

      if(getFormLocal.typeIdNumber == 'passportNumber') {
        return this.typeIdNumber = 'เลขหนังสือเดินทาง'
      } 
    },
    data() {
      return {
        typeIdNumber: ''
      }
    },

  }
</script>

<style scoped>

</style>
