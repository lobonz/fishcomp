import ApiService from "@/services/api.service";

const BoatService = {

  fetchBoats() {
    return ApiService.get("boats/");
  },

  addBoat(params) {
    return ApiService.post("boats/create", params);
  },

  updateBoat(params) {
    return ApiService.put("boats/update/" + params.id, params);
  },

  getBoat(params) {
    return ApiService.get("boats/read/" + params.id);
  },

  deleteBoat(id) {
    return ApiService.delete("boats/" + id);
  },

  addImage (formData) {
    return ApiService.put('boats/addimage', formData)
  }
};

export default BoatService;

export { BoatService };
