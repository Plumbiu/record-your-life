<script setup lang="ts">
import { onMounted } from 'vue'
import { Terminal } from 'xterm'
import { Logger } from '@record-your-life/shared'
import { FitAddon } from 'xterm-addon-fit'
import './term.css'
import { useAppStore } from '@/store'

const store = useAppStore()
const term = new Terminal({
  allowProposedApi: true,
  fontFamily: 'Courier New',
  fontSize: 14,
  cursorStyle: 'bar',
  cursorBlink: true,
  disableStdin: false,
  screenReaderMode: true,
  theme: {
    background: '#131313',
  },
})
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)
onMounted(() => {
  const logger = new Logger(store.usage, store.selectedDate)
  term.open(document.getElementById('terminal')!)
  term.loadAddon(fitAddon)
  fitAddon.fit()
  term.write(logger.board())
})
</script>

<template>
  <div id="terminal"></div>
</template>

<style scoped></style>
