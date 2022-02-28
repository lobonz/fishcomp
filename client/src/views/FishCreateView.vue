<template>
  <div class="container mt-4 fish">
    <h1>A Fish!</h1>
    <div class="form">
      <b-container>
        <b-row  align-v="center"  class="mb-3">
          <b-col cols="3">
            Who caught it?
          </b-col>
          <b-col>
            <div>
                <b-form-select id="user" v-model="user" :options="anglers" class="form-control"></b-form-select>
            </div>
          </b-col>
        </b-row>

        <b-row  align-v="center"  class="mb-3">
          <b-col cols="3">
            What Boat?
          </b-col>
          <b-col>
            <div>
                <b-form-select id="boat" v-model="boat" :options="boats" class="form-control"></b-form-select>
            </div>
          </b-col>
        </b-row>

         <b-row  align-v="center"  class="mb-3">
          <b-col cols="3">
            What did ya catch?
          </b-col>
          <b-col>
            <div>
                <b-form-select id="species" v-model="species"  @change="selectSpecies($event)" :options="specieslist" class="form-control"></b-form-select>
            </div>
          </b-col>
        </b-row>

        <b-row  align-v="center"  class="mb-3">
          <b-col cols="3">
            With What?
          </b-col>
          <b-col>
            <div>
                <b-form-select id="method" v-model="method" @change="updatePoints($event)" :options="methodlist" class="form-control"></b-form-select>
            </div>
          </b-col>
        </b-row>

        <b-row  align-v="center"  class="mb-3">
          <b-col cols="3">
            How Long?
          </b-col>
          <b-col>
            <div v-if="lengthlist.length > 0">
                <b-form-select id="length" v-model="length"  @change="updatePoints($event)" :options="lengthlist" class="form-control"></b-form-select>
            </div>
            <div v-else>
              Select A Fish Species
            </div>
          </b-col>
        </b-row>

        <b-row  align-v="center"  class="mb-3" v-if="points > 0">
          <b-col >
            <h2 v-if="points > 1">Thats {{points}} Points!</h2>
            <h2 v-else>Thats {{points}} Point!</h2>
          </b-col>
        </b-row>

      <!-- 
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        boat: { type: Schema.Types.ObjectId, ref: 'boat' },
        species: { type: Schema.Types.ObjectId, ref: 'species' },
        method: String,
        length: String,
        points: Number,
        imagefile: String,
      -->

<!-- Rod {{factor_rod}}<br/>
Spear {{factor_spear}}<br/>
Points {{points}} <br/>
this.length {{this.length}} <br/> -->
      <b-row  align-v="center"  class="mb-3">
          <b-col cols="2">
            <b-button :disabled="points == 0||this.user == null||boat == null" class="mt-3" variant="primary" @click="addFish">
              Next
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h3>No stretching the truth!</h3>
          </b-col>
        </b-row>

  </b-container>

    </div>
  </div>
</template>

<script>
import FishService from "@/services/fish.service";
import UserService from "@/services/user.service";
import BoatService from "@/services/boat.service";
import SpeciesService from "@/services/species.service";


export default {
  name: "FishCreate",
  data() {
    return {
      anglers: [],
      boats: [],
      specieslist: [],
      methodlist: [{value: 'Rod', text: 'Rod'}, {value: 'Spear', text: 'Spear'}],
      lengthlist: [],
      user: null,
      boat: null,
      species: null,
      method: 'Rod',
      length: null,
      factor_rod: null,
      factor_spear: null,
      points: 0,
      pointsindex: [],
    }
  },
  computed: {
    server: function () {
      return this.$parent.server
    },
  },
  mounted() {
    this.getAnglers();
    this.getBoats();
    this.getSpecies();
  },
  methods: {
    async addFish() {
      var response = await FishService.addFish({
        user: this.user,
        boat: this.boat,
        species: this.species,
        method: this.method,
        length: this.length,
        points: this.points,
      });
      this.$router.push({
        name: "FishEdit",
        params: { id: response.data.fishid }
      });
    },
    async selectSpecies(id) {
      console.log(id)
      const response = await SpeciesService.getSpecie({
        id: id
      });

      var pointsindex = []
      var speciesLengths = this.sortLengths(response.data.lengths)
      var lengths = speciesLengths.map(function (length) {
          pointsindex[length.length] = length.points
          return { value: length.length, text: length.length }
      })
      this.pointsindex = pointsindex
      this.lengthlist = lengths
      this.length = this.lengthlist[0].value
      this.factor_rod = response.data.factor_rod
      this.factor_spear = response.data.factor_spear
      this.updatePoints()
      console.log(this.pointsindex)
      console.log(this.length)

    },
    async updatePoints() {
      console.log(this.method)
      if (this.method == 'Rod'){
        this.points = this.factor_rod * this.pointsindex[this.length]
      }else{
        this.points = this.factor_spear * this.pointsindex[this.length]
      }
    },
    async getAnglers() {
      const response = await UserService.fetchUsers()
      console.log(response.data);
      var users = response.data.map(function (user) {
            return { value: user._id, text: user.name }
      })
      
      var anglers = users

      anglers.forEach(function(user) {
        if (user.fishing != 1) {
          anglers.splice(anglers.indexOf(user), 1);
        }
      });
       this.anglers = anglers
      //Need to set selected to current user
    },
    async getBoats() {
      const response = await BoatService.fetchBoats()
      this.boats = response.data.map(function (boat) {
            return { value: boat._id, text: boat.name }
      })
    },
    async getSpecies() {
      const response = await SpeciesService.fetchSpecies()
      this.specieslist = response.data.map(function (species) {
            return { value: species._id, text: species.name }
      })
    },
    sortLengths (lengths){
      let sortedLengths = [...lengths];
      sortedLengths = sortedLengths.sort(function(a,b){
        let x = a.length.toLowerCase();
        let y = b.length.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
      });
      return sortedLengths;
    }
  }
};
</script>
<style scoped></style>
