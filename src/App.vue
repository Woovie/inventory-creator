<template>
  <div id="contentHolder">
    <CameraTooling
      :camera="chosenCamera"
      :active="cameraActive"
      :preferredWidth="width"
      :preferredHeight="height"
    ></CameraTooling>
    <div id="cameraControls">
      <select
        @change="changeCamera"
        v-model="chosenCamera"
        id="cameraSelect"
      >
        <option
          v-for="camera in cameras"
          :value="camera.deviceId"
        >
          {{ camera.label }}
        </option>
      </select>
      <button @click="takePicture">Take picture</button>
      <button @click="toggleCamera">{{ cameraStatus }} camera</button>
    </div>
    <div id="cameraAngles">
      <PictureAngles
        v-for="(angle, index) in angles"
        @click="setAngle(angle)"
        :angleName="angle"
        :selectedAngle="selectedAngle == index"
        :id="angle"
        :imageData="images[index]"
      ></PictureAngles>
    </div>
    <div id="forms">
      <label for="productName">Product Name </label>
      <input id="productName" type="text" placeholder="Cool keyboard" v-model="keyboardName" />
      <label for="productNotes">Product Notes </label>
      <textarea id="productNotes" rows="4" v-model="keyboardDesc"></textarea>
      <button @click="completeForm">Submit</button>
    </div>
    <canvas id="photoStore" :style="{width, height}"></canvas>
  </div>
</template>

<script>
  import CameraTooling from './components/CameraTooling.vue'
  import PictureAngles from './components/PictureAngles.vue'
  import JSZip from 'jszip'
  import { saveAs } from 'file-saver'


  export default {
    components: {
    CameraTooling,
    PictureAngles,
},
    data() { 
      return {
        cameras: [],
        chosenCamera: null,
        cameraActive: false,
        angles: [
          'Top',
          'Front',
          'Back',
          'Side'
        ],
        selectedAngle: 0,
        images: [
        ],
        width: 3840,
        height: 2160,
        keyboardName: '',
        keyboardDesc: ''
      }
    },
    mounted() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.cameras = devices
      })
    },
    methods: {
      setAngle(angleName) {
        this.selectedAngle = this.angles.indexOf(angleName)
      },
      toggleCamera() {
        this.cameraActive = !this.cameraActive
      },
      takePicture() {
        const imageHolder = document.querySelector('#photoStore')
        const videoPreview = document.querySelector('#videoPreview')
        const context = imageHolder.getContext("2d")
        imageHolder.width = this.width
        imageHolder.height = this.height
        context.drawImage(videoPreview, 0, 0, this.width, this.height)
        const data = imageHolder.toDataURL("image/png")
        this.images[this.selectedAngle] = data
      },
      completeForm() {
        const zip = new JSZip()

        zip.file("metadata.json", JSON.stringify({
          keyboardName: this.keyboardName,
          description: this.keyboardDesc
        }))

        const imageDirectory = zip.folder("images")
        for (let imageIndex in this.images) {
          const blobbed = this.dataURLtoBlob(this.images[imageIndex])
          imageDirectory.file(
            `${this.keyboardName}-${this.angles[imageIndex]}.png`,
            blobbed
          )
        }

        zip.generateAsync({
          type: "blob"
        }).then((content) => {
          saveAs(content, `${this.keyboardName}.zip`)

          this.keyboardName = ''
          this.keyboardDesc = ''
          this.images = []
          this.selectedAngle = 0
        })
      },
      dataURLtoBlob(dataurl) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        return new Blob([Uint8Array.from(atob(arr[1]), c => c.charCodeAt(0))], {type: mime});
      }
    },
    computed: {
      cameraStatus() {
        if (this.cameraActive) {
          return "Disable"
        }
        return "Enable"
      }
    }
  }
</script>

<style scoped>
  h1 {
    margin-top: 2rem;
  }

  p {
    display: unset;
    margin-block: unset;
    margin-inline: unset;
  }

  #contentHolder {
    width: 80%;
    max-width: 75rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }

  #cameraControls {
    width: 100%;
    padding: 0.25rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  #cameraAngles {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 0.5rem;
    width: 100%;
  }

  #forms {
    display: flex;
    width: 50%;
    flex-direction: column;
  }

  #productNotes {
    height: 12rem;
  }

  #photoStore {
    display: none;
  }
</style>
