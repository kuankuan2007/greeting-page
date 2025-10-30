<template>
    <div class="text-value" ref="text-value">{{ box.text }}</div>
</template>
<script setup lang="ts">
import { computedSizeRef } from '@/scripts/sizeRef';
import type { TextBox } from '../types/texts';
const textValue = useTemplateRef('text-value');
const props = defineProps<{ box: TextBox, windowSize: { width: number, height: number } }>()
const size = computedSizeRef(textValue)

const emit = defineEmits(['finished']);

onMounted(() => {
    const duration = props.box.y / props.box.speed * 1000;
    textValue.value && (textValue.value.style.opacity = '0');
    textValue.value && (textValue.value.style.zIndex = props.box.z.toString());
    const timeout = setTimeout(() => {
        emit('finished', props.box.id);
    }, duration + 1000);
    setTimeout(() => {
        if (!textValue.value) return;

        textValue.value.animate([
            { transform: `translate3d(${props.box.x - size.value.width * 0.5}px,${props.box.y}px,${props.box.z}px)` },
            { transform: `translate3d(${props.box.x - size.value.width * 0.5}px,${-1 * size.value.height - props.windowSize.height * 0.2}px,${props.box.z}px)` },
        ], {
            duration: duration,
            iterations: 1,
            easing: 'linear',
            delay: props.box.delay,
        }).finished.then(() => {
            clearTimeout(timeout);
            emit('finished', props.box.id);
        });
        textValue.value.animate([
            { opacity: '0' },
            { opacity: '1' },
        ], {
            duration: 300,
            iterations: 1,
            easing: 'linear',
            fill: 'forwards',
            delay: props.box.delay
        })
    }, 0);
})
</script>
<style scoped lang="scss">
.text-value {
    padding: 0.5em 1em;
    border: 1px solid rgb(0, 0, 121);
    border-radius: 0.65em;
    position: absolute;

    white-space: nowrap;
    text-wrap: nowrap;
    background: rgba(0, 0, 90, 0.5);
    backdrop-filter: blur(0.5em);
    filter: drop-shadow(0 0 1em rgba(98, 0, 255, 0.705));
}
</style>