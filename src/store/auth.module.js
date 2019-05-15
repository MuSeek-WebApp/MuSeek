import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_FACEBOOK,
  CHECK_AUTH,
  REGISTER,
  PROFILE_GET_UID,
  GET_USER_DATA
} from "./actions.type";
import { SET_AUTH, PURGE_AUTH, SET_USER_DATA } from "./mutations.type";
import firebase from "firebase";

if (JwtService.getToken()) {
  setInterval(function() {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(idToken => {
        JwtService.setToken(idToken);
      });
  }, 30 * 60 * 1000);
}

const state = {
  idToken: null,
  isAuthenticated: !!JwtService.getToken(),
  userData: null
};

const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  getUserType(state) {
    return state.userData.type;
  }
};

const actions = {
  [CHECK_AUTH](context) {
    return new Promise((resolve, reject) => {
      if (JwtService.getToken()) {
        //TODO: validate token with backend server. resolve in success otherwise reject.
        resolve();
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(idToken => {
            JwtService.setToken(idToken);
          });
      } else {
        context.commit(PURGE_AUTH);
        reject();
      }
    });
  },

  [SIGN_IN](context, credentials) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(result => {
          result.user.getIdToken().then(idToken => {
            ApiService.post("/auth/login", { idToken: idToken })
              .then(() => {
                context.commit(SET_AUTH, idToken);
                context.dispatch(PROFILE_GET_UID, null, { root: true });
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [SIGN_IN_WITH_FACEBOOK](context) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(result => {
          result.user.getIdToken().then(idToken => {
            ApiService.post("/auth/login", { idToken: idToken })
              .then(() => {
                context.commit(SET_AUTH, idToken);
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [SIGN_IN_WITH_GOOGLE](context) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(result => {
          result.user.getIdToken().then(idToken => {
            ApiService.post("/auth/login", { idToken: idToken })
              .then(() => {
                context.commit(SET_AUTH, idToken);
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [SIGN_OUT](context) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          context.commit(PURGE_AUTH);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [REGISTER](context, user) {
    return new Promise((resolve, reject) => {
      ApiService.post("/auth/register", user)
        .then(() => {
          context
            .dispatch(SIGN_IN, user.auth)
            .then(() => {
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async [GET_USER_DATA](context) {
    try {
      if (!context.state.userData) {
        let res = await ApiService.get("/auth/getUserData");
        context.commit(SET_USER_DATA, res.data);
      }
    } catch (error) {
      throw error;
    }
  }
};

const mutations = {
  [SET_AUTH](state, idToken) {
    state.isAuthenticated = true;
    state.idToken = idToken;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.idToken = null;
    state.userData = null;
    JwtService.removeToken();
  },
  [SET_USER_DATA](state, userData) {
    state.userData = userData;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
