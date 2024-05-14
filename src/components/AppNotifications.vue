<script>
import useNotifications from '@/composables/useNotifications'

export default {
  setup () {
    const { notifications, removeNotification } = useNotifications()

    return { notifications, removeNotification }
  }
}
</script>

<template>
  <div class="notifications">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
    >
      <span>{{ notification.message }}</span>
      <button @click="removeNotification(notification.id)">x</button>
    </div>
  </div>
</template>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}
.notification {
  background-color: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
  padding: 10px 20px;
  border-left: 5px solid #263959;
}
</style>
