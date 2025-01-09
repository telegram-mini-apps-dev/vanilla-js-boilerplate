<template>
  <div class="character-page">
    <div class="back-button" @click="goBack">
      <span>←</span>
    </div>
    <div class="chat-container" :style="{ backgroundImage: `url(${imageData})` }">
      <div class="chat-history">
        <div v-for="(message, index) in chatHistory" :key="index" 
             :class="['message', message.type]">
          <div class="message-content">{{ message.text }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
          type="text"
        >
        <button @click="sendMessage">Send</button>
      </div>
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
      recommendData: [],
      chatHistory: [], // Array to store chat messages
      newMessage: ""   // For input message
    }
  },
  methods: {
    async fetchRecommendData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/AllanChen/sexsex/refs/heads/master/src/assets/sexy.json');
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
    },
    goBack() {
      this.$router.go(-1);  // Assuming ImageWaterfall is at root route
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      // Add user message
      this.chatHistory.push({
        type: 'user',
        text: this.newMessage
      });

      // Simulate AI response (you can replace this with actual API call)
      setTimeout(() => {
        this.chatHistory.push({
          type: 'ai',
          text: `I received: ${this.newMessage}`
        });
      }, 1000);

      this.newMessage = ""; // Clear input
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

.chat-container {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px;
}

.user {
  align-self: flex-end;
  background-color: rgba(0, 132, 255, 0.8);
  color: white;
}

.ai {
  align-self: flex-start;
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
}

.chat-input {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.chat-input button {
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0073e6;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  z-index: 1;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>
