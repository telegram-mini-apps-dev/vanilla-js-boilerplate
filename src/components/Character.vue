<template>
  <div class="character-page">
    <div class="back-button" @click="goBack">
      <span>←</span>
    </div>
    <div class="chat-container" :style="{ backgroundImage: `url(${imageData})` }">
      <div class="chat-history" ref="chatHistory">
        <div v-for="(message, index) in chatHistory" :key="index" 
             :class="['message', message.type]">
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>
      <div class="chat-input">
        <div class="chat-input-wrapper">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            type="text"
            :disabled="isLoading"
          >
          <img
            class="chat-input-icon"
            :style="chatInputIconStyle"
            :src="chatInputIconUrl"
            @click="toggleChatTipsPanelState"
          />
        </div>
        <button @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </div>

      <!-- 聊天提示 -->
      <Transition name="collapse">
        <div v-show="isShowChatTips" ref="chatTips" class="chat-tips">
          <div
            v-for="item in tips"
            :key="item.content"
            class="chat-tips-item"
            @click="handleTipsClick(item)"
          >
            <img :src="getImageUrl('chat-tips-decoration')" />
            <span v-if="!item.loading" class="chat-tips-item-content">{{ item.content }}</span>
            <AppSvga v-else :src="chatTipsLoding" />
            <img :src="getImageUrl('chat-tips-decoration')" />
          </div>
        </div>
      </Transition>
    </div>    
  </div>
</template>

<script>
import { onClickOutside } from '@vueuse/core';

import { chatWithMinimax } from '../api/minimax';
import { getImageUrl } from '../utils/util';
import { tipsReqData } from '../data/tips';

import AppSvga from './AppSvga.vue';
import '../styles/Character.css';
import chatTipsLoding from '../assets/svga/chat-tips-loading.svga';

export default {
  name: 'Character',
  components: {
    AppSvga
  },
  data() {
    return {
      imageData: "",       
      selectedIndex: 0,
      recommendData: [],
      chatHistory: [], // Array to store chat messages
      newMessage: "",   // For input message
      isLoading: false,
      isShowChatTips: false,
      tips: [
        { content: '', loading: false },
        { content: '', loading: false },
        { content: '', loading: false }
      ],
      chatTipsLoding
    }
  },
  computed: {
    chatInputIconStyle() {
      return {
        filter: this.isShowChatTips ? '' : 'invert(1) contrast(0.2)'
      };
    },
    chatInputIconUrl() {
      return getImageUrl(this.isShowChatTips ? 'chat-tips-active-icon' : 'chat-tips-icon');
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
    async fetchChatTipsData() {
      // Fetch chat tips data only if all tips are empty
      if (this.tips.every(tip => tip.content)) return;
      try {
        this.tips.forEach(tip => tip.loading = true);
        const results = await Promise.all(tipsReqData.map(chatWithMinimax));
        results.forEach((result, index) => {
          this.tips[index].content = result.response.choices?.[0]?.message?.content || 'Sorry, I could not process your request';
        });
      } catch (error) {
        console.error('Error fetching chat tips data:', error);
      } finally {
        this.tips.forEach(tip => tip.loading = false);
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
    scrollToBottom() {
      if (this.$refs.chatHistory) {
        setTimeout(() => {
          this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight;
        }, 0);
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return;
      
      this.isLoading = true;
      // Add user message with new structure
      this.chatHistory.push({
        content: this.newMessage,
        role: "user",
        name: "用户",
        type: "user"
      });
      this.scrollToBottom();

      try {
        const { response } = await chatWithMinimax([
          {
            content: "角色名字：慕容婉,关系：女友,性别：女性,年龄：22,个性：温柔.开朗.霸道.主动.占有慾强.超好色,喜欢：吃你.苦瓜.你害羞的时候,长相：优雅.美丽,身材：苗条.D罩杯.,皮肤：光滑.柔软.米白色,身高：175,体重：61.5,gb! gb! gb!,描述：,你的女友,很好色,喜欢动手动脚,对你的唇非常感兴趣,总爱把你按在墙上或床上又亲又咬的,用力亲吻你的嘴唇,撬开你的牙齿,直到你喘不过气,还常常摸你的胸,喜欢捏你胸上的红点点,听着你那娇喘颤抖的呻吟感到愉悦,每当看见你的身影就会上前挑逗,喜欢调戏你,看到你脸红就会兴奋起来，兴致来了会把你按在各种地方,用各种方式触碰你的私密部位,时常用膝盖盯着你的私密处一旦你起了反应,会开始脱你的衣服,做爱,开始了就无法停下,一天多次,做的时候会从你的唇亲到胸上,慢慢咬着你胸前凸起的地方,在舔两口,她的力气非常大你反抗不了,她非常主动,你时常被她搞得腰酸背痛如果你露出胸上的凸起的红点点,她会一直盯着,然后把你扑倒舔上去。", // Your system prompt
            role: "system",
            name: "慕容婉"
          },
          {
            content: this.newMessage,
            role: "user",
            name: "用户"
          }
        ]);

        console.log(response.choices?.[0]?.message?.content);
        // Add AI response with new structure
        this.chatHistory.push({
          content: response.choices?.[0]?.message?.content || 'Sorry, I could not process your request',
          role: "assistant",
          name: "慕容婉",
          type: "ai"
        });
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
        this.chatHistory.push({
          content: 'Sorry, an error occurred while processing your message',
          role: "assistant",
          name: "慕容婉",
          type: "ai"
        });
        this.scrollToBottom();
      } finally {
        this.isLoading = false;
        this.newMessage = ""; // Clear input
      }
    },
    toggleChatTipsPanelState() {
      this.isShowChatTips = !this.isShowChatTips;
      if (this.isShowChatTips) {
        this.fetchChatTipsData();
      }
    },
    getImageUrl,
    handleTipsClick(item) {
      if (item.loading) return;
      this.newMessage = item;
      this.isShowChatTips = false;
      this.sendMessage();
    }
  },
  
  async created() {    
    if (this.$route.params.index) {
      this.selectedIndex = parseInt(this.$route.params.index);
    }
    await this.loadAllData();
  },
  mounted() {
    onClickOutside(this.$refs.chatTips, (evt) => {
      const target = evt.target;
      if (target?.closest('.chat-input-icon')) return;
      this.isShowChatTips = false;
    });
  }
}
</script>
