import { reactive } from 'vue'

// any component that uses the composable will always refer to this exact array. This makes the composable acts as a global store like Vuex.
const notifications = reactive([])

const addNotification = (notification) => {
  notifications.push({
    id: Math.random() + Date.now(),
    ...notification
  })
}

const removeNotification = (id) => {
  const index = notifications.findIndex(item => item.id === id)
  notifications.splice(index, 1)
}

export default function useNotifications () {
  return {
    notifications,
    addNotification,
    removeNotification
  }
}
