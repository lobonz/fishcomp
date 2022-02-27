<template>
  <div class="container species mt-4">
    <h1><font-awesome-icon icon="fa-fish" /> Edit Species</h1>
    <b-form>
      <b-container>
        <b-row>
          <b-col>
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
            <div>
              <b-form-group id="name-group" label="Specie" label-for="name">
                <b-form-input
                  id="name"
                  v-model="name"
                  required
                  placeholder="SPECIES NAME"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="rodfactor-group" label="Rod Factor" label-for="rodfactor">
                <b-form-input
                  id="rodfactor"
                  v-model="factor_rod"
                  required
                  placeholder="ROD FACTOR"
                ></b-form-input>
              </b-form-group>
              <b-form-group id="rodfactor-group" label="Spear Gun Factor" label-for="speargunfactor">
                <b-form-input
                  id="speargunfactor"
                  v-model="factor_spear"
                  required
                  placeholder="SPEAR GUN FACTOR"
                ></b-form-input>
              </b-form-group>
            </div>

             <div style="margin-top: 10px;">
              <b-button variant="outline-primary" @click="updateSpecies" style="margin-top: 20px;"
                >Update Species</b-button
              >
            </div>

            <div>
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
            </div>
            

            



            <div style="margin-top:20px;">Point Groups</div>
            <b-row>
              <b-col>
                <template>
                  <div>
                    <b-table striped hover :items="lengths" :fields="lengthfields">
                      <template v-slot:cell(delete)="data">
                        <span
                          style="margin-left: 10px;" 
                          class="pointer"
                          @click="removeLength(data.item.length)"
                        >
                          <font-awesome-icon icon="times" />
                        </span>
                      </template>
                    </b-table>
                  </div>
                </template>
                </b-col>
              </b-row>
            <b-row>
              <b-col>
                <b-form-input v-model="newlength" placeholder="New Length eg. 35-45"></b-form-input>
              </b-col>
              <b-col>
                <b-row>
                  <b-col>
                    <b-form-input v-model="newpoints" placeholder="New Points"></b-form-input>
                  </b-col>
                  <b-col>
                    <span v-if="newlength && newpoints">
                      <b-button variant="outline-primary" @click="addLength" style=""
                      >Add New Length</b-button>
                    </span>
                  </b-col>
                </b-row>
              </b-col>
              
            </b-row>
            
          </b-col>
        </b-row>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import SpeciesService from "@/services/species.service";
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: "SpecieEdit",
  data() {
    return {
      name: "",
      imagefile: null,
      newImageFile: null,
      imageurl: null,
      imagesize: '600',
      lengths: [],
      lengthfields: [
          {
            key: 'length',
            sortable: true
          },
          {
            key: 'points',
            sortable: true
          },
          {
            key: 'delete',
            label: 'Delete',
            sortable: false
          }
        ],
        newlength: null,
        newpoints: null,
        factor_rod: null,
        factor_spear: null,
    };
  },
  computed: {
    server: function () {
      return this.$parent.server
    },
  },
  mounted() {
    this.getSpecies();
  },
  components: {
    FileUpload
  },
  methods: {
    async getSpecies() {
      const response = await SpeciesService.getSpecie({
        id: this.$route.params.id
      });
      this.name = response.data.name;
      this.captain = response.data.captain;
      this.imagefile = response.data.imagefile;
      this.imageurl = `${this.server}/api/images/${response.data.imagefile}/${this.imagesize}`
      this.lengths = this.sortLengths(response.data.lengths)
      this.factor_rod = response.data.factor_rod
      this.factor_spear = response.data.factor_spear
    },
    async updateSpecies() {
      await SpeciesService.updateSpecies({
        id: this.$route.params.id,
        name: this.name,
        captain: this.captain,
        factor_rod: this.factor_rod,
        factor_spear: this.factor_spear,
      });
      this.$router.push({ name: "Species" });
    },
    async removeLength (length) {
      console.log(length)
      try {
        await SpeciesService.removeLength({
          id: this.$route.params.id,
          length: length,
        });

        this.message = 'Length has been added'
        this.newlength = null
        this.newpoints = null
        this.error = false
        this.getSpecies()
        
      } catch (err) {
        console.log(err)
        this.message = err.response.data.error
        this.error = true
      }
    },
    async addLength () {
      try {
        await SpeciesService.addLength({
          id: this.$route.params.id,
          length: this.newlength,
          points: this.newpoints,
        });

        this.message = 'Length has been added'
        this.newlength = null
        this.newpoints = null
        this.error = false
        this.getSpecies()
        
      } catch (err) {
        console.log(err)
        this.message = err.response.data.error
        this.error = true
      }
    },
    async addImage () {
      try {
        const formData = new FormData()
        formData.append('id', this.$route.params.id)
        formData.append('file', this.newImageFile)

        await SpeciesService.addImage(formData)
        // {"file":{"fieldname":"file","originalname":"screen_2019-04-19_15-40-54.png","encoding":"7bit","mimetype":"image/png","destination":"./uploads/","filename":"8a9b217fdfdbc892b1c7ad8a7cdae376","path":"uploads\\8a9b217fdfdbc892b1c7ad8a7cdae376","size":3708727}}
        this.message = 'Image has been uploaded'
        this.newImageFile = null
        this.error = false
        // reset fields
        this.$refs.imageUpload.clearAllData()
        setTimeout(() => {this.getSpecies()}, 1000);//needed timeout to let server update or we got the old image
        
      } catch (err) {
        this.message = err.response.data.error
        this.error = true
      }
    },
    onImageSelected (file) {
      this.newImageFile = file
    },
    sortLengths (lengths){
      let sortedLengths;
      sortedLengths = lengths.sort(function(a,b){
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
