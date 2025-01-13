<template>
  <div class="loading">
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
  </div>
</template>

<script></script>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 3px;
}

.loading-bar {
  width: 3vw;
  height: 3vw;
  background-color: white;
  border-radius: 50%;
  animation: loading 1.5s ease-in-out infinite;
  transform-origin: center;
}

.loading-bar:nth-child(1) {
  opacity: 0.5;
}

.loading-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-bar:nth-child(3) {
  opacity: 0.5;
  animation-delay: 0.3s;
}

@keyframes loading {
  0% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.3);
  }
  
}
</style>