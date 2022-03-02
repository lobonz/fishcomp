<template>
  <div class="container fish mt-4">
    <h1><font-awesome-icon icon="fa-trophy" /> Scores</h1>
    <b-container>

      <b-row>
        <b-col class="d-flex justify-content-center">
          <h1><font-awesome-icon icon="fa-ship" /> Boats</h1>
        </b-col>
      </b-row>

      <div v-for="(boat, index) in results_boats" :key="index">
        <b-card class="overflow-hidden border border-5 mb-4 border-dark">
            <div style="position: absolute; display: block; right: 2em;top: 3em;" v-if="index == 0">
              <p class="brand-badge">Category Winner</p>
            </div>
          <b-card-text>
            <span class="h3" style="font-weight: 600;">{{ boat.name }}</span> / <span class="h4" style="font-weight: 300;">{{ boat.boat.captain }}</span>
            <!-- <h3 style="font-weight: 600;">{{ fish.user.name }} / {{ fish.boat.name }}</h3> -->
            <h4 class="mt-2">Points: {{ boat.points }}</h4>
            <h4 v-for="(value, key) in boat.species" :key="key">{{ key }}: {{value}}</h4>
          </b-card-text>
        </b-card>
      </div>

      <b-row>
        <b-col class="d-flex justify-content-center">
          <h1><font-awesome-icon icon="users" /> Fishermen</h1>
        </b-col>
      </b-row>

      <div v-for="(user, index) in results_users" :key="'user' + index">
        <b-card class="overflow-hidden border border-5 mb-4 border-dark">
            <div style="position: absolute; display: block; right: 2em;top: 3em;" v-if="index == 0">
              <p class="brand-badge">Category Winner</p>
            </div>
          <b-card-text>
            <span class="h3" style="font-weight: 600;">{{ user.name }}</span>
            <!-- <h3 style="font-weight: 600;">{{ fish.user.name }} / {{ fish.user.name }}</h3> -->
            <h4 class="mt-2">Points: {{ user.points }}</h4>
            <h4 v-for="(value, key) in user.species" :key="key">{{ key }}: {{value}}</h4>
          </b-card-text>
        </b-card>
      </div>





      <b-row>
        <b-col class="d-flex justify-content-center">
          <h1>Total Fish Caught: {{scores.total}}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-list-group v-for="(value, key) in scores.species" :key="'species'+key">
            <b-list-group-item><h3 variant="primary">{{ key }}</h3></b-list-group-item>
            <b-list-group-item>QTY: {{value.amount}}</b-list-group-item>
            <b-list-group-item>POINTS: {{value.points}}</b-list-group-item>
            </b-list-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="d-flex justify-content-center">
          <h1>Methods Used</h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-list-group v-for="(method, key) in scores.method" :key="'method'+key">
            <b-list-group-item><h3 variant="primary">{{ key }}</h3></b-list-group-item>
            <b-list-group-item>POINTS: {{method.points}}</b-list-group-item>
            <b-list-group-item>
              <b-list-group v-for="(methodspecies, key) in method.species" :key="'methodspecies'+key">
                <b-list-group-item>{{methodspecies}} x {{key}}</b-list-group-item>
              </b-list-group>
            </b-list-group-item>
            </b-list-group>
        </b-col>
      </b-row>

    </b-container>
    
    <div v-if="fish.length > 0" >

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
      fish: [],
      scores: {},
      results_boats: [],
      results_users: [],
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
      // console.log(response.data);
      this.tallyScores();
      this.resultsBoats()
      this.resultsUsers()
    },
    resultsUsers(){
      var users = []
      for (const [key, value] of Object.entries(this.scores.users)) {
        // console.log(key, value);
        //add User name to stats array
        value.name = key
        users.push(value)
      }

      users = users.sort(function(a,b){
        if(a.points>b.points){return -1;}
        if(a.points<b.points){return 1;}
        return 0;
      });

      // console.log('users')
      // console.log(users)
      this.results_users = users
    },
    resultsBoats(){
      var boats = []
      for (const [key, value] of Object.entries(this.scores.boats)) {
        // console.log(key, value);
        //add Boat name to stats array
        value.name = key
        boats.push(value)
      }

      boats = boats.sort(function(a,b){
        if(a.points>b.points){return -1;}
        if(a.points<b.points){return 1;}
        return 0;
      });

      // console.log('boats')
      // console.log(boats)
      this.results_boats = boats
    },

    tallyScores() {
      var scores = { boats: {}, users: {}, species: {}, method: {}, total: 0}
      
      this.fish.forEach(function(fish) {
        var species = {}
        //BOATS
        if (!(fish.boat.name in scores['boats'])){ //Check Boat is defined
          scores['boats'][fish.boat.name] = {points: fish.points, boat: fish.boat}
          // if ('imagefile' in fish.boat){
          //   scores['boats']['imagefile'] = fish.boat.imagefile
          // }
          
        }else{
          scores['boats'][fish.boat.name].points = scores['boats'][fish.boat.name].points + fish.points
        }

        if (!('species' in scores['boats'][fish.boat.name])){ //check if Boat Species is defined
          species = {}
          species[fish.species.name] = 1
          scores['boats'][fish.boat.name].species = species
        }else{
          //Need to check if fish is defined as there may be more than the inital one we put it
          if (scores['boats'][fish.boat.name].species[fish.species.name]){
            scores['boats'][fish.boat.name].species[fish.species.name] = scores['boats'][fish.boat.name].species[fish.species.name] + 1
          }else{
            scores['boats'][fish.boat.name].species[fish.species.name] = + 1
          }
        }

        //USERS
        if (!(fish.user.name in scores['users'])){ //Check user is defined
          scores['users'][fish.user.name] = {points: fish.points}
        }else{
          scores['users'][fish.user.name].points = scores['users'][fish.user.name].points + fish.points
        }

        if (!('species' in scores['users'][fish.user.name])){ //check if user Species is defined
          species = {}
          species[fish.species.name] = 1
          scores['users'][fish.user.name].species = species
        }else{
          //Need to check if fish is defined as there may be more than the inital one we put it
          if (scores['users'][fish.user.name].species[fish.species.name]){
            scores['users'][fish.user.name].species[fish.species.name] = scores['users'][fish.user.name].species[fish.species.name] + 1
          }else{
            scores['users'][fish.user.name].species[fish.species.name] = + 1
          }
        }

        //SPECIES
        if (!(fish.species.name in scores['species'])){ //Check species is defined
          scores['species'][fish.species.name] = {points: fish.points}
        }else{
          scores['species'][fish.species.name].points = scores['species'][fish.species.name].points + fish.points
        }
        if (!('amount' in scores['species'][fish.species.name])){ //Check amount is defined
          scores['species'][fish.species.name]['amount'] = 1
        }else{
          scores['species'][fish.species.name]['amount'] = scores['species'][fish.species.name]['amount'] + 1
        }

        //METHOD
        if (!(fish.method in scores['method'])){ //Check method is defined
          scores['method'][fish.method] = {points: fish.points}
        }else{
          scores['method'][fish.method].points = scores['method'][fish.method].points + fish.points
        }
        
        if (!('species' in scores['method'][fish.method])){ //check if user Species is defined
          species = {}
          species[fish.species.name] = 1
          scores['method'][fish.method].species = species
        }else{
          //Need to check if fish is defined as there may be more than the inital one we put it
          if (scores['method'][fish.method].species[fish.species.name]){
            scores['method'][fish.method].species[fish.species.name] = scores['method'][fish.method].species[fish.species.name] + 1
          }else{
            scores['method'][fish.method].species[fish.species.name] = + 1
          }
        }

        //TOTALS
        scores.total++

      });
      // console.log(scores)
      this.scores = scores
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
<style scoped>
.brand-badge 
{
  text-align: center;
  font-weight: 600;
  width: 35vw;
  display:inline-block;
  font-size: 3vw;
  background: rgb(235,235,236);
  background: linear-gradient(90deg, rgba(252,186,3,1) 0%,
rgba(252,234,182,1) 26%,
rgba(252,186,3,1) 58%,
    rgba(252,217,121,1) 100%);
  transform: skew(-15deg);
  padding:0.6rem 0rem;
  
  /*Shadow*/
  webkit-box-shadow: 0.2rem 0.2rem 0px 0.1rem rgb(63, 63, 63);
  -moz-box-shadow: 0.2rem 0.2rem 0px 0.1rem rgba(63, 63, 63);
  box-shadow: 0.4rem 0.4rem 0px -1px rgba(63, 63, 63);
}
</style>
