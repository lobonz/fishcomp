<template>
  <div class="container fish mt-4">
    <h1><font-awesome-icon icon="fa-ship" /> Edit Fish</h1>
    <b-form>

      <b-container>

        <b-row>
          <div>
              <span v-if="imagefile">
                <img
                  style="width:400px"
                  :src="imageurl"
                />
              </span>
              <span v-else>
                <img style="width: 100px;" src="/images/image-placeholder.jpg" />
              </span>
            </div>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group
                style="margin-top:20px;"
                id="imagefile-group"
                label="Image"
                label-for="imagefile"
              >
              <b-row>
                
                <b-col>
                  <file-upload
                  :allowedtypes="['image/jpeg', 'image/png']"
                  @fileSelected="onImageSelected"
                  ref="imageUpload"
                />
                </b-col>
                <b-col>
                  <span v-if="newImageFile">
                  <b-button
                    :disabled="this.newImageFile == null"
                    variant="outline-primary"
                    @click="addImage"
                  >
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    Update Image
                  </b-button>
                  </span>
                </b-col>
              </b-row>
              </b-form-group>
          </b-col>
        </b-row>

        <b-row  align-v="center"  class="mb-3">
          <b-col cols="2">
            <b-button :disabled="points == 0||this.user == null||boat == null" class="mt-3" variant="outline-primary" @click="updateFish">
              Update Fish
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div>
            <h3>No stretching the truth!</h3>
            </div>
          </b-col>
        </b-row>

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
            <div v-if="species != null">
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
      

  </b-container>
    </b-form>
  </div>
</template>

<script>
import FishService from "@/services/fish.service";
import UserService from "@/services/user.service";
import BoatService from "@/services/boat.service";
import SpeciesService from "@/services/species.service";
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: "FishEdit",
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
      imagefile: null,
      newImageFile: null,
      imageurl: null,
      imagesize: '600',
    };
  },
  computed: {
    server: function () {
      return this.$parent.server
    },
  },
  mounted() {
    this.getFish();
    this.getAnglers();
    this.getBoats();
    this.getSpecies();
  },
  components: {
    FileUpload
  },
  methods: {
    async getFish() {
      const response = await FishService.getFish({
        id: this.$route.params.id
      });
      this.user = response.data.user
      this.boat = response.data.boat
      this.species = response.data.species
      this.selectSpecies(this.species, true)
      this.method = response.data.method
      this.length = response.data.length
      this.points = response.data.points
      this.imagefile = response.data.imagefile
      this.imageurl = `${this.server}/api/images/${response.data.imagefile}/${this.imagesize}`
      console.log(this.imageurl)
    },
    async updateFish() {
      await FishService.updateFish({
        id: this.$route.params.id,
        user: this.user,
        boat: this.boat,
        species: this.species,
        method: this.method,
        length: this.length,
        points: this.points,
      });
      this.$router.push({ name: "Fish" });
    },
    async addImage () {
      try {
        const formData = new FormData()
        formData.append('id', this.$route.params.id)
        formData.append('file', this.newImageFile)

        await FishService.addImage(formData)
        // {"file":{"fieldname":"file","originalname":"screen_2019-04-19_15-40-54.png","encoding":"7bit","mimetype":"image/png","destination":"./uploads/","filename":"8a9b217fdfdbc892b1c7ad8a7cdae376","path":"uploads\\8a9b217fdfdbc892b1c7ad8a7cdae376","size":3708727}}
        this.message = 'Image has been uploaded'
        this.newImageFile = null
        this.error = false
        // reset fields
        this.$refs.imageUpload.clearAllData()
        setTimeout(() => {this.getFish()}, 1000);//needed timeout to let server update or we got the old image
        
      } catch (err) {
        this.message = err.response.data.error
        this.error = true
      }
    },
    onImageSelected (file) {
      this.newImageFile = file
    },
    async selectSpecies(id, dontSetDefault) {
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
      if (!dontSetDefault) {this.length = this.lengthlist[0].value}
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
