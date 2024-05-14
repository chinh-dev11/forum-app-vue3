import { reactive } from 'vue'

// any component that uses the composable will always refer to this exact array. This makes the composable acts as a global store like Vuex.
const notifications = reactive([])

const removeNotification = (id) => {
  const index = notifications.findIndex(item => item.id === id)
  notifications.splice(index, 1)
}

const addNotification = ({ message, timeout }) => {
  const id = Math.random() + Date.now()

  notifications.push({
    id,
    message
  })

  if (timeout) {
    setTimeout(() => {
      removeNotification(id)
    }, timeout)
  }
}

export default function useNotifications () {
  return {
    notifications,
    addNotification,
    removeNotification
  }
}
