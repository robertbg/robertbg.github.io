<template>
  <section :class="$style.section">
    <h1 :class="$style.lead">Rob BG</h1>
    <ul :class="$style.typewriter">
      <li
        v-for="(text, index) in textOptions"
        :key="index"
        :class="{ [$style.text]: true, [$style.inView]: activeIndex === index }"
      >
        {{ text }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      textOptions: [
        'Committed Technical Leader',
        'Full-Stack Javascript Developer',
        'Web Performance Consultant',
        'Experienced Software Architect',
      ],
    }
  },
  mounted() {
    setInterval(() => {
      this.activeIndex = this.getRandomIndex()
    }, 4000)
  },
  methods: {
    getRandomIndex() {
      const newIndex = Math.floor(Math.random() * this.textOptions.length)
      if (newIndex === this.activeIndex) {
        return this.getRandomIndex()
      } else {
        return newIndex
      }
    },
  },
}
</script>

<style module>
.lead {
  background: var(--gradient);
  background-size: 1400% 1400%;
  animation: AnimateGradient 10s ease infinite;
  background-clip: text;
  font-family: 'Alfa Slab One', sans-serif;
  font-size: 3rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
  color: transparent;
}

.descriptors {
  list-style: none;
  margin: 0;
  padding: 0;
}

.typewriter {
  display: inline-block;
  padding: 0;
  margin-bottom: 40px;
}

.text {
  display: none;
  overflow: hidden;
  letter-spacing: 2px;
  white-space: nowrap;
  font-weight: 500;
  border-right: 4px solid var(--primary);
  box-sizing: border-box;
  animation: typing 3s steps(30, end), blink 0.75s step-end infinite;
}

.inView {
  display: inline-block;
}

@media only screen and (min-width: 420px) {
  .lead {
    font-size: 8rem;
  }
}

@keyframes typing {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: var(--primary);
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
