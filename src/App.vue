<template>
  <div :class="$style.container">
    <div :class="$style.section">
      <Hero />
      <Download />
      <Social />
    </div>
    <Footer />
  </div>
</template>

<script>
import Social from '@/components/Social.vue'
import Download from '@/components/Download.vue'
import Hero from '@/components/Hero.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Social,
    Download,
    Hero,
    Footer,
  },
}
</script>

<style src="@/assets/global.css"></style>
<style module>
.container {
  position: fixed;
  text-align: center;
  background: var(--gradient);
  background-size: 1400% 1400%;
  width: 100vw;
  height: 100vh;
  animation: AnimateGradient 10s ease infinite;
  font-family: Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  background: var(--background-color);
  margin: calc(var(--border-width) / 2);
  width: calc(100vw - var(--border-width));
  height: calc(100vh - var(--border-width));
}

@media only screen and (min-width: 420px) {
  .section {
    margin: var(--border-width);
    width: calc(100vw - (var(--border-width) * 2));
    height: calc(100vh - (var(--border-width) * 2));
  }
}

@keyframes AnimateGradient {
  0% {
    background-position: 0% 24%;
  }
  50% {
    background-position: 100% 77%;
  }
  100% {
    background-position: 0% 24%;
  }
}
</style>
