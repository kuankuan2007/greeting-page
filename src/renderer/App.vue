<template>
  <div class="app-root">
    <div class="text-list" ref="text-list">
      <div class="text-list-inner">
        <TextValue v-for="item in values" :key="item.id" :box="item" :windowSize="size"
          @finished="() => values.splice(values.indexOf(item), 1)" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computedSizeRef } from './scripts/sizeRef';
import storageRef from './scripts/storageRef';
import { computedTextContent } from './scripts/textContent';
import TextValue from './components/TextValue.vue';
import type { TextBox } from './types/texts';

const textList = useTemplateRef('text-list')
const size = computedSizeRef(textList);
const enabledContentGroup = storageRef('winter,general,health', 'enabledContentGroup');
const enabledContent = computedTextContent(computed(() => enabledContentGroup.value.split(',')));
let nowID = 0;

const values = shallowReactive<TextBox[]>([]);
const MAX_TEXT_NUM = 40;
const MAX_GEN_SPEED = 10;

const genHistory: { time: number, num: number }[] = []

function randomChoice<T>(arr: T[], defaultValue: T): T {
  return arr[Math.floor(Math.random() * arr.length)] || defaultValue;
}
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
function genText(data: {
  text: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  delay: number;
}) {
  const d = {
    id: nowID++,
    ...data
  }
  values.push(d);
}

function genTextControl() {
  while (genHistory.length > 0 && Date.now() - genHistory[0]!.time > 1000) {
    genHistory.shift();
  }
  const speedLimitRest = Math.max(0, MAX_GEN_SPEED - genHistory.reduce((acc, cur) => acc + cur.num, 0));
  const currentNum = Math.min(speedLimitRest, MAX_TEXT_NUM - values.length);
  genHistory.push({ time: Date.now(), num: currentNum });
  for (let i = 0; i < currentNum; i++) {
    genText({
      text: randomChoice(enabledContent.value, ''),
      x: randomRange(0, size.value.width),
      y: randomRange(0.3 * size.value.height, size.value.height * 1.3),
      z: randomRange(0, 30),
      speed: randomRange(size.value.height / 15, size.value.height / 6),
      delay: randomRange(0, 500),
    });
  }
}
function updateContent() {
  requestIdleCallback(updateContent, { timeout: 100 });
  genTextControl();
}
onMounted(() => {
  setTimeout(() => {
    updateContent();
  }, 100);
});

</script>
<style scoped lang="scss">
.text-list {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .text-list-inner {
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 100px;
  }
}
</style>