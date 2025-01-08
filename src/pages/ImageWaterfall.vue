<template>
  <div class="waterfall-wrapper">
    <div class="content-wrapper">
      <div class="waterfall-container">
        <div v-if="isTagLoading" class="tag-loading-overlay">
          <div class="tag-loading-spinner"></div>
        </div>
        <div class="waterfall-column" v-for="(column, columnIndex) in columns" :key="columnIndex">
          <div 
            class="waterfall-item" 
            v-for="(item, itemIndex) in column" 
            :key="item.image_url"
            @click="navigateToCharacter(itemIndex, columnIndex, itemIndex)"
          >
            <div class="image-placeholder">
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
  </div>
</template>

<script>
import { indexData } from '../data/landscape.js'
import { oceanData } from '../data/ocean.js'
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
      columnCount: 2, // Changed from 3 to 2
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
      recommendData: [], // Add this new property
    }
  },
  methods: {
    getAspectRatio(item) {
      // 如果已经计算过这张图片的宽高比，直接返回
      if (this.imageAspectRatios.has(item.image_url)) {
        return this.imageAspectRatios.get(item.image_url);
      }
      // 默认返回一个临时比例，等图片加载完后会更新
      return 56.25; // 临时 9:16 比例
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
        const aspectRatio = this.imageAspectRatios.get(item.image_url) || 56.25;
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
      await this.fetchRecommendData(); // Wait for data to be fetched
      
      const processData = (data, tag) => {
        return data.map(item => ({
          ...item,
          activeTopTag: tag
        }));
      };

      this.allItems = {
        recommended: processData(this.recommendData, 'recommended'),
      };
      
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
                  this.imageAspectRatios.set(item.image_url, 56.25);
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
    navigateToCharacter(item, columnIndex, itemIndex) {
      // Get the actual item from the column
      const selectedItem = this.columns[columnIndex][itemIndex];    
      // Find the index of this item in the original dataset
      const currentData = this.allItems[this.activeTopTag] || [];
      const datasetIndex = currentData.findIndex(dataItem => 
        dataItem.image_url === selectedItem.image_url
      );
      
      this.$router.push({
        name: 'Character',
        params: {
          id: 0,
          index: datasetIndex
        }
      });
    },
    updateColumnCount() {
      // Remove responsive logic and always use 2 columns
      this.columnCount = 2;
      
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
