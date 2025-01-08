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
      imageData: "",       
      selectedIndex: 0,
      recommendData: []
    }
  },
  methods: {
    async fetchRecommendData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/AllanChen/sexsex/refs/heads/master/src/assets/recommend.json');
        this.recommendData = await response.json();
      } catch (error) {
        console.error('Error fetching recommend data:', error);
        this.recommendData = []; // Fallback to empty array if fetch fails
      }
    },
    async loadAllData() {
      await this.fetchRecommendData();
      if (this.recommendData.length > 0) {
        this.imageData = this.recommendData[this.selectedIndex].image_url;
      }
    }
  },
  
  async created() {    
    if (this.$route.params.index) {
      this.selectedIndex = parseInt(this.$route.params.index);
    }
    await this.loadAllData();
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
