import Vue from "vue";
import Router from "vue-router";

// Authentication
import { TokenService } from "@/services/storage.service";

// Fish
import Fish from "@/views/FishView.vue";
import FishCreate from "@/views/FishCreateView.vue";
import FishEdit from "@/views/FishEditView.vue";

// Results
import Results from "@/views/ResultsView.vue";


import About from "@/views/AboutView.vue";
import Login from "@/views/LoginView.vue";
import NotFound from "@/views/NotFoundView.vue";

// Users
import Users from "@/views/UsersView.vue";
import UserCreate from "@/views/UserCreateView.vue";
import UserEdit from "@/views/UserEditView.vue";

// Species
import Species from "@/views/SpeciesView.vue";
import SpecieCreate from "@/views/SpecieCreateView.vue";
import SpecieEdit from "@/views/SpecieEditView.vue";


// Boats
import Boats from "@/views/BoatsView.vue";
import BoatCreate from "@/views/BoatCreateView.vue";
import BoatEdit from "@/views/BoatEditView.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Fish",
      component: Fish
    },
    {
      path: "/fish/create",
      name: "FishCreate",
      component: FishCreate
    },
    {
      path: "/fish/:id",
      name: "FishEdit",
      component: FishEdit
    },
    {
      path: "/results",
      name: "results",
      component: Results //() => import("./views/About.vue")
    },
    {
      path: "/about",
      name: "about",
      component: About //() => import("./views/About.vue")
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    // SPECIES
    {
      path: "/species",
      name: "Species",
      component: Species
    },
    {
      path: "/species/create",
      name: "SpecieCreate",
      component: SpecieCreate
    },
    {
      path: "/species/:id",
      name: "SpecieEdit",
      component: SpecieEdit
    },
    // BOATS
    {
      path: "/boats",
      name: "Boats",
      component: Boats
    },
    {
      path: "/boats/create",
      name: "BoatCreate",
      component: BoatCreate
    },
    {
      path: "/boats/:id",
      name: "BoatEdit",
      component: BoatEdit
    },
    // USERS
    {
      path: "/users",
      name: "Users",
      component: Users
    },
    {
      path: "/users/create",
      name: "UserCreate",
      component: UserCreate
    },
    {
      path: "/users/:id",
      name: "UserEdit",
      component: UserEdit
    },
    {
      path: "*",
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/home");
  }

  next();
});

export default router;
