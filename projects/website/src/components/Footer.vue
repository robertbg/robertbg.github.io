<template>
  <footer :class="$style.footer">&copy; {{ year }} Rob Byrne-Graham.</footer>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
    }
  },
}
</script>

<style module>
.footer {
  position: fixed;
  bottom: var(--border-width);
  left: 0;
  font-size: 0.7rem;
  padding: 20px;
  width: 100%;
  text-align: center;
}
</style>
