<template>
  <div class="angleContainer" :class="{ selected: selectedAngle }" :idx="key">
    <h1>{{ angleName }}</h1>
    <img v-if="imageData" class="imagePreview" :src="imageData" alt="Image Preview" />
    <div class="imagePreview">No image taken</div>
  </div>
</template>

<script>
  export default {
    name: 'PictureAngles',
    props: [
      'angleName',
      'imageData',
      'selectedAngle',
      'key'
    ]
  }
</script>

<style scoped>
  * {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
  .angleContainer {
    margin-top: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: 0.25rem;
    box-shadow: 0px 2px 8px var(--flexoki-950);
    background-color: var(--flexoki-950);
  }

  h1 {
    padding: 0.75rem;
    line-height: 2rem;
    font-size: 2rem;
    margin: 0 auto;
  }

  .selected {
    box-shadow: 0px 2px 8px var(--flexoki-green-600);
    background-color: var(--flexoki-green-400);
  }

  .imagePreview {
    width: 100%;
    aspect-ratio: 16/9;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
</style>