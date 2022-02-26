<template>
  <div class="container boats mt-4">
    <h1><font-awesome-icon icon="fa-ship" /> Edit Boat</h1>
    <b-form>
      <b-container>
        <b-row>
          <b-col>
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

            <div>
              <b-form-group
                id="imagefile-group"
                label="New Image"
                label-for="imagefile"
              >
                <b-form-input
                  id="imagefile"
                  v-model="imagefile"
                  required
                  placeholder="IMAGE"
                ></b-form-input>
              </b-form-group>
            </div>

            <div>
              <b-button variant="outline-primary" @click="updateBoat"
                >Update Boat</b-button
              >
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import BoatService from "@/services/boat.service";
export default {
  name: "BoatEdit",
  data() {
    return {
      name: "",
      captain: "",
      imagefile: null
    };
  },
  mounted() {
    this.getBoat();
  },
  methods: {
    async getBoat() {
      const response = await BoatService.getBoat({
        id: this.$route.params.id
      });
      this.name = response.data.name;
      this.captain = response.data.captain;
      this.imagefile = response.data.imagefile;
    },
    async updateBoat() {
      await BoatService.updateBoat({
        id: this.$route.params.id,
        name: this.name,
        captain: this.captain,
        imagefile: this.imagefile
      });
      this.$router.push({ name: "Boats" });
    }
  }
};
</script>
<style scoped></style>
