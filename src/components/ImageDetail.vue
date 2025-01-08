<template>
  <div class="image-detail-overlay" @click.self="$emit('close')">
    <div class="image-detail-modal">
      <div class="modal-content">
        <div class="image-container">
          <img :src="displayAvatar.image_url" :alt="displayAvatar.description">
        </div>
        
        <div class="info-container">
          <div class="modal-header">
            <div class="user-info">
              <img 
                :src="displayAvatar.image_url" 
                :alt="displayAvatar.description"
                class="avatar"
              >
              <div class="username">{{ image.username }}</div>
            </div>
            <!-- <button class="close-button" @click="$emit('close')">&times;</button> -->
          </div>

          <div class="image-info-section">
            <div class="info-row">
              <span class="info-label">标签: {{image.description[0] || '暂无描述'}}</span>                
            </div>
            <div class="info-row" style="display:none">
              <span class="info-label">描述:</span>
              <p class="description">{{image.description[0] || '暂无描述'}}</p>
            </div>
            <div class="info-row">
              <span class="info-label">尺寸:</span>
              <span>{{actualWidth || image.width || 500}} x {{actualHeight || image.height || 500}}</span>
            </div>
          </div>

          <div class="social-share">            
            <div class="share-platforms">
              <button 
                v-for="(platform, key) in platforms" 
                :key="key"
                class="share-btn"
                :class="{ 
                  [key]: true,
                  'selected': selectedPlatforms.includes(key)
                }"
                @click="togglePlatform(key)"
              >
                <img :src="platform.icon" :alt="platform.name">                
              </button>
            </div>
            <button 
              class="download-btn" 
              :disabled="!selectedPlatforms.length"
              @click="downloadImages"
            >
              下载所选图片
            </button>
            <button 
              class="adjust-btn" 
              :disabled="!selectedPlatforms.length"
              @click="adjustSize"
            >
              调整尺寸
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import platformConfig from '../utils/third_platform.json'
import { avatarData } from '../data/avatar.js'
import '../styles/ImageDetail.css'

export default {
  name: 'ImageDetail',
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mockComments: [
        { id: 1, username: 'lucasfolster', text: '😍' },
        { id: 2, username: 'obrickhillfitness', text: '🔥🔥🔥🔥' },
        { id: 3, username: 'angelo8452', text: '👏👏👏' },
        { id: 4, username: 'm_r_k873', text: '🔥🔥💪💪' },
        { id: 5, username: 'gulzaar_ghaziabadi', text: '🔥' },
        { id: 6, username: 'zedrikallen', text: 'Do you have a Triceps & Chest version?' }
      ],
      platforms: platformConfig,
      selectedPlatforms: [],
      actualWidth: null,
      actualHeight: null,
      userAvatar: null,
    }
  },
  mounted() {    
    this.getImageDimensions(this.image.image_url)
    this.findMatchingAvatar()
  },
  methods: {
    adjustSize() {
      // this.$router.go('/image-adjust')
      this.$router.go({
        name: 'ImageAdjust',
        params: {
          imageUrl: this.image.image_url,
          description: this.image.description?.[0] || ''
        }
      })
    },
    findMatchingAvatar() {
      const matchedAvatar = avatarData.find(avatar => 
        avatar.image_url === this.image.image_url
      )
      if (matchedAvatar) {
        this.userAvatar = matchedAvatar
      }
    },
    togglePlatform(platformKey) {
      const index = this.selectedPlatforms.indexOf(platformKey)
      if (index === -1) {
        this.selectedPlatforms.push(platformKey)
      } else {
        this.selectedPlatforms.splice(index, 1)
      }
    },

    async resizeImage(imageUrl, width, height) {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "Anonymous"
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          // 计算裁剪参数以保持宽高比
          const scale = Math.max(width / img.width, height / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (width - scaledWidth) / 2
          const y = (height - scaledHeight) / 2
          
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        img.src = imageUrl
      })
    },

    async downloadImages() {
      for (const platform of this.selectedPlatforms) {
        const { width, height } = this.platforms[platform].imageSize
        const resizedImage = await this.resizeImage(this.image.image_url, width, height)
        
        // 创建下载链接
        const link = document.createElement('a')
        link.download = `image_${platform}.jpg`
        link.href = resizedImage
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    getImageDimensions(imageUrl) {
      const img = new Image()
      img.onload = () => {
        this.actualWidth = img.naturalWidth
        this.actualHeight = img.naturalHeight
      }
      img.src = imageUrl
    },

    adjustSize() {
      this.$router.push({
        name: 'ImageAdjust',
        params: {
          imageUrl: this.image.image_url,
          description: this.image.description?.[0] || ''
        }
      })
    }
  },
  computed: {
    displayAvatar() {
      return this.userAvatar || this.image
    }
  }
}
</script>