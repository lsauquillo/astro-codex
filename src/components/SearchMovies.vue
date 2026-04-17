<template>
  <div class="mb-8">
    <form @submit.prevent="searchMovies" class="flex gap-4">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar película por título..."
        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
      >
        Buscar
      </button>
    </form>

    <div v-if="loading" class="mt-4 text-center text-gray-500">
      Cargando películas...
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div v-if="results.length > 0" class="mt-6">
      <p class="text-sm text-gray-600 mb-4">
        Se encontraron {{ results.length }} película(s)
      </p>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="movie in results" :key="movie.id">
          <a
            :href="`/peliculas/${movie.id}`"
            class="block overflow-hidden rounded-xl shadow-lg hover:opacity-90 transition-opacity duration-200"
          >
            <img
              height="200"
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="`Cartel de ${movie.title}`"
            />
          </a>

          <div class="p-4">
            <h2 class="text-sm font-semibold">{{ movie.title }}</h2>
            <p class="text-yellow-400 mt-2 text-sm">
              ⭐ {{ movie.vote_average }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="searched && results.length === 0 && !error" class="mt-4 text-center text-gray-500">
      No se encontraron películas con ese título.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const results = ref([]);
const loading = ref(false);
const error = ref("");
const searched = ref(false);

const API_KEY = import.meta.env.PUBLIC_TMDB_API_KEY;

const searchMovies = async () => {
  if (!searchQuery.value.trim()) {
    results.value = [];
    searched.value = false;
    error.value = "";
    return;
  }

  loading.value = true;
  error.value = "";
  searched.value = true;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        searchQuery.value
      )}&language=es-ES`
    );

    const data = await response.json();

    if (!response.ok) {
      error.value = data.status_message || "Error al consultar la API";
    } else {
      results.value = data.results.slice(0, 20) ?? [];
    }
  } catch (err) {
    error.value = "No se pudieron cargar las películas";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>