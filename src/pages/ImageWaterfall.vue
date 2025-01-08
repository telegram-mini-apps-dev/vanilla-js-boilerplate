<template>
  <div class="waterfall-wrapper">
    <div class="top-tags-wrapper">
      <div class="top-tags">
        <div class="tag" :class="{ active: activeTopTag === 'recommended' }" @click="setActiveTopTag('recommended')">推荐</div>
        <div class="tag" :class="{ active: activeTopTag === 'latest' }" @click="setActiveTopTag('latest')">最新</div>
        <div class="tag" :class="{ active: activeTopTag === 'hot' }" @click="setActiveTopTag('hot')">热门</div>
      </div>
      <div class="search-wrapper">
        <input 
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="搜索图片..."
          class="search-input"
        >
        <div class="search-icon">
          <svg t="1735558115171" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2368" width="16" height="16">
            <path d="M949.3504 794.0096l-227.328-227.371886a356.176457 356.176457 0 0 0 37.668571-159.700114c0-197.617371-160.768-358.4-358.4-358.4s-358.4 160.782629-358.4 358.4 160.768 358.4 358.4 358.4c60.854857 0 118.184229-15.286857 168.433372-42.144914l224.548571 222.500571c20.465371 20.48 47.733029 28.335543 76.770743 28.335543h0.555886c29.125486 0 56.554057-8.192 77.2096-28.8768 20.670171-20.655543 32.138971-45.041371 32.285257-74.181486a106.920229 106.920229 0 0 0-31.744-76.960914z m-248.4224-22.367086l71.8848-71.8848 23.215543 23.200915-71.767772 71.767771-23.332571-23.083886zM101.419886 406.9376c0-165.639314 134.261029-299.885714 299.885714-299.885714s299.885714 134.2464 299.885714 299.885714c0 165.653943-134.261029 299.885714-299.885714 299.885714s-299.885714-134.231771-299.885714-299.885714z m589.385143 210.929371l61.308342 61.2352-71.9872 71.972572-60.693942-60.035657a361.515886 361.515886 0 0 0 71.3728-73.172115z m216.634514 285.930058c-9.698743 9.684114-22.528 11.702857-36.1472 11.702857h-0.263314c-13.399771 0-25.965714-1.930971-35.401143-11.351772l-90.580115-89.219657 71.665372-71.504457 91.253028 91.2384c9.479314 9.479314 14.672457 21.123657 14.599315 34.640457-0.043886 13.604571-5.4272 24.7808-15.125943 34.494172z" fill="#666666" p-id="2369"></path>
            <path d="M369.722514 171.329829c-5.705143 0-11.3664 0.234057-16.969143 0.687542a14.628571 14.628571 0 1 0 2.399086 29.169372c4.798171-0.394971 9.669486-0.599771 14.570057-0.599772a14.628571 14.628571 0 1 0 0-29.257142zM284.715886 189.8496a204.726857 204.726857 0 0 0-119.018057 185.534171 14.628571 14.628571 0 1 0 29.257142 0 175.396571 175.396571 0 0 1 101.961143-158.954057 14.628571 14.628571 0 1 0-12.200228-26.580114z" fill="#666666" p-id="2370"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="side-tags">
        <div class="tag" :class="{ active: activeSideTag === 'all' }" @click="setActiveSideTag('all')">全部</div>
        <div class="tag" :class="{ active: activeSideTag === 'nature' }" @click="setActiveSideTag('nature')">自然</div>
        <div class="tag" :class="{ active: activeSideTag === 'city' }" @click="setActiveSideTag('city')">城市</div>
        <div class="tag" :class="{ active: activeSideTag === 'people' }" @click="setActiveSideTag('people')">人物</div>
        <div class="tag" :class="{ active: activeSideTag === 'animals' }" @click="setActiveSideTag('animals')">动物</div>
      </div>
      <div class="waterfall-container">
        <div v-if="isTagLoading" class="tag-loading-overlay">
          <div class="tag-loading-spinner"></div>
        </div>
        <div class="waterfall-column" v-for="(column, columnIndex) in columns" :key="columnIndex">
          <div 
            class="waterfall-item" 
            v-for="item in column" 
            :key="item.image_url"
            @click="openImageDetail(item)"
          >
            <div class="image-placeholder" :style="{ paddingBottom: getAspectRatio(item) + '%' }">
              <img 
                :src="item.image_url" 
                :alt="item.description.join(', ')"
                @load="onImageLoad"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="load-more" ref="loadMoreTrigger" v-if="hasMoreItems">
      <div class="loading-spinner">加载中...</div>
    </div>
    
    <ImageDetail 
      v-if="selectedImage"
      :image="selectedImage"
      @close="selectedImage = null"
    />
  </div>
</template>

<script>
import { indexData } from '../data/landscape.js'
import { oceanData } from '../data/ocean.js'
import { recommendData } from '../data/recommend.js'
import ImageDetail from '../components/ImageDetail.vue'
import '../styles/ImageWaterfall.css'

export default {
  name: 'ImageWaterfall',
  components: {
    ImageDetail
  },
  data() {
    return {
      columns: [], // Will be initialized dynamically
      columnCount: 3, // Default column count
      items: [],
      loadedImages: 0,
      currentPage: 1,
      itemsPerPage: 20,
      allItems: {}, // 修改为对象，用于存储不同标签的数据
      hasMoreItems: true,
      isLoading: false,
      observer: null,
      activeTag: 'recommended',
      selectedImage: null,
      imageAspectRatios: new Map(), // 存储图片实际宽高比
      isTagLoading: false,
      activeTopTag: 'recommended',
      activeSideTag: 'all',
      searchQuery: '',
      searchTimeout: null,
    }
  },
  methods: {
    getAspectRatio(item) {
      // 如果已经计算过这张图片的宽高比，直接返回
      if (this.imageAspectRatios.has(item.image_url)) {
        return this.imageAspectRatios.get(item.image_url);
      }
      // 默认返回一个临时比例，等图片加载完后会更新
      return 66.67; // 临时 2:3 比例
    },
    
    distributeItems() {
      const columnHeights = this.columns.map(() => 0);
      this.columns = this.columns.map(() => []);
      
      this.items.forEach(item => {
        // 找出高度最小的列
        const minHeight = Math.min(...columnHeights);
        const columnIndex = columnHeights.indexOf(minHeight);
        
        // 将项目添加到最短的列中
        this.columns[columnIndex].push(item);
        
        // 使用实际图片比例计算高度
        const aspectRatio = this.imageAspectRatios.get(item.image_url) || 66.67;
        const itemHeight = (aspectRatio / 100) * this.getColumnWidth();
        columnHeights[columnIndex] += itemHeight + 3; // 3px 为间距
      });
    },
    
    getColumnWidth() {
      const containerWidth = document.querySelector('.waterfall-container')?.offsetWidth || window.innerWidth;
      const gap = 3; // gap between columns
      return (containerWidth - (gap * (this.columnCount - 1))) / this.columnCount;
    },
    
    onImageLoad(event) {
      const img = event.target;
      const url = img.src;
      const aspectRatio = (img.height / img.width) * 100;
      
      // 存储实际宽高比
      this.imageAspectRatios.set(url, aspectRatio);
      this.loadedImages++;
      
      if (this.loadedImages === this.items.length) {
        this.distributeItems();
      }
    },
    loadAllData() {
      // Cache filtered data for better performance
      const processData = (data, tag) => {
        return data.map(item => ({
          ...item,
          activeTopTag: tag
        }));
      };

      this.allItems = {
        recommended: processData(recommendData, 'recommended'),
        latest: processData(indexData, 'latest'),
        hot: processData(oceanData, 'hot')
      };
      
      // Pre-filter data based on current tags
      this.loadMoreItems();
    },
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target.isIntersecting && !this.isLoading && this.hasMoreItems) {
            this.loadMoreItems()
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      )

      if (this.$refs.loadMoreTrigger) {
        this.observer.observe(this.$refs.loadMoreTrigger)
      }
    },
    async loadMoreItems() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      
      // Filter data based on both top and side tags
      let currentData = this.allItems[this.activeTopTag] || [];
      if (this.activeSideTag !== 'all') {
        currentData = currentData.filter(item => item.category === this.activeSideTag);
      }
      
      const newItems = currentData.slice(start, end);
      
      if (newItems.length > 0) {
        // Load images in smaller batches
        const batchSize = 5;
        for (let i = 0; i < newItems.length; i += batchSize) {
          const batch = newItems.slice(i, i + batchSize);
          await Promise.all(
            batch.map(item => 
              new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                  const aspectRatio = (img.height / img.width) * 100;
                  this.imageAspectRatios.set(item.image_url, aspectRatio);
                  resolve();
                };
                img.onerror = () => {
                  // Handle failed image loads
                  this.imageAspectRatios.set(item.image_url, 66.67);
                  resolve();
                };
                img.src = item.image_url;
              })
            )
          );
          
          // Add batch to items and update display
          this.items = [...this.items, ...batch];
          this.distributeItems();
        }
        
        this.currentPage++;
      }
      
      this.hasMoreItems = end < currentData.length;
      this.isLoading = false;
    },
    async setActiveTag(tag) {
      this.isTagLoading = true;
      this.activeTag = tag;
      this.currentPage = 1;
      this.items = [];
      this.loadedImages = 0;
      this.imageAspectRatios.clear();
      await this.loadMoreItems();
      this.isTagLoading = false;
    },
    openImageDetail(item) {
      this.selectedImage = item      
      
    },
    updateColumnCount() {
      const width = window.innerWidth;
      // Responsive column count based on screen width
      if (width <= 480) {
        this.columnCount = 1; // Single column for small phones
      } else if (width <= 768) {
        this.columnCount = 2; // 2 columns for tablets/large phones
      } else if (width <= 1024) {
        this.columnCount = 3; // 3 columns for small desktops
      } else if (width <= 1440) {
        this.columnCount = 4; // 4 columns for medium desktops
      } else {
        this.columnCount = 5; // 5 columns for large desktops
      }
      
      this.columns = Array(this.columnCount).fill().map(() => []);
      this.distributeItems();
    },
    setActiveTopTag(tag) {
      this.isTagLoading = true;
      this.activeTopTag = tag;
      this.resetAndLoadItems();
    },
    
    setActiveSideTag(tag) {
      this.isTagLoading = true;
      this.activeSideTag = tag;
      this.resetAndLoadItems();
    },
    
    resetAndLoadItems() {
      this.currentPage = 1;
      this.items = [];
      this.loadedImages = 0;
      this.imageAspectRatios.clear();
      this.loadMoreItems().then(() => {
        this.isTagLoading = false;
      });
    },
    handleSearch() {
      // Debounce search to avoid too many requests
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.resetAndLoadItems();
        return;
      }

      this.isTagLoading = true;
      // Filter items based on search query
      const query = this.searchQuery.toLowerCase();
      let currentData = this.allItems[this.activeTopTag] || [];
      
      // Filter by both category and search query
      if (this.activeSideTag !== 'all') {
        currentData = currentData.filter(item => item.category === this.activeSideTag);
      }
      
      // Search in description and any other relevant fields
      currentData = currentData.filter(item => 
        item.description.some(desc => desc.toLowerCase().includes(query))
      );

      this.items = currentData;
      this.distributeItems();
      this.isTagLoading = false;
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  },
  mounted() {
    this.updateColumnCount();
    this.loadAllData();
    this.setupIntersectionObserver();
    
    // Debounced resize handler
    const debouncedResize = this.debounce(this.updateColumnCount, 250);
    window.addEventListener('resize', debouncedResize);
    this._cleanupResize = () => window.removeEventListener('resize', debouncedResize);
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this._cleanupResize) {
      this._cleanupResize();
    }
  }
}
</script>
