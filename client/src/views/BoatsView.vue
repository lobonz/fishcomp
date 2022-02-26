<template>
  <div class="container boats mt-4">
    <h1><font-awesome-icon icon="fa-ship" /> Boats</h1>
    <div v-if="boats.length > 0" class="table-wrap">
      <div>
        <b-button variant="outline-primary" :to="{ name: 'BoatCreate' }"
          >Add Boat</b-button
        >
      </div>
      <b-table-simple hover small caption-top responsive>
        <thead>
          <tr>
            <td>Name</td>
            <td>Captain</td>
            <td>Image</td>
            <td width="100" align="center">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="boat in boats" :key="boat.id">
            <td>{{ boat.name }}</td>
            <td>{{ boat.captain }}</td>
            <td>{{ boat.imagefile }}</td>
            <td align="center">
              <span class="pointer" @click="editBoat(boat._id)">
                <font-awesome-icon icon="edit" />
              </span>
              <span
                style="margin-left: 10px;" 
                class="pointer"
                @click="deleteBoat(boat._id)"
                v-if="boats.length > 0"
              >
                <font-awesome-icon icon="times" />
              </span>
            </td>
          </tr>
        </tbody>
      </b-table-simple>
    </div>
    <div v-else>
      There are no boats.. Lets add one now <br /><br />
      <b-button variant="outline-primary" :to="{ name: 'BoatCreate' }"
        >Add Boat</b-button
      >
    </div>
  </div>
</template>

<script>
import BoatService from "@/services/boat.service";
export default {
  name: "boats-view",
  data() {
    return {
      boats: []
    };
  },
  mounted() {
    this.getBoats();
  },
  methods: {
    async getBoats() {
      const response = await BoatService.fetchBoats();
      this.boats = response.data;
      console.log(response.data);
    },
    async deleteBoat(id) {
      await BoatService.deleteBoat(id);
      this.getBoats();
      this.$router.push({ name: "Boats" });
    },
    async editBoat(id) {
      this.$router.push({ name: "BoatEdit", params: { id: id } });
    }
  }
};
</script>
<style scoped></style>
