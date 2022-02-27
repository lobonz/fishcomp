<template>
  <div class="container boats mt-4">
    <h1><font-awesome-icon icon="fa-ship" /> Edit Boat</h1>
    <b-form>
      <b-container>
        <b-row>
          <b-col>
            <div>
              <span v-if="imagefile">
                <img
                  style="height: 400px;"
                  :src="imageurl"
                />
              </span>
              <span v-else>
                <img style="width: 100px;" src="/images/image-placeholder.jpg" />
              </span>
            </div>
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
                  placeholder="CAPTAINS NAME"
                ></b-form-input>
              </b-form-group>
            </div>

            <div>

              <b-form-group
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

            

            <div style="margin-top: 10px;">
              <b-button variant="outline-primary" @click="updateBoat" style="margin-top: 20px;"
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
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: "BoatEdit",
  data() {
    return {
      name: "",
      captain: "",
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
    this.getBoat();
  },
  components: {
    FileUpload
  },
  methods: {
    async getBoat() {
      const response = await BoatService.getBoat({
        id: this.$route.params.id
      });
      this.name = response.data.name;
      this.captain = response.data.captain;
      this.imagefile = response.data.imagefile;
      this.imageurl = `${this.server}/api/images/${response.data.imagefile}/${this.imagesize}`
      console.log(this.imageurl)
    },
    async updateBoat() {
      await BoatService.updateBoat({
        id: this.$route.params.id,
        name: this.name,
        captain: this.captain,
        imagefile: this.imagefile
      });
      this.$router.push({ name: "Boats" });
    },
    async addImage () {
      try {
        const formData = new FormData()
        formData.append('id', this.$route.params.id)
        formData.append('file', this.newImageFile)

        await BoatService.addImage(formData)
        // {"file":{"fieldname":"file","originalname":"screen_2019-04-19_15-40-54.png","encoding":"7bit","mimetype":"image/png","destination":"./uploads/","filename":"8a9b217fdfdbc892b1c7ad8a7cdae376","path":"uploads\\8a9b217fdfdbc892b1c7ad8a7cdae376","size":3708727}}
        this.message = 'Image has been uploaded'
        this.newImageFile = null
        this.error = false
        // reset fields
        this.$refs.imageUpload.clearAllData()
        setTimeout(() => {this.getBoat()}, 1000);//needed timeout to let server update or we got the old image
        
      } catch (err) {
        this.message = err.response.data.error
        this.error = true
      }
    },
    onImageSelected (file) {
      this.newImageFile = file
    }
  }
};
</script>
<style scoped></style>
