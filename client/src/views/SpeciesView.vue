<template>
  <div class="container species mt-4">
    <h1><font-awesome-icon icon="fa-fish" /> Species</h1>
    <div v-if="species.length > 0" class="table-wrap">
      <div>
        <b-button variant="outline-primary" :to="{ name: 'SpecieCreate' }"
          >Add Species</b-button
        >
      </div>
      <b-table-simple hover small caption-top responsive>
        <thead>
          <tr>
            <td>Name</td>
            <td>Image</td>
            <td>Rod Factor</td>
            <td>Spear Factor</td>
            <td>Point Groups</td>
            <td width="100" align="center">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="specie in species" :key="specie.id">
            <td>{{ specie.name }}</td>
            <td><img
                  style="width: 150px;"
                  :src="`${server}/api/images/${specie.imagefile}/200`"
                />
            </td>
            <td>{{ specie.factor_rod }}</td>
            <td>{{ specie.factor_spear }}</td>
            <td>
              <div v-for="length in sortLengths(specie.lengths)" :key="length.id">{{ length.points }} / {{ length.length }}</div>
            </td>
            <td align="center">
              <span class="pointer" @click="editSpecie(specie._id)">
                <font-awesome-icon icon="edit" />
              </span>
              <span
                style="margin-left: 10px;" 
                class="pointer"
                @click="deleteSpecie(specie._id)"
                v-if="species.length > 0"
              >
                <font-awesome-icon icon="times" />
              </span>
            </td>
          </tr>
        </tbody>
      </b-table-simple>
    </div>
    <div v-else>
      There are no species.. Lets add one now <br /><br />
      <b-button variant="outline-primary" :to="{ name: 'SpecieCreate' }"
        >Add Species</b-button
      >
    </div>
  </div>
</template>

<script>
import SpecieService from "@/services/species.service";
export default {
  name: "species-view",
  data() {
    return {
      species: []
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
  methods: {
    async getSpecies() {
      const response = await SpecieService.fetchSpecies();
      this.species = response.data;
      console.log(response.data);
    },
    async deleteSpecie(id) {
      await SpecieService.deleteSpecie(id);
      this.getSpecies();
      this.$router.push({ name: "Species" });
    },
    async editSpecie(id) {
      this.$router.push({ name: "SpecieEdit", params: { id: id } });
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
