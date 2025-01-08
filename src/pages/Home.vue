<template>
    <div class="home">
      <ImageWaterfall />
      <!-- <ImageAdjust /> -->
    </div>
  </template>
  
  <script>
  import ImageWaterfall from './ImageWaterfall.vue'
  // import ImageAdjust from '../components/ImageAdjust.vue';
// import ImageAdjust from '../components/ImageAdjust.vue'
  
  export default {
    name: 'Home',
    components: {
      // ImageAdjust
      ImageWaterfall
    }
  }
  </script>