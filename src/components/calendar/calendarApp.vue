<template>
  <div id="calendarAppComponent">
    <!--== Calendar == -->
    <div class="relative-position" style="min-height: 90vh" v-touch-swipe.horizontal="handlerSwipe">

      <!--Header-->
      <div class="options-content backend-page">
        <!--Select date-->
        <div class="datetime-content">
          <q-datetime v-model="currentDate.selected"
                      format="MMM DD, YYYY" type="date"
                      @change="selectedDate = $clone(currentDate.selected)"/>
        </div>

        <!--Button refresh data-->
        <q-btn icon="fas fa-sync-alt" color="info" class="q-ml-xs"
               @click="getData(true)">
          <q-tooltip class="q-hide q-lg-show" :delay="300">{{$tr('ui.label.refresh')}}</q-tooltip>
        </q-btn>
      </div>

      <!-- Calendar component -->
      <calendar-app
        ref="calendarComponent"
        :time="false"
        :events-on-month-view="true"
        default-view="week"
        today-button
        @view-change="onChangeDate"
        @ready="onChangeDate"
        :events="events"
        :disable-views="['years', 'year']"
        :on-event-click="onEventClick"
        :selected-date="selectedDate"
      />

      <!---Inner Loading-->
      <inner-loading :visible="loading"/>
    </div>

    <!--== Modal Event ==-->
    <q-modal v-model="modal.show" class="backend-page" v-if="modal.show && selectedEvent"
             id="modalCalendarComponent">
      <q-modal-layout>
        <!--Header-->
        <q-toolbar slot="header">
          <q-toolbar-title>
            <q-icon name="far fa-calendar-alt" class="q-mr-sm"/>
            {{$trd(selectedEvent.start, {type : 'long'})}}
          </q-toolbar-title>
          <q-btn flat v-close-overlay icon="fas fa-times"/>
        </q-toolbar>

        <!--Footer-->
        <q-toolbar slot="footer" class="bg-white">
          <!--Button toggle tabs-->
          <q-btn-toggle
            v-model="modal.tabSelected"
            text-color="primary"
            color="cyan-1"
            :options="[
              {icon: 'fas fa-file-alt', value: 'information-tap'},
              {icon: 'fas fa-map-marked-alt', value: 'map-tap'}
            ]"
          />
        </q-toolbar>

        <!--Buttom estimate-->
        <div class="text-center q-pa-sm">
          <q-btn label="Estimate" icon="fas fa-file-invoice-dollar" color="blue"/>
        </div>

        <!-- Tabs -->
        <q-tabs ref="tabContent" position="bottom" animated
                align="justify" v-model="modal.tabSelected">
          <!-- Tabs title -->
          <q-tab default slot="title" name="information-tap" icon="fas fa-file-alt"/>
          <q-tab slot="title" name="map-tap" icon="fas fa-map-marked-alt"/>

          <!-- Information -->
          <q-tab-pane name="information-tap">
            <q-list no-border highlight>
              <!--Lead ID-->
              <q-item>
                <q-item-side icon="fas fa-lightbulb"/>
                <q-item-main>{{selectedEvent.id}}</q-item-main>
              </q-item>
              <!--product-->
              <q-item>
                <q-item-side icon="fas fa-box-open"/>
                <q-item-main>{{selectedEvent.products}}</q-item-main>
              </q-item>
              <!--branch Office-->
              <q-item>
                <q-item-side icon="fas fa-store"/>
                <q-item-main>{{selectedEvent.branchOfficeName}}</q-item-main>
              </q-item>
              <!--Salesman-->
              <q-item>
                <q-item-side icon="fas fa-user-tie"/>
                <q-item-main>{{selectedEvent.salesmanName}}</q-item-main>
              </q-item>

              <q-item-separator/>

              <!--Customers-->
              <q-item>
                <q-item-side icon="fas fa-user-friends"/>
                <q-item-main>{{selectedEvent.customersNames}}</q-item-main>
              </q-item>
              <!--address-->
              <q-item>
                <q-item-side icon="fas fa-map-marked-alt"/>
                <q-item-main>{{selectedEvent.address}}</q-item-main>
              </q-item>
              <!--Phones-->
              <q-item>
                <q-item-side icon="fas fa-phone"/>
                <q-item-main>
                  <span v-if="selectedEvent.dayPhone">{{selectedEvent.dayPhone}}</span>
                  <span v-if="selectedEvent.cellularPhone"> - {{selectedEvent.cellularPhone}}</span>
                  <span v-if="selectedEvent.eveningPhone"> - {{selectedEvent.eveningPhone}}</span>
                </q-item-main>
              </q-item>
            </q-list>
          </q-tab-pane>
          <!-- Map - address -->
          <q-tab-pane name="map-tap" keep-alive>
            <map-markets :address="selectedEvent.address"/>
          </q-tab-pane>
        </q-tabs>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
  //Components
  import calendarApp from 'vue-cal'
  import mapMarkets from 'src/components/calendar/mapWithMarkers'

  //Plugins
  import 'vue-cal/dist/vuecal.css'

  export default {
    props: {},
    components: {calendarApp, mapMarkets},
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
        loading: false,
        events: [],
        selectedEvent: false,
        selectedDate: new Date(),
        currentDate: {
          selected: new Date(),
          from: new Date(),
          to: new Date()
        },
        modal: {
          show: false,
          tabSelected: 'information-tap'
        }
      }
    },
    computed: {},
    methods: {
      //Listen change date
      onChangeDate(event, e) {
        let fromDate = event.startDate
        let toDate = event.endDate

        //Format date
        let startDate = `${this.$trd(fromDate, {type: 'year'})}-${this.$trd(fromDate, {type: 'monthNum'})}-01 00:00:00`
        let endDate = `${this.$trd(toDate, {type: 'year'})}-${this.$trd(toDate, {type: 'monthNum'})}-31 23:59:59`

        //Set current Date
        this.currentDate.from = startDate
        this.currentDate.to = endDate

        this.getData()//Get data
        this.syncDateInput(event)//Sync date input
      },
      //Get data
      getData(refresh = false) {
        this.loading = true
        let params = {
          refresh: refresh,
          //cacheTime: (3600 * 1),//1 Hour of cache
          params: {
            startDate: this.currentDate.from,
            endDate: this.currentDate.to,
            userName: 'aeason'
          }
        }

        //Request
        this.$crud.index('apiRoutes.estimate.appointments', params).then(response => {
          this.events = response.data
          this.loading = false
        }).catch(error => {
          console.error(error)
          this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          this.loading = false
        })
      },
      //Sync date whith datetime input
      syncDateInput(event) {
        let fromDate = event.startDate
        //Get month Date
        let monthDate = `${this.$trd(fromDate, {type: 'year'})}-${this.$trd(fromDate, {type: 'monthNum'})}-01 00:00:00`

        //Switch to set date
        switch (event.view) {
          case 'month':
            this.currentDate.selected = monthDate
            break
          default:
            this.currentDate.selected = fromDate
            break
        }
      },
      //Listen event over event
      onEventClick(event, e) {
        this.selectedEvent = event
        this.modal.show = true
        e.stopPropagation()
      },
      // Handler swipe
      handlerSwipe(response) {
        //Get component header from calendar component
        let headerComponent = this.$refs.calendarComponent.$children[0]

        //Case if swipe
        switch (response.direction) {
          case 'left':
            headerComponent.onArrowClick()
            break
          case 'right':
            headerComponent.onArrowClick(0)
            break
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
  #calendarAppComponent
    padding-bottom 60px
    position relative
    //Header top
    .options-content
      position fixed
      bottom 0
      right 0
      background-color white
      padding 10px
      z-index 3
      text-align right

      .datetime-content
        width max-content
        display inline-block
        margin-right 5px

        .q-datetime-input
          padding 0px

    //Header calendar
    .vuecal__header
      .vuecal__menu
        button
          &.active
            border-bottom 2px solid $blue

      .vuecal__title-bar
        background-color $grey-2
        @media screen and (max-width: $breakpoint-sm)
          .vuecal__title
            font-size 17px

          .vuecal__today-btn
            font-size 16px

      .vuecal__today-btn
        background-color $blue
        color white
        border-radius 5px

        span
          text-transform capitalize


    //Body calendar component
    .vuecal__body
      .vuecal__cell
        min-height 60px
        &.selected
          z-index 0
          background-color $cyan-1

      .vuecal__cell-events
        padding 5px

        .vuecal__event
          cursor pointer
          padding 6px 4px
          color white
          margin-top 5px
          background-color $blue
          border-radius 5px
          z-index 0

          &:first-child
            margin 0

          .vuecal__event-title, .vuecal__event-content
            white-space nowrap
            overflow hidden
            text-overflow ellipsis

          .vuecal__event-time
            display none



    //View per month
    .vuecal--month-view
      .vuecal__cell-content
        justify-content flex-start
        height 100%
        align-items flex-end

        .vuecal__cell-date
          padding: 4px


    //View per day
    .vuecal--day-view
      .vuecal__cell-events
        display flex
        flex-wrap wrap

        .vuecal__event
          cursor pointer
          position relative
          color white
          width 100%
          background-color white
          margin 0

          @media screen and (min-width: $breakpoint-sm)
            width 50%
          @media screen and (min-width: $breakpoint-md)
            width 33%
          @media screen and (min-width: $breakpoint-lg)
            width 25%

          &:after
            background $blue
            border-radius 5px
            content ''
            display block
            position absolute
            top 3px
            bottom 3px
            left 4px
            right 4px
            z-index -1

          &.vuecal__event--focus
            box-shadow none

          .vuecal__event-title
            white-space nowrap
            overflow hidden
            text-overflow ellipsis


    //Repsonsive
    @media screen and (max-width: $breakpoint-sm)
      .vuecal--month-view, .vuecal--week-view
        .vuecal__cell-events
          padding 2px

          .vuecal__event
            padding 4px 2px

            .vuecal__event-content
              display none

  #modalCalendarComponent
    .q-tabs
      .q-tabs-head
        min-height 0px
        height 0px
        overflow hidden

      .q-tab-pane
        padding 0px

        .q-list
          padding 0 0 5px 0

          .q-item
            min-height 35px

            .q-item-side
              width 22px
              text-align center

              i
                font-size 18px

    .q-layout-footer
      .q-toolbar
        padding 0px

        .q-btn-group
          //border-top 2px solid $primary
          border-radius 0px
          width 100%

          .q-btn
            font-size 20px
            min-height 50px
            border-radius 0px
            width 50%

</style>
