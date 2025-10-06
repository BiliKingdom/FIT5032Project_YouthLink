<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Resource Content -->
        <div v-if="resource" class="card shadow-sm border-0 mb-4">
          <div class="card-body p-5">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div>
                <span class="badge mb-2" :class="getCategoryBadgeClass(resource.category)">
                  {{ resource.category }}
                </span>
                <h1 class="display-6 fw-bold mb-3">{{ resource.title }}</h1>
                <p class="lead text-muted mb-3">{{ resource.description }}</p>
              </div>
              <div class="text-end">
                <div class="rating-summary">
                  <div class="d-flex align-items-center mb-2">
                    <div class="stars me-2">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :size="18"
                        :class="i <= Math.round(resource.overallRating) ? 'text-warning' : 'text-muted'"
                        :fill="i <= Math.round(resource.overallRating) ? 'currentColor' : 'none'"
                      />
                    </div>
                    <span class="fw-bold">{{ resource.overallRating.toFixed(1) }}/5</span>
                  </div>
                  <small class="text-muted">{{ resource.totalRatings }} ratings • {{ resource.commentCount }} comments</small>
                </div>
              </div>
            </div>

            <!-- Aspect Ratings Summary -->
            <div class="aspect-ratings-summary mb-4 p-3 bg-light rounded">
              <h6 class="mb-3">Rating Breakdown</h6>
              <div class="row g-3">
                <div class="col-md-3">
                  <div class="aspect-rating-item text-center">
                    <div class="aspect-icon mb-2">
                      <ThumbsUp class="text-success" :size="20" />
                    </div>
                    <div class="aspect-score fw-bold">{{ resource.aspectRatings.helpfulness.toFixed(1) }}</div>
                    <small class="text-muted">Helpfulness</small>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="aspect-rating-item text-center">
                    <div class="aspect-icon mb-2">
                      <Eye class="text-primary" :size="20" />
                    </div>
                    <div class="aspect-score fw-bold">{{ resource.aspectRatings.clarity.toFixed(1) }}</div>
                    <small class="text-muted">Clarity</small>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="aspect-rating-item text-center">
                    <div class="aspect-icon mb-2">
                      <Target class="text-info" :size="20" />
                    </div>
                    <div class="aspect-score fw-bold">{{ resource.aspectRatings.relevance.toFixed(1) }}</div>
                    <small class="text-muted">Relevance</small>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="aspect-rating-item text-center">
                    <div class="aspect-icon mb-2">
                      <CheckCircle class="text-warning" :size="20" />
                    </div>
                    <div class="aspect-score fw-bold">{{ resource.aspectRatings.accuracy.toFixed(1) }}</div>
                    <small class="text-muted">Accuracy</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="resource-meta mb-4">
              <div class="row text-muted small">
                <div class="col-md-6">
                  <User class="me-1" :size="14" />
                  By {{ resource.author }}
                </div>
                <div class="col-md-6">
                  <Calendar class="me-1" :size="14" />
                  {{ formatDate(resource.publishedDate) }}
                </div>
              </div>
            </div>

            <div class="resource-content">
              <div class="content-text" v-html="formatContent(resource.content)"></div>
            </div>

            <div class="resource-tags mt-4">
              <span v-for="tag in resource.tags" :key="tag" class="badge bg-light text-dark me-2">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="card shadow-sm border-0">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <MessageSquare class="me-2" :size="20" />
                Reviews & Ratings ({{ comments.length }})
              </h5>
              <button 
                v-if="authStore.isLoggedIn" 
                class="btn btn-primary btn-sm"
                @click="showCommentForm = !showCommentForm"
              >
                <Plus class="me-1" :size="16" />
                {{ userComment ? 'Edit My Review' : 'Add Review' }}
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Comment Form -->
            <div v-if="showCommentForm && authStore.isLoggedIn" class="comment-form mb-4 p-4 bg-light rounded">
              <h6 class="mb-4">{{ isEditingComment ? 'Edit your review' : 'Share your review' }}</h6>
              <form @submit.prevent="submitComment">
                <!-- Overall Rating -->
                <div class="mb-4">
                  <label class="form-label fw-medium">Overall Rating *</label>
                  <div class="rating-input mb-2">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :size="28"
                      :class="i <= newComment.overallRating ? 'text-warning' : 'text-muted'"
                      :fill="i <= newComment.overallRating ? 'currentColor' : 'none'"
                      class="rating-star me-1"
                      @click="newComment.overallRating = i"
                      style="cursor: pointer;"
                    />
                  </div>
                  <small class="text-muted">Click stars to rate overall quality</small>
                </div>

                <!-- Aspect Ratings -->
                <div class="mb-4">
                  <label class="form-label fw-medium">Detailed Ratings *</label>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="aspect-rating-input">
                        <div class="d-flex align-items-center mb-2">
                          <ThumbsUp class="text-success me-2" :size="16" />
                          <span class="small fw-medium">Helpfulness</span>
                        </div>
                        <div class="rating-stars">
                          <Star
                            v-for="i in 5"
                            :key="i"
                            :size="20"
                            :class="i <= newComment.aspectRatings.helpfulness ? 'text-warning' : 'text-muted'"
                            :fill="i <= newComment.aspectRatings.helpfulness ? 'currentColor' : 'none'"
                            class="rating-star"
                            @click="newComment.aspectRatings.helpfulness = i"
                            style="cursor: pointer;"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="aspect-rating-input">
                        <div class="d-flex align-items-center mb-2">
                          <Eye class="text-primary me-2" :size="16" />
                          <span class="small fw-medium">Clarity</span>
                        </div>
                        <div class="rating-stars">
                          <Star
                            v-for="i in 5"
                            :key="i"
                            :size="20"
                            :class="i <= newComment.aspectRatings.clarity ? 'text-warning' : 'text-muted'"
                            :fill="i <= newComment.aspectRatings.clarity ? 'currentColor' : 'none'"
                            class="rating-star"
                            @click="newComment.aspectRatings.clarity = i"
                            style="cursor: pointer;"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="aspect-rating-input">
                        <div class="d-flex align-items-center mb-2">
                          <Target class="text-info me-2" :size="16" />
                          <span class="small fw-medium">Relevance</span>
                        </div>
                        <div class="rating-stars">
                          <Star
                            v-for="i in 5"
                            :key="i"
                            :size="20"
                            :class="i <= newComment.aspectRatings.relevance ? 'text-warning' : 'text-muted'"
                            :fill="i <= newComment.aspectRatings.relevance ? 'currentColor' : 'none'"
                            class="rating-star"
                            @click="newComment.aspectRatings.relevance = i"
                            style="cursor: pointer;"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="aspect-rating-input">
                        <div class="d-flex align-items-center mb-2">
                          <CheckCircle class="text-warning me-2" :size="16" />
                          <span class="small fw-medium">Accuracy</span>
                        </div>
                        <div class="rating-stars">
                          <Star
                            v-for="i in 5"
                            :key="i"
                            :size="20"
                            :class="i <= newComment.aspectRatings.accuracy ? 'text-warning' : 'text-muted'"
                            :fill="i <= newComment.aspectRatings.accuracy ? 'currentColor' : 'none'"
                            class="rating-star"
                            @click="newComment.aspectRatings.accuracy = i"
                            style="cursor: pointer;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="comment" class="form-label fw-medium">Your Review *</label>
                  <textarea
                    v-model="newComment.comment"
                    id="comment"
                    class="form-control"
                    rows="4"
                    placeholder="Share your detailed thoughts about this resource..."
                    required
                    maxlength="1000"
                  ></textarea>
                  <div class="form-text">{{ newComment.comment.length }}/1000 characters</div>
                </div>

                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="submittingComment || !isCommentValid"
                  >
                    <div v-if="submittingComment" class="spinner-border spinner-border-sm me-2"></div>
                    {{ submittingComment ? (isEditingComment ? 'Updating...' : 'Posting...') : (isEditingComment ? 'Update Review' : 'Post Review') }}
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="cancelComment"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Login prompt -->
            <div v-if="!authStore.isLoggedIn" class="text-center py-4 bg-light rounded mb-4">
              <MessageSquare class="text-muted mb-2" :size="32" />
              <p class="text-muted mb-3">Please log in to leave a review and rating</p>
              <router-link to="/auth/login" class="btn btn-primary">
                Log In
              </router-link>
            </div>

            <!-- Comments List -->
            <div v-if="comments.length > 0" class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item mb-4 p-4 border rounded">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center">
                    <div class="user-avatar bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <User class="text-primary" :size="18" />
                    </div>
                    <div>
                      <h6 class="mb-0">{{ comment.userName }}</h6>
                      <small class="text-muted">{{ formatDate(comment.createdAt) }}</small>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="d-flex align-items-center mb-1">
                      <div class="stars me-2">
                        <Star
                          v-for="i in 5"
                          :key="i"
                          :size="16"
                          :class="i <= comment.overallRating ? 'text-warning' : 'text-muted'"
                          :fill="i <= comment.overallRating ? 'currentColor' : 'none'"
                        />
                      </div>
                      <span class="badge bg-warning text-dark">{{ comment.overallRating }}/5</span>
                    </div>
                  </div>
                </div>

                <!-- Aspect Ratings Display -->
                <div class="aspect-ratings-display mb-3 p-2 bg-light rounded">
                  <div class="row g-2 text-center">
                    <div class="col-3">
                      <div class="small">
                        <ThumbsUp class="text-success mb-1" :size="14" />
                        <div class="fw-bold small">{{ comment.aspectRatings.helpfulness }}/5</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Helpful</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="small">
                        <Eye class="text-primary mb-1" :size="14" />
                        <div class="fw-bold small">{{ comment.aspectRatings.clarity }}/5</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Clear</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="small">
                        <Target class="text-info mb-1" :size="14" />
                        <div class="fw-bold small">{{ comment.aspectRatings.relevance }}/5</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Relevant</div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="small">
                        <CheckCircle class="text-warning mb-1" :size="14" />
                        <div class="fw-bold small">{{ comment.aspectRatings.accuracy }}/5</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Accurate</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p class="comment-text mb-3">{{ comment.comment }}</p>

                <div class="comment-actions d-flex justify-content-between align-items-center">
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-outline-success btn-sm"
                      @click="markHelpful(comment.id!)"
                      :disabled="!authStore.isLoggedIn"
                    >
                      <ThumbsUp class="me-1" :size="14" />
                      Helpful ({{ comment.helpful }})
                    </button>
                  </div>
                  <div>
                    <button 
                      class="btn btn-outline-danger btn-sm"
                      @click="reportComment(comment.id!)"
                      :disabled="!authStore.isLoggedIn"
                    >
                      <Flag class="me-1" :size="14" />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No comments -->
            <div v-else class="text-center py-5">
              <MessageSquare class="text-muted mb-3" :size="48" />
              <h6 class="text-muted">No reviews yet</h6>
              <p class="text-muted">Be the first to share your thoughts about this resource!</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="text-center mt-4">
          <router-link to="/resources/list" class="btn btn-outline-primary">
            <ArrowLeft class="me-2" :size="16" />
            Back to Resources
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Success/Error Toast -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div 
      id="commentToast" 
      class="toast" 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
    >
      <div class="toast-header">
        <CheckCircle v-if="toastType === 'success'" class="text-success me-2" :size="16" />
        <AlertCircle v-else class="text-danger me-2" :size="16" />
        <strong class="me-auto">{{ toastType === 'success' ? 'Success' : 'Error' }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Star, User, Calendar, MessageSquare, Plus, ThumbsUp, Flag, ArrowLeft, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Eye, Target } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { 
  resourcesService, 
  resourceCommentsService, 
  type Resource, 
  type ResourceComment 
} from '@/services/firestore'

const route = useRoute()
const authStore = useAuthStore()

const resource = ref<Resource | null>(null)
const comments = ref<ResourceComment[]>([])
const userComment = ref<ResourceComment | null>(null)
const isEditingComment = ref(false)
const showCommentForm = ref(false)
const submittingComment = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const newComment = ref({
  overallRating: 0,
  aspectRatings: {
    helpfulness: 0,
    clarity: 0,
    relevance: 0,
    accuracy: 0
  },
  comment: ''
})

const isCommentValid = computed(() => {
  return newComment.value.overallRating > 0 &&
         newComment.value.aspectRatings.helpfulness > 0 &&
         newComment.value.aspectRatings.clarity > 0 &&
         newComment.value.aspectRatings.relevance > 0 &&
         newComment.value.aspectRatings.accuracy > 0 &&
         newComment.value.comment.trim().length > 0
})

const loadResource = async () => {
  const resourceId = route.params.id as string
  const result = await resourcesService.getById(resourceId)
  
  if (result.success) {
    resource.value = result.data!
  } else {
    console.error('Failed to load resource:', result.error)
  }
}

const loadComments = async () => {
  if (!resource.value?.id) {
    console.log('loadComments: No resource ID available')
    return
  }

  console.log('Loading comments for resource:', resource.value.id)
  const result = await resourceCommentsService.getResourceComments(resource.value.id)

  if (result.success) {
    console.log('Comments loaded successfully:', result.data?.length || 0, 'comments')
    comments.value = result.data || []
  } else {
    console.error('Failed to load comments:', result.error)
  }
}

const loadUserComment = async () => {
  if (!resource.value?.id || !authStore.user) return

  console.log('Loading user comment for user:', authStore.user.id, 'resource:', resource.value.id)
  const result = await resourceCommentsService.getUserComment(resource.value.id, authStore.user.id)

  if (result.success) {
    console.log('User comment result:', result.data)
    userComment.value = result.data ?? null
    if (userComment.value) {
      console.log('User has existing comment:', (userComment.value as any).id)
      // Pre-fill form with existing comment data
      const comment = userComment.value as any
      newComment.value = {
        overallRating: comment.overallRating,
        aspectRatings: { ...comment.aspectRatings },
        comment: comment.comment
      }
      isEditingComment.value = true
    } else {
      console.log('User has no existing comment')
    }
  } else {
    console.error('Failed to load user comment:', result.error)
  }
}

const submitComment = async () => {
  if (!resource.value?.id || !authStore.user) return
  
  submittingComment.value = true
  
  try {
    let result
    
    if (isEditingComment.value && userComment.value?.id) {
      // Update existing comment
      result = await resourceCommentsService.update(userComment.value.id, {
        overallRating: newComment.value.overallRating,
        aspectRatings: newComment.value.aspectRatings,
        comment: newComment.value.comment.trim(),
        resourceId: resource.value.id
      })
    } else {
      // Create new comment
      result = await resourceCommentsService.create({
        resourceId: resource.value.id,
        userId: authStore.user.id,
        userName: authStore.user.displayName,
        userEmail: authStore.user.email,
        overallRating: newComment.value.overallRating,
        aspectRatings: newComment.value.aspectRatings,
        comment: newComment.value.comment.trim()
      })
    }
    
    if (result.success) {
      showToast(isEditingComment.value ? 'Review updated successfully!' : 'Review posted successfully!', 'success')
      cancelComment()
      await loadUserComment()
      await loadComments()
      await loadResource() // Reload to get updated stats
    } else {
      showToast(result.error || (isEditingComment.value ? 'Failed to update review' : 'Failed to post review'), 'error')
    }
  } catch (error) {
    console.error('Error posting comment:', error)
    showToast(isEditingComment.value ? 'Failed to update review' : 'Failed to post review', 'error')
  } finally {
    submittingComment.value = false
  }
}

const cancelComment = () => {
  showCommentForm.value = false
  isEditingComment.value = false
  newComment.value = {
    overallRating: 0,
    aspectRatings: {
      helpfulness: 0,
      clarity: 0,
      relevance: 0,
      accuracy: 0
    },
    comment: ''
  }
  
  // If user has existing comment, reload it
  if (userComment.value) {
    loadUserComment()
  }
}

const markHelpful = async (commentId: string) => {
  const result = await resourceCommentsService.markHelpful(commentId)
  
  if (result.success) {
    showToast('Thank you for your feedback!', 'success')
    await loadComments()
  } else {
    showToast('Failed to mark as helpful', 'error')
  }
}

const reportComment = async (commentId: string) => {
  if (confirm('Are you sure you want to report this comment?')) {
    const result = await resourceCommentsService.reportComment(commentId)
    
    if (result.success) {
      showToast('Comment reported successfully', 'success')
      await loadComments()
    } else {
      showToast('Failed to report comment', 'error')
    }
  }
}

const formatDate = (dateString: any) => {
  if (!dateString) return 'Unknown date'
  
  let date: Date
  if (dateString && typeof dateString.toDate === 'function') {
    date = dateString.toDate()
  } else {
    date = new Date(dateString)
  }
  
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

const getCategoryBadgeClass = (category: string) => {
  const classes: { [key: string]: string } = {
    'Anxiety': 'bg-primary',
    'Depression': 'bg-success',
    'Stress': 'bg-warning',
    'Relationships': 'bg-info',
    'Wellness': 'bg-secondary'
  }
  return classes[category] || 'bg-secondary'
}

const showToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  
  const toastElement = document.getElementById('commentToast')
  if (toastElement) {
    const toast = new (window as any).bootstrap.Toast(toastElement)
    toast.show()
  }
}

onMounted(async () => {
  await loadResource()
  if (resource.value?.id) {
    await Promise.all([
      loadComments(),
      loadUserComment()
    ])
  }
})
</script>

<style scoped>
.stars {
  display: flex;
  gap: 2px;
}

.rating-input {
  display: flex;
  gap: 4px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-star {
  transition: all 0.2s ease;
}

.rating-star:hover {
  transform: scale(1.1);
}

.aspect-rating-item {
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.aspect-rating-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.aspect-score {
  font-size: 1.25rem;
  color: var(--bs-primary);
}

.aspect-rating-input {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: white;
  transition: border-color 0.2s ease;
}

.aspect-rating-input:hover {
  border-color: var(--bs-primary);
}

.aspect-ratings-display {
  border: 1px solid #e9ecef;
}

.comment-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-text {
  line-height: 1.8;
  font-size: 1.1rem;
}

.resource-meta {
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 0;
}

.comment-form {
  border: 2px dashed #dee2e6;
}

.rating-summary {
  min-width: 200px;
}

.aspect-ratings-summary {
  border: 1px solid #e9ecef;
}

.toast {
  min-width: 300px;
}
</style>