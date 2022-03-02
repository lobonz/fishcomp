<template>
<!-- toggleable="sm" -->
  <b-navbar  type="dark" variant="primary" >
      <b-navbar-brand to="/"
        ><img src="/icons/fishcomp.svg" style="margin-left: 10px; width: 40px"
      /></b-navbar-brand>

      <!-- <b-navbar-toggle target="navbar-toggle-collapse"></b-navbar-toggle> -->

      
      
      <!-- <b-collapse id="navbar-toggle-collapse" is-nav> -->
        
        

          <b-navbar-nav v-if="loggedIn == true" class="h2">
            <b-nav-item to="/" v-if="loggedIn == true">Fish</b-nav-item>
            <b-nav-item to="/results" v-if="loggedIn == true">Scores</b-nav-item>
          </b-navbar-nav>
          <!-- <b-navbar-nav v-else>
            <b-nav-item to="/About">About</b-nav-item>
          </b-navbar-nav> -->

        <b-navbar-nav v-if="loggedIn == true" class="ms-auto">

          <b-nav-item-dropdown id="my-nav-dropdown" right class="dropdown-menu-end">
            <template slot="button-content">
                <font-awesome-icon icon="cog" />
            </template>

            <b-dropdown-item to="/boats">Boats</b-dropdown-item>
            <b-dropdown-item to="/species">Species</b-dropdown-item>
            <b-dropdown-item to="/users">Users</b-dropdown-item>
            <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      <!-- </b-collapse> -->
  </b-navbar>

  <!-- <b-navbar toggleable type="dark" variant="primary">
    <b-navbar-brand to="/"
      ><img src="/icons/fishcomp.svg" style="margin-left: 10px;width: 40px;"
    /></b-navbar-brand>
    
    <b-navbar-nav v-if="loggedIn == true" class="h2">
        <b-nav-item to="/">Fish</b-nav-item>
        <b-nav-item to="/">Scores</b-nav-item>
    </b-navbar-nav>

    <b-navbar-toggle target="navbar-toggle-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/boats">Boats</b-nav-item>
        <b-nav-item to="/species">Species</b-nav-item>
        <b-nav-item to="/users">Users</b-nav-item>
        <b-nav-item @click="logout()">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar> -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "NavigationBar",
  computed: {
    ...mapGetters("auth", ["loggedIn"]),
  },
  methods: {
    ...mapActions("auth", ["logout"]),
  },
};
</script>
<style>
/* Fixes for fucked up menu in bootstrab 5*/
.dropdown-menu-end {
  right: 0;
  left: auto;
  margin-left: -6em;
}
.dropdown-menu {
  min-width: 0 !important;
  margin-left: -3.5em;
}
.navbar-nav  {
 
}
</style>
