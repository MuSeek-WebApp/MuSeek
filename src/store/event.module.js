import {
  NEW_EVENT,
  FETCH_EVENTS,
  FETCH_FEED,
  UPDATE_EVENT,
  REMOVE_EVENT,
  APPROVE_BY_ARTIST,
  DENY_BY_ARTIST,
  REGISTER_EVENT,
  FETCH_SINGLE_EVENT
} from "./actions.type";
import {
  CLEAR_EVENTS,
  SET_EVENTS,
  SET_EVENT,
  DELETE_EVENT,
  SET_FEED,
  CLEAR_FEED,
  SET_VIEWED_EVENT
} from "./mutations.type";
import ApiService from "@/common/api.service";

const state = {
  events: [],
  feed: [],
  viewedEvent: null
};

const getters = {
  getAllEvents(state) {
    return state.events;
  },
  getAllFeed(state) {
    return state.feed;
  },
  getViewedEvent(state) {
    return state.viewedEvent;
  }
};

const actions = {
  [NEW_EVENT](context, event) {
    return new Promise((resolve, reject) => {
      ApiService.post("api/event", event)
        .then(result => {
          context.commit(SET_EVENT, result.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [UPDATE_EVENT](context, event) {
    return new Promise((resolve, reject) => {
      ApiService.put("api/event/" + event._id, event)
        .then(result => {
          context.commit(SET_EVENT, result.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [REMOVE_EVENT](context, event) {
    return new Promise((resolve, reject) => {
      ApiService.delete("api/event/" + event._id)
        .then(() => {
          context.commit(DELETE_EVENT, event);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [FETCH_EVENTS](context) {
    return new Promise((resolve, reject) => {
      ApiService.get("api/event/my-events")
        .then(result => {
          context.commit(CLEAR_EVENTS);
          context.commit(SET_EVENTS, result.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [FETCH_FEED](context, filter) {
    return new Promise((resolve, reject) => {
      ApiService.post("api/event/my-feed", filter)
        .then(result => {
          context.commit(CLEAR_FEED);
          context.commit(SET_FEED, result.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  async [APPROVE_BY_ARTIST](context, payload) {
    await ApiService.post("api/event/approve-band/", payload);
  },
  async [DENY_BY_ARTIST](context, payload) {
    await ApiService.post("api/event/deny-band/", payload);
  },
  async [REGISTER_EVENT](context, event) {
    await ApiService.post("api/event/register-band", event);
  },
  async [FETCH_SINGLE_EVENT](context, id) {
    const { data } = await ApiService.get("api/event/id/" + id);
    context.commit(SET_VIEWED_EVENT, data);
  }
};

const mutations = {
  [CLEAR_EVENTS](state) {
    state.events.splice(0, state.events.length);
  },
  [CLEAR_FEED](state) {
    state.feed.splice(0, state.feed.length);
  },
  [SET_EVENTS](state, events) {
    state.events.push(...events);
  },
  [SET_FEED](state, feed) {
    state.feed.push(...feed);
  },
  [SET_EVENT](state, event) {
    let index = state.events.findIndex(obj => obj._id === event._id);

    if (index !== -1) {
      state.events.splice(index, 1);
    }

    state.events.push(event);
  },
  [DELETE_EVENT](state, event) {
    let index = state.events.findIndex(obj => obj._id === event._id);

    if (index !== -1) {
      state.events.splice(index, 1);
    }
  },
  [SET_VIEWED_EVENT](state, event) {
    state.viewedEvent = event;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
