<template>
  <div class="loading-page">
    <div class="loading-animation">
      <img src="../../public/9.png" alt="" /><br>
      <!-- <div class="spinner"></div> -->
      <div class="text">Loading...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-page {
  display: flex;
  z-index: 12;
  background-color: var(--backgroundLoading);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  border: 0.5rem solid #d9d9d9;
  border-top-color: #737373;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

.text {
  font-size: 1.5rem;
  color: #737373;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
