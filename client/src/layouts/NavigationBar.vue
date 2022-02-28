<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-navbar-brand to="/"
      ><img src="/icons/fishcomp.svg" style="margin-left: 10px;width: 40px;"
    /></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="loggedIn == true" class="h2">
        <b-nav-item to="/">Fish</b-nav-item>
        <b-nav-item to="/boats">Boats</b-nav-item>
        <b-nav-item to="/species">Species</b-nav-item>
        <b-nav-item to="/users">Users</b-nav-item>
        <b-nav-item @click="logout()">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "NavigationBar",
  computed: {
    ...mapGetters("auth", ["loggedIn"])
  },
  methods: {
    ...mapActions("auth", ["logout"])
  }
};
</script>
<style>
.navbar-brand
{
  font-size: 100px;
}
</style>
