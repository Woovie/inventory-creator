<template>
  <video id="videoPreview" class="cameraPreview">Video stream not available</video>
</template>

<script>
  export default {
    name: 'CameraTooling',
    props: [
      'camera',
      'active',
      'preferredWidth',
      'preferredHeight'
    ],
    data() {
      return {
        streaming: false,
        videoOptions: {
          width: {
            ideal: this.preferredWidth
          },
          height: {
            ideal: this.preferredHeight
          }
        },
        actualWidth: 0,
        actualHeight: 0
      }
    },
    methods: {
      changeCamera() {
        const videoElement = document.querySelector(`#videoPreview`)

        this.actualWidth = 0
        this.actualHeight = 0

        delete this.videoOptions.deviceId

        if (this.camera) {
          this.videoOptions.deviceId = this.camera
        }

        navigator.mediaDevices.getUserMedia({
          video: this.videoOptions,
          audio: false
        })
        .then((stream) => {
          videoElement.srcObject = stream
          videoElement.play()
        })

        videoElement.addEventListener("canplay",
        (_event) => {
          this.streaming = true
          this.actualWidth = videoElement.videoWidth
          this.actualHeight = videoElement.videoHeight
        }, false)
      }
    },
    mounted() {
      if (this.active === true) { // for some reason this keeps activating, so we do ===
        this.changeCamera()
      }
    },
    watch: {
      camera() {
        if (this.active === true) {
          this.changeCamera()
        }
      },
      active() {
        if (this.active === true) {
          this.changeCamera()
        } else {
          const videoElement = document.querySelector('#videoPreview')
          const stream = videoElement.srcObject
          const tracks = stream.getTracks()
          for (let track of tracks) {
            track.stop()
          }
          videoElement.srcObject = null
        }
      }
    }
  }
</script>

<style>
  .cameraPreview {
    padding-top: 1rem;
    width: 100%;
    aspect-ratio: 16/9;
  }
</style>