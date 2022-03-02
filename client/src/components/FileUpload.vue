<template>
  <form @submit.prevent="sendFile" enctype="multipart/form-data">
    <div v-if="message"
      :class="`message ${error ? 'is-danger' : 'is-success'}`"
    >
      <div class="message-body">{{message}}</div>
    </div>

    <div id="file-default__BV_file_outer_" class="custom-file b-form-file is-valid">
      <input type="file" :id="id" class="form-control" ref="file" @change="selectFile" >
      <!--<label :for="id" data-browse="Browse" class="custom-file-label" style="z-index: 0;">{{file.name}}</label>-->
    </div>

  </form>
</template>

<script>

function initialState () {
  return {
    file: '',
    message: '',
    error: false,
    id: 'file-default'
  }
}

export default {
  name: 'FileUpload',
  props: {
    allowedtypes: {
      type: Array,
      required: false,
      default: function () {
        return ['video/mp4', 'image/jpeg', 'image/png', 'image/gif']
      }
    }
  },
  data () {
    return initialState()
  },
  mounted(){
    this.id = this._uid
  },
  methods: {
    clearAllData () {
      console.log("CLEARED")
      this.$refs.file.value = "";
      Object.assign(this.$data, initialState())
    },
    selectFile () {
      console.log(this.$refs.file.files[0].name)
      const file = this.$refs.file.files[0]
      //const file = this.filefield
      const MAX_SIZE = 500 * 1000000// n * Megabytes
      const toolarge = file.size > MAX_SIZE
      //this.allowedtypes.includes(file.type) &&
      if ( !toolarge) {
        this.file = file
        this.error = false
        this.message = ''

        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', file.name)
        // Emit the FormData and file name to the parent component
        this.$emit('fileSelected', file)
        console.log('emitted form data')
      } else {
        this.error = true
        this.message = toolarge ? `Too large. Max filesize is ${MAX_SIZE / 1000}Kb` : 'Incorrect File Type. ' + file.type
      }
    }
  }
}
</script>
