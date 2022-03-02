<template>
  <div>
    <h1>Edit User</h1>
    <b-form>
      <b-container>
        <b-row>
          <b-col>
            <div>
              <b-form-group id="name-group" label="Name" label-for="name">
                <b-form-input
                  id="name"
                  v-model="name"
                  required
                  placeholder="NAME"
                ></b-form-input>
              </b-form-group>
            </div>

            <div>
              <b-form-group id="email-group" label="Email" label-for="email">
                <b-form-input
                  id="email"
                  v-model="email"
                  required
                  placeholder="EMAIL"
                ></b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-form-group
                id="password-group"
                label="New Password"
                label-for="password"
              >
                <b-form-input
                  id="password"
                  v-model="password"
                  required
                  placeholder="PASSWORD"
                ></b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-form-group
                id="fishing-group"
                label="Fishing"
                label-for="fishing"
              >
                <b-form-checkbox
                  id="fishing"
                  v-model="fishing"
                  name="fishing"
                  value="1"
                  unchecked-value="0"
                >
                </b-form-checkbox>
              </b-form-group>
            </div>

            <div>
              <b-form-group
                id="admin-group"
                label="Admin"
                label-for="admin"
              >
                <b-form-checkbox
                  id="admin"
                  v-model="admin"
                  name="admin"
                  value="1"
                  unchecked-value="0"
                >
                </b-form-checkbox>
              </b-form-group>
            </div>


            <div>
              <b-button variant="outline-primary" @click="updateUser"
                >Update User</b-button
              >
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import UserService from "@/services/user.service";
export default {
  name: "UserEdit",
  data() {
    return {
      name: "",
      email: "",
      password: null,
      fishing: 0,
      admin: 0
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const response = await UserService.getUser({
        id: this.$route.params.id
      });
      this.name = response.data.name;
      this.email = response.data.email;
      this.fishing = response.data.fishing;
      this.admin = response.data.admin;
    },
    async updateUser() {
      await UserService.updateUser({
        id: this.$route.params.id,
        name: this.name,
        email: this.email,
        password: this.password,
        fishing: this.fishing,
        admin: this.admin
      });
      this.$router.push({ name: "Users" });
    }
  }
};
</script>
<style scoped></style>
