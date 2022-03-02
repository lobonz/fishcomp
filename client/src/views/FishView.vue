<template>
  <div class="container fish mt-4">
    <h1><font-awesome-icon icon="fa-ruler-vertical" /><font-awesome-icon icon="fa-fish" rotation="90"/> Fish Landed</h1>
    <div v-if="fish.length > 0" >
      <div class="text-center mb-4 d-grid gap-2 text-dark" >
        <b-button variant="success" :to="{ name: 'FishCreate' }" class="ml-auto mr-auto  btn-lg" style="font-size: 2em;"
          >I Landed Another</b-button
        >
      </div>

<!-- --------------------------------------------------- -->
      <div v-for="fish in fish" :key="fish.id">
          <b-card no-body class="overflow-hidden border border-5 mb-4 border-dark"  >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img :src="getFishImage(fish)" :alt="fish.species.name" class="rounded-0"></b-card-img>
              </b-col>
              <b-col md="6">
                <b-card-body>
                    <h3 style="font-weight: 600;">{{ fish.user.name }} / {{ fish.boat.name }}</h3>
                    <h4>Species: {{ fish.species.name }}</h4> 
                    <h4>Length: {{ fish.length }}</h4>
                    <h4>Method: {{ fish.method }}</h4>
                    <h4>Caught: {{ formatDate(fish.createdAt) }}</h4>
                    <h3 style="font-weight: 600;">Points: {{ fish.points }}</h3>
                    <div class="card-img-overlay h-100 d-flex flex-column justify-content-start">
                      <span class="pointer" @click="editFish(fish._id)">
                        <font-awesome-icon icon="edit" size="2x" />
                      </span>
                    </div>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
      </div>
<!-- --------------------------------------------------- -->
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
    },
    formatDate(dbtime){
      var date =  new Date(dbtime)
          //return date.toDateString()
          return date.toLocaleString()
    },
    getFishImage(fish){
      if ( typeof fish.imagefile !== 'undefined'){
        //return '/images/nofishimage.jpg'
        return `${this.server}/api/images/${fish.imagefile}/800`
      }else{
        return '/images/nofishimage.jpg'

      }
     
    }
  }
};
</script>
<style scoped></style>
