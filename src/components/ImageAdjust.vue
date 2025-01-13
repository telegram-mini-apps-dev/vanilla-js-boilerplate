<template>

  <div class="image-adjust">
    <div class="image-container">
      <img :src="decodedImageUrl" :alt="decodedDescription" class="main-image">
      <div class="white-overlay"></div>
    </div>
    <div class="controls">
      <button class="back-btn" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ImageAdjust',
  computed: {
    decodedImageUrl() {
      console.log('Image URL:', this.$route.params.imageUrl);
      return this.$route.params.imageUrl || ''
    }, 
    decodedDescription() {
      return this.$route.params.description || ''
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.image-adjust {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1000;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;  
}

.main-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  display: block;
}

.white-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
}

.back-btn {
  padding: 8px 16px;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background: #f0f0f0;
}
</style> 