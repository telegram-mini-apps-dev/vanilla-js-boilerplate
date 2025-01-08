<template>
  <div class="character-page">
    <div class="image-container">
      <img :src="imageData" :alt="imageData.description?.join(', ')">
    </div>
    <div class="description">
      <p>{{ imageData.description?.join(', ') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Character',
  data() {
    return {
    imageData: ""       
    }
  },
  created() {
    // Get the data passed through route
    console.log(this.$route.params.imageData)
    // this.imageData = this.$route.params.imageData || {};
    if (this.$route.params.imageData) {
      this.imageData = this.$route.params.imageData;
    } else {
      console.error('No image data provided');
    }
  }
}
</script>

<style scoped>
.character-page {
  width: 100%;
  height: 100vh;
  background: #fff;
}

.image-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

.description {
  padding: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
