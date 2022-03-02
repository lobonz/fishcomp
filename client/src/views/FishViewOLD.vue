<template>
  <div class="container fish mt-4">
    <h1><font-awesome-icon icon="fa-ruler-vertical" /><font-awesome-icon icon="fa-fish" rotation="90"/> Fish Caught</h1>
    <div v-if="fish.length > 0" class="table-wrap">
      <div>
        <b-button variant="outline-primary" :to="{ name: 'FishCreate' }"
          >Fish Landed</b-button
        >
      </div>
      <b-table-simple hover small caption-top responsive>
        <thead>
          <!-- 
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        boat: { type: Schema.Types.ObjectId, ref: 'boat' },
        species: { type: Schema.Types.ObjectId, ref: 'species' },
        method: String,
        length: String,
        points: Number,
        imagefile: String,
      -->
          <tr>
            <td>Fisher</td>
            <td>Boat</td>
            <td>Species</td>
            <td>Image</td>
            <td>Method</td>
            <td>Length</td>
            <td>Points</td>
            <td width="100" align="center">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fish in fish" :key="fish.id">
            <td>{{ fish.user.name }}</td>
            <td>{{ fish.boat.name }}</td>
            <td>{{ fish.species.name }}</td>
            <td><img v-if="fish.imagefile"
                  style="width: 150px;"
                  :src="`${server}/api/images/${fish.imagefile}/200`"
                />
                <img v-else
                  style="width: 150px;"
                  :src="`/images/nofishimage.jpg`"
                />
                </td>
            <td>{{ fish.method }}</td>
            <td>{{ fish.length }}</td>
            <td>{{ fish.points }}</td>
            <td align="center">
              <span class="pointer" @click="editFish(fish._id)">
                <font-awesome-icon icon="edit" size="2x" />
              </span>
              <span
                style="margin-left: 10px;" 
                class="pointer"
                @click="deleteFish(fish._id)"
              >
                <font-awesome-icon icon="times" size="2x" />
              </span>
            </td>
          </tr>
        </tbody>
      </b-table-simple>
    </div>
    <div v-else>
      No Fish have been caught yet :(<br/>Hurry up and catch one to be the first! <br /><br />
      <b-button variant="outline-primary" :to="{ name: 'FishCreate' }"
        >Fish Landed</b-button
      >
    </div>
  </div>
</template>

<script>
import FishService from "@/services/fish.service";
export default {
  name: "fish-view",
  data() {
    return {
      fish: []
    };
  },
  computed: {
    server: function () {
      return this.$parent.server
    },
  },
  mounted() {
    this.getFish();
  },
  methods: {
    async getFish() {
      const response = await FishService.fetchFish();
      this.fish = response.data;
      console.log(response.data);
    },
    async deleteFish(id) {
      await FishService.deleteFish(id);
      this.getFish();
    },
    async editFish(id) {
      this.$router.push({ name: "FishEdit", params: { id: id } });
    }
  }
};
</script>
<style scoped></style>
