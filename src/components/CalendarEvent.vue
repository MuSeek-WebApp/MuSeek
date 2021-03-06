<template>
  <v-menu :close-on-content-click="false" v-model="menu" full-width offset-x>
    <template v-slot:activator="{ on }">
      <div
        v-ripple
        :class="[isActive() ? 'active-event' : 'past-event']"
        v-on="on"
        v-html="event.name"
      ></div>
    </template>
    <v-card color="grey lighten-4" min-width="350px" flat>
      <v-toolbar flat dense>
        <v-btn icon @click="menu = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              icon
              class="mx-0"
              color="purple lighten-1"
              v-on="on"
              :to="`/event/${event._id}`"
              target="_blank"
            >
              <v-icon>info</v-icon>
            </v-btn>
          </template>
          <span>Info</span>
        </v-tooltip>
        <v-btn flat icon class="mx-0" color="blue lighten-1" @click="edit()">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-dialog v-model="deleteDialog" width="400">
              <template v-slot:activator="{ on }">
                <v-btn flat icon class="mx-0" color="red lighten-1" v-on="on">
                  <v-icon>delete_outline</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="grey lighten-3">
                  <v-flex class="text-md-center subheading font-weight-bold"
                    >WARNING</v-flex
                  >
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-md-center">
                  <p>Are you sure you want to delete the following event?</p>
                  <p>'{{ event.name }}'</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn @click="deleteDialog = false">CANCEL</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="red lighten-3" @click="remove()">DELETE</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-title class="pt-1" primary-title>
        <div>
          <div class="headline mb-3" v-html="event.name"></div>
          <h4 class="mb-2">
            <v-icon class="mr-2">calendar_today</v-icon>
            {{ eventDateToString }}
          </h4>
          <h4 class="mb-2">
            <v-icon>music_note</v-icon>
            {{ event.genres.join(", ") }}
          </h4>
        </div>
      </v-card-title>
    </v-card>
  </v-menu>
</template>

<script>
import { REMOVE_EVENT } from "../store/actions.type";
import { STOP_PROGRESS, START_PROGRESS } from "../store/mutations.type";
import moment from "moment";
export default {
  props: ["event"],
  data: function() {
    return {
      menu: false,
      dialog: false,
      deleteDialog: false
    };
  },
  computed: {
    eventDateToString: function() {
      return (
        moment(this.event.startDate).format("MMMM, DD, YYYY, HH:mm") +
        " - " +
        moment(this.event.endDate).format("MMMM, DD, YYYY, HH:mm")
      );
    }
  },
  methods: {
    onDialogClose() {
      this.dialog = false;
      this.menu = false;
    },
    remove() {
      this.$store.commit(START_PROGRESS);
      this.$store
        .dispatch(REMOVE_EVENT, this.event)
        .then(() => {
          this.deleteDialog = false;
          this.menu = false;
        })
        .catch(() => {
          // TODO print error message
        })
        .finally(() => {
          this.$store.commit(STOP_PROGRESS);
        });
    },
    edit() {
      this.$router.push("/event/edit/" + this.event._id);
    },
    isActive() {
      return !moment(this.event.endDate).isBefore(moment());
    }
  }
};
</script>

<style lang="stylus" scoped>
.active-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}

.past-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: grey;
  color: #ffffff;
  border: 1px solid grey;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
</style>
