<template>
  <Frame/>
</template>

<script setup>
import Frame from "./components/common/ProjectStructure.vue";
</script>

<style>
#q-app {
  font-family: "Nanum Gothic", sans-serif;

}

.nanum-gothic-regular {
  font-family: "Nanum Gothic", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.nanum-gothic-bold {
  font-family: "Nanum Gothic", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.hugeLetter {
  font-size: 24px;
}

.bigLetter {
  font-size: 20px;
}

.smallLetter {
  font-size: 16px;
}

.tinyLetter {
  font-size: 12px;
}

li, a {
  text-decoration: none;
  color: white;
}

body{
  -ms-overflow-style: none;
}

::-webkit-scrollbar {
  display: none;
}

.q-pa-xxl {
  padding: 40px;
}

.q-px-xxl {
  padding-left: 40px;
  padding-right: 40px;
}

.q-px-xxxl {
  padding-left: 15%;
  padding-right: 15%;
}

.custom-rounded {
  border-radius: 16px !important;
}

.custom-rounded-sm {
  border-radius: 8px !important;
}
</style>