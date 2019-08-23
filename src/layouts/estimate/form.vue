<template>
  <div id="formEstimate">
    <calendar-app />
  </div>
</template>
<script>
  //Components
  import calendarApp from 'src/components/calendar/calendarApp'

  export default {
    props: {},
    components: {calendarApp},
    watch: {},
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
      }
    },
    computed: {},
    methods: {}
  }
</script>
<style lang="stylus">
  @import "~variables";
  #formEstimate
    padding 0px !important
</style>
