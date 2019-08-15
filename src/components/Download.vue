<template>
  <a href="/RobBGCV.pdf" target="_blank" :class="$style.button">
    Download CV
    <div :class="$style.icon" v-html="require('!html-loader!./../assets/download.svg')" />
  </a>
</template>

<style module>
.button {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  border: 1px solid var(--light);
  border-radius: 3px;
  overflow: hidden;
  padding: 12px 30px;
  margin-bottom: 60px;
}

.icon {
  margin-top: 1px;
  margin-left: 20px;
}

.icon svg {
  color: inherit;
  fill: currentColor;
}

.button:hover {
  background: linear-gradient(-324deg, #8c159f, #af0093, #cb0084);
  color: var(--background-color);
}

.button:active .icon {
  transform: translateY(1px);
}
</style>
