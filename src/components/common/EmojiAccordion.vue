<template>
  <div class="emoji-accordion">
    <q-btn @click.stop="toggleAccordion" flat round size="md" no-caps>
      <font-awesome-icon icon="fa-regular fa-face-smile"/>
      <transition name="fade">
        <div v-if="isAccordionOpen" class="emoji-container">
          <q-list class="row items-center no-wrap" dense>
            <q-item v-for="emoji in emojis" :key="emoji" clickable @click.stop="selectEmoji(emoji)" dense>
              <q-item-section>{{ emoji }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </transition>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'EmojiAccordion',
  data() {
    return {
      isAccordionOpen: false,
      emojis: ['😀', '😂', '😍', '😎', '🤔', '😭', '😡', '🥳']
    };
  },
  methods: {
    toggleAccordion() {
      this.isAccordionOpen = !this.isAccordionOpen;
    },
    selectEmoji(emoji) {
      this.$emit('emoji-selected', emoji);
      this.isAccordionOpen = false; // 선택 후 아코디언 닫기
    }
  }
}
</script>

<style scoped>
.emoji-accordion {
  position: relative;
  display: inline-block;
}

.emoji-container {
  position: absolute;
  bottom: 100%; /* 버튼 위로 올라오도록 설정 */
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  z-index: 10;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
