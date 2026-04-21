<template>
  <div>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center" role="search">
      <label class="label">
        <span class="label-text">Buscar película:</span>
      </label>
      <input
        v-model="query"
        type="search"
        placeholder="Buscar película"
        class="input input-bordered w-full max-w-xs"
        name="query"
      />
    </form>

    <div v-if="isLoading" class="text-center text-sm text-gray-500">Buscando películas...</div>
    <div v-else-if="error" class="text-center text-sm text-red-500">{{ error }}</div>
    <div v-else-if="displayedMovies.length === 0" class="text-center text-sm text-gray-500">
      No se encontraron películas.
    </div>

    <div class="grid grid-cols-1 gap-6 m-6 sm:grid-cols-2 lg:grid-cols-4" v-else>
      <div v-for="movie in displayedMovies" :key="movie.id" class="rounded-xl bg-white shadow-lg overflow-hidden">
        <a
          :href="`/detalles/${movie.id}`"
          class="block overflow-hidden hover:opacity-90 transition-opacity duration-200"
        >
          <img
            height="200"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="`Cartel de ${movie.title}`"
            class="w-full object-cover"
          />
        </a>

        <div class="p-4">
          <h2 class="text-sm font-semibold">{{ movie.title }}</h2>
          <p class="text-yellow-400 mt-2 text-sm">⭐ {{ movie.vote_average }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    movies: {
      type: Array,
      default: () => []
    },
    apiKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      query: '',
      displayedMovies: this.movies,
      isLoading: false,
      error: ''
    };
  },
  watch: {
    movies(newMovies) {
      if (!this.query.trim()) {
        this.displayedMovies = newMovies;
      }
    }
  },
  methods: {
    async onSubmit() {
      const searchTerm = this.query.trim();
      if (!searchTerm) {
        this.displayedMovies = this.movies;
        this.error = '';
        return;
      }

      this.isLoading = true;
      this.error = '';

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=es-ES&query=${encodeURIComponent(searchTerm)}&page=1`
        );

        if (!response.ok) {
          throw new Error('Error al buscar películas');
        }

        const data = await response.json();
        this.displayedMovies = data.results ?? [];
      } catch (err) {
        console.error(err);
        this.displayedMovies = [];
        this.error = 'No se pudo buscar en TMDB. Intenta de nuevo.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
