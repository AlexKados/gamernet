<template>
  <article
    class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
  >
    <header class="flex items-start justify-between gap-4">
      <div class="cursor-pointer" @click="openPost">
        <p class="font-semibold">
          {{ post.author }}
          <span class="text-white/50 font-normal">· {{ post.createdAt }}</span>
        </p>
        <p class="text-sm text-white/70">
          Playing: <span class="text-white">{{ post.game }}</span>
        </p>
      </div>

      <BaseButton
        @click="$emit('delete')"
        class="!px-2 !py-1 text-white/70 hover:text-white"
      >
        ✖
      </BaseButton>
    </header>

    <p class="text-white/90 cursor-pointer" @click="openPost">{{ post.content }}</p>

    <footer class="flex items-center justify-between">
      <LikeButton
        :liked="post.liked"
        :likes="post.likes"
        @toggle="$emit('like')"
      />

      <button
        class="text-xs text-white/60 hover:text-white"
        type="button"
        @click="openPost"
      >
        View details · id: {{ post.id }}
      </button>
    </footer>
  </article>
</template>

<script setup>
import { useRouter } from "vue-router"
import BaseButton from "../ui/BaseButton.vue"
import LikeButton from "./LikeButton.vue"

const props = defineProps({
  post: { type: Object, required: true },
})

defineEmits(["like", "delete"])

const router = useRouter()

function openPost() {
  router.push({ name: "PostDetails", params: { id: String(props.post.id) } })
}
</script>
