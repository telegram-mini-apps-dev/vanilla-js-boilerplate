<template>
  <canvas ref="canvasRef" class="app-svga" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    }
  },
  async mounted() {
    await this.initSvga();
  },
  methods: {
    async initSvga() {
      const { Downloader, Parser, Player } = await import('svga.lite');
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player(this.$refs.canvasRef);

      const res = await downloader.get(this.src);
      const svga = await parser.do(res);

      player.set({
        loop: 0,
        fillMode: 'forwards',
        playMode: 'forwards',
        startFrame: 0,
        endFrame: 0,
        cacheFrames: true,
        intersectionObserverRender: true
      });
      await player.mount(svga);
      player.start();
    }
  }
}
</script>

<style>
.app-svga {
  width: 100%;
  height: 100%;
}
</style>