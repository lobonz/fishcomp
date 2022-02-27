<template>
  <div class="container mt-4 species">
    <h1><font-awesome-icon icon="fa-fish" /> Add Species</h1>
    <div class="form">
      <div>
        <b-form-group id="name-group" label="Specie" label-for="name">
          <b-form-input
            id="name"
            v-model="name"
            required
            placeholder="SPECIES NAME"
          ></b-form-input>
        </b-form-group>
      </div>


      <!-- Upload image here ?-->

      <div>
        <b-button class="mt-3" variant="primary" @click="addSpecie"
          >Next</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import SpecieService from "@/services/species.service";
export default {
  name: "SpecieCreate",
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async addSpecie() {
      var response = await SpecieService.addSpecie({
        name: this.name,
      });
      this.$router.push({
        name: "SpecieEdit",
        params: { id: response.data.specieid }
      });
    }
  }
};
</script>
<style scoped></style>
