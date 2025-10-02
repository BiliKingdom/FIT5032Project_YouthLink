<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h1 class="mb-4">Accessibility Statement</h1>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Our Commitment</h2>
            <p>
              YouthLink is committed to ensuring digital accessibility for people with disabilities. We
              are continually improving the user experience for everyone and applying the relevant
              accessibility standards.
            </p>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Conformance Status</h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and
              developers to improve accessibility for people with disabilities. It defines three levels
              of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p>
              <strong>YouthLink is partially conformant with WCAG 2.1 level AA.</strong> Partially
              conformant means that some parts of the content do not fully conform to the accessibility
              standard.
            </p>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Accessibility Features</h2>
            <ul class="list-unstyled">
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Keyboard Navigation:</strong> All interactive elements can be accessed using
                keyboard only (Tab, Enter, Arrow keys).
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Screen Reader Support:</strong> ARIA labels and live regions for screen reader
                announcements.
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Focus Indicators:</strong> Clear visual focus indicators for keyboard
                navigation (3px blue outline).
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Skip Navigation:</strong> Skip to main content link for faster navigation.
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Color Contrast:</strong> Text and interactive elements meet WCAG AA contrast
                requirements (4.5:1 for normal text).
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Responsive Design:</strong> Works on various screen sizes and devices.
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Semantic HTML:</strong> Proper use of headings, landmarks, and semantic
                elements.
              </li>
              <li class="mb-3">
                <CheckCircle :size="20" class="text-success me-2" />
                <strong>Form Labels:</strong> All form inputs have associated labels.
              </li>
            </ul>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Compatible Technologies</h2>
            <p>This website is designed to be compatible with the following assistive technologies:</p>
            <ul>
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
            <p>
              This website should be compatible with recent versions of the following browsers on
              Windows, macOS, and Linux:
            </p>
            <ul>
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Microsoft Edge</li>
              <li>Apple Safari</li>
            </ul>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Limitations and Known Issues</h2>
            <p>
              Despite our best efforts to ensure accessibility of YouthLink, there may be some
              limitations. Below is a description of known limitations and potential solutions:
            </p>
            <ul>
              <li class="mb-2">
                <strong>Third-party content:</strong> Some embedded content from third parties may not
                be fully accessible.
              </li>
              <li class="mb-2">
                <strong>Dynamic content:</strong> Some dynamically loaded content may require page
                refresh for screen readers.
              </li>
              <li class="mb-2">
                <strong>Complex forms:</strong> Multi-step forms may require additional navigation
                time.
              </li>
            </ul>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of YouthLink. Please let us know if you
              encounter accessibility barriers:
            </p>
            <ul class="list-unstyled mb-0">
              <li class="mb-2">
                <Mail :size="18" class="me-2" />
                Email: <a href="mailto:accessibility@youthlink.org">accessibility@youthlink.org</a>
              </li>
              <li class="mb-2">
                <MapPin :size="18" class="me-2" />
                Contact form: <router-link to="/contact">Contact Us</router-link>
              </li>
            </ul>
            <p class="mt-3 mb-0">
              We try to respond to feedback within 5 business days.
            </p>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h4 mb-3">Technical Specifications</h2>
            <p>
              Accessibility of YouthLink relies on the following technologies to work with the
              particular combination of web browser and any assistive technologies or plugins installed
              on your computer:
            </p>
            <ul>
              <li>HTML5</li>
              <li>WAI-ARIA</li>
              <li>CSS3</li>
              <li>JavaScript (Vue.js 3)</li>
            </ul>
            <p class="mb-0">
              <small class="text-muted">
                Last updated: {{ new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck as CheckCircle, Mail, MapPin } from 'lucide-vue-next'
</script>

<style scoped>
h1 {
  color: #0066CC;
  font-weight: 700;
}

h2 {
  color: #333;
  font-weight: 600;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

a {
  color: #0066CC;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul {
  line-height: 1.8;
}

li {
  display: flex;
  align-items: flex-start;
}
</style>
