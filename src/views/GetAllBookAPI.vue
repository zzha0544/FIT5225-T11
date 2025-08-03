<template>
    <div v-if="bookBasedResponse" class="api-response">
        <pre>{{ JSON.stringify(bookBasedResponse, null, 2) }}</pre>
    </div>

    <div v-else-if="loading">Loading books...</div>
    <div v-else-if="error">{{ error }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const books = ref([])
const loading = ref(false)
const error = ref(null)
const bookBasedResponse = ref(null)

const getApiData = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await fetch('src/assets/json/authors.json')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        books.value = data

        const booksAsKey = []

        data.forEach(author => {
            author.famousWorks.forEach(work => {
                booksAsKey.push({
                    title: work.title,
                    year: work.year,
                    author: {
                        id: author.id,
                        name: author.name,
                        birthYear: author.birthYear,
                        genres: author.genres
                    }
                })
            })
        })

        bookBasedResponse.value = {
            success: true,
            data: booksAsKey,
            timestamp: new Date().toISOString()
        }

    } catch (err) {
        error.value = `Error loading book data: ${err.message}`
        console.error('Error loading book data:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getApiData()
})

defineExpose({
    getApiData
})
</script>

<style scoped>
.api-response {
    background-color: #f4f4f4;
    padding: 1rem;
    border-radius: 5px;
    font-family: monospace;
    white-space: pre-wrap;
}
</style>
