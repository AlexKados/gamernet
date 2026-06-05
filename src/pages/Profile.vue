<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div v-if="profileStore.loading" class="text-white/60">Loading profile...</div>

    <div v-else-if="!auth.isLoggedIn" class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-white/70">You need to be logged in to view your profile.</p>
      <RouterLink
        to="/login"
        class="mt-3 inline-block rounded-lg bg-indigo-500/80 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Log in
      </RouterLink>
    </div>

    <template v-else>
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
    </template>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue"
import { RouterLink } from "vue-router"
import { useAuthStore } from "../stores/useAuthStore"
import { useProfileStore } from "../stores/useProfileStore"
import { useUiStore } from "../stores/useUiStore"
import SectionCard from "../components/profile/SectionCard.vue"
import ProfileHeader from "../components/profile/ProfileHeader.vue"
import ProfileStats from "../components/profile/ProfileStats.vue"
import ProfileBio from "../components/profile/ProfileBio.vue"
import GameTagList from "../components/profile/GameTagList.vue"
import EditProfileModal from "../components/profile/EditProfileModal.vue"

const auth = useAuthStore()
const profileStore = useProfileStore()
const ui = useUiStore()

const isEditing = ref(false)

// UI-facing user object. Mapped from the backend profile.
const user = reactive({
  name: "",
  handle: "",
  tagline: "",
  bio: "",
  location: "",
  games: [],
})

const stats = reactive({
  posts: 0,
  followers: 0,
  following: 0,
  likes: 0,
})

// Map backend profile -> the shape the components expect
function applyProfile(p) {
  if (!p) return
  user.name = p.displayName || p.User?.username || "Unknown"
  user.handle = p.User?.username || ""
  user.tagline = p.tagline || ""
  user.bio = p.bio || ""
  user.location = p.location || ""
  user.games = user.games.length ? user.games : ["Add your favorite games!"]
}

onMounted(async () => {
  if (auth.isLoggedIn) {
    await profileStore.fetchMyProfile()
    applyProfile(profileStore.profile)
  }
})

// Keep the UI in sync if the store profile changes
watch(
  () => profileStore.profile,
  (p) => applyProfile(p)
)

async function saveProfile(payload) {
  try {
    await profileStore.updateMyProfile({
      displayName: payload.name,
      tagline: payload.tagline,
      bio: payload.bio,
      location: payload.location,
    })
    applyProfile(profileStore.profile)
    isEditing.value = false
    ui.showToast("Profile updated!")
  } catch {
    ui.showToast("Failed to update profile")
  }
}
</script>