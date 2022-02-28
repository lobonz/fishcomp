import ApiService from "@/services/api.service";

const FishService = {

  fetchFish() {
    return ApiService.get("fish/");
  },

  addFish(params) {
    return ApiService.post("fish/create", params);
  },

  updateFish(params) {
    return ApiService.put("fish/update/" + params.id, params);
  },

  getFish(params) {
    return ApiService.get("fish/read/" + params.id);
  },

  deleteFish(id) {
    return ApiService.delete("fish/" + id);
  },

  addImage (formData) {
    return ApiService.put('fish/addimage', formData)
  }
};

export default FishService;

export { FishService };
