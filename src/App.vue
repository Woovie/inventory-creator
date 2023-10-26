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
      <input id="productName" type="text" placeholder="Cool keyboard" />
      <label for="productNotes">Product Notes </label>
      <textarea id="productNotes" rows="4"></textarea>
      <button>Submit</button>
    </div>
    <canvas id="photoStore" :style="{width, height}"></canvas>
  </div>
</template>

<script>
  import CameraTooling from './components/CameraTooling.vue'
  import PictureAngles from './components/PictureAngles.vue'


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
        height: 2160
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
        context.drawImage(videoPreview, 0, 0, this.width, this.height)
        const data = imageHolder.toDataURL("image/png")
        const current
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
    flex-direction: column;
  }

  #photoStore {
    display: none;
  }
</style>
