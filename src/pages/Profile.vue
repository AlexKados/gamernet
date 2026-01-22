<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <SectionCard title="Profile">
      <ProfileHeader :user="user" @edit="isEditing = true" />
    </SectionCard>

    <SectionCard title="Stats">
      <ProfileStats :stats="stats" />
    </SectionCard>

    <SectionCard title="About">
      <ProfileBio :bio="user.bio" :location="user.location" />
      <div class="mt-4">
        <div class="mb-2 text-sm text-white/70">Favorite games</div>
        <GameTagList :games="user.games" />
      </div>
    </SectionCard>

    <EditProfileModal
      v-if="isEditing"
      :initial="user"
      @close="isEditing = false"
      @save="saveProfile"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import SectionCard from "../components/profile/SectionCard.vue"
import ProfileHeader from "../components/profile/ProfileHeader.vue"
import ProfileStats from "../components/profile/ProfileStats.vue"
import ProfileBio from "../components/profile/ProfileBio.vue"
import GameTagList from "../components/profile/GameTagList.vue"
import EditProfileModal from "../components/profile/EditProfileModal.vue"

const isEditing = ref(false)

const user = reactive({
  name: "Joshua",
  handle: "josh",
  tagline: "CRPG enjoyer. Build breaker. Loot enjoyer.",
  bio: "I min-max my characters, then roleplay like chaotically. If your build is broken, I want the recipe.",
  location: "New York, US",
  games: ["Baldur’s Gate 3", "Pathfinder: WotR", "Fallout", "Valorant"],
})

const stats = reactive({
  posts: 12,
  followers: 184,
  following: 73,
  likes: 421,
})

function saveProfile(payload) {
  user.name = payload.name
  user.handle = payload.handle
  user.tagline = payload.tagline
  user.bio = payload.bio
  user.location = payload.location
  user.games = payload.games

  isEditing.value = false
}
</script>
