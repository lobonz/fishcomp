import ApiService from "@/services/api.service";

const SpecieService = {

  fetchSpecies() {
    return ApiService.get("species/");
  },

  addSpecie(params) {
    return ApiService.post("species/create", params);
  },

  updateSpecies(params) {
    return ApiService.put("species/update/" + params.id, params);
  },

  getSpecie(params) {
    return ApiService.get("species/read/" + params.id);
  },

  deleteSpecie(id) {
    return ApiService.delete("species/" + id);
  },

  addImage (formData) {
    return ApiService.put('species/addimage', formData)
  },

  addLength (params) {
    return ApiService.post('species/addlength', params)
  },

  removeLength (params) {
    return ApiService.put('species/removelength', params)
  }
};

export default SpecieService;

export { SpecieService };
