<template>
  <div class="skip-navigation">
    <a href="#main-content" class="skip-link" @click="skipToMain">
      Skip to main content
    </a>
  </div>
</template>

<script setup lang="ts">
const skipToMain = (event: Event) => {
  event.preventDefault()
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.skip-navigation {
  position: relative;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0066CC;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 10000;
  font-weight: 600;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #FFD700;
  outline-offset: 2px;
}
</style>
