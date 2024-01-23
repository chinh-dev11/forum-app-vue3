<script setup>
import CategoryList from '@/components/CategoryList.vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { storeToRefs } from 'pinia'

// destructuring looses the store's reactivity.
const { categories } = storeToRefs(useCategoriesStore()) // storeToRefs maintains the store's reactivity.
</script>

<template>
  <h1>Welcome to the Forum</h1>
  <!--
     category > forums
        forum > threads
            thread > posts
   -->
    <CategoryList :categories="categories" />
</template>

<style scoped></style>
