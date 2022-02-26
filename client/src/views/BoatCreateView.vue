<template>
  <div class="container mt-4 boats">
    <h1>Add Boat</h1>
    <div class="form">
      <div>
        <b-form-group id="name-group" label="Boat" label-for="name">
          <b-form-input
            id="name"
            v-model="name"
            required
            placeholder="BOAT NAME"
          ></b-form-input>
        </b-form-group>
      </div>

      <div>
        <b-form-group id="captain-group" label="Captain" label-for="captain">
          <b-form-input
            id="captain"
            v-model="captain"
            required
            placeholder="CATAINS NAME"
          ></b-form-input>
        </b-form-group>
      </div>

      <!-- Upload image here ?-->

      <div>
        <b-button class="mt-3" variant="primary" @click="addBoat"
          >Next</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import BoatService from "@/services/boat.service";
export default {
  name: "BoatCreate",
  data() {
    return {
      name: "",
      email: "",
      password: null
    };
  },
  methods: {
    async addBoat() {
      var response = await BoatService.addBoat({
        name: this.name,
        boatname: this.boatname,
        email: this.email,
        password: this.password
      });
      this.$router.push({
        name: "BoatEdit",
        params: { id: response.data.boatid }
      });
    }
  }
};
</script>
<style scoped></style>
