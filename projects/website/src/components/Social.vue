<template>
  <ul :class="$style.social">
    <li>
      <a href="mailto:rob@rbg.dev" target="_blank">
        <div :class="$style.icon" v-html="require('!html-loader!./../assets/email.svg')" />
      </a>
    </li>
    <li>
      <a href="https://www.linkedin.com/in/robbarnsgraham/" target="_blank">
        <div :class="$style.icon" v-html="require('!html-loader!./../assets/linkedin.svg')" />
      </a>
    </li>
    <li>
      <a href="https://www.github.com/robertbg" target="_blank">
        <div :class="$style.icon" v-html="require('!html-loader!./../assets/github.svg')" />
      </a>
    </li>
  </ul>
</template>

<style module>
.social {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.social li {
  margin: 0 10px;
}

.icon svg {
  transition: fill 0.3s;
}

.icon:hover svg {
  fill: var(--primary);
}

.social a:active .icon {
  transform: translateY(1px);
}
</style>
