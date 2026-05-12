interface MessageInputKeyEvent {
  key: string
  shiftKey: boolean
  nativeEvent?: {
    isComposing?: boolean
  }
  keyCode?: number
}

export function shouldSubmitMessage(event: MessageInputKeyEvent) {
  return (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !event.nativeEvent?.isComposing &&
    event.keyCode !== 229
  )
}
