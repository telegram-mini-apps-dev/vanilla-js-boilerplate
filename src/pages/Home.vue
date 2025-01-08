<template>
    <div class="home">
      <CharacterList />
      <!-- <ImageAdjust /> -->
    </div>
  </template>
  
  <script>
  // import ImageWaterfall from './ImageWaterfall.vue'÷
  import CharacterList from './CharacterList.vue';
// import CharacterList from './CharacterList.vue'
  // import ImageAdjust from '../components/ImageAdjust.vue';
// import ImageAdjust from '../components/ImageAdjust.vue'
  
  export default {
    name: 'Home',
    components: {
      // ImageAdjust
      CharacterList
    }
  }
  </script>