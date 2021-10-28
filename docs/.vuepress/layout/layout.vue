<template>
  <Layout>
    <template #page-top>
      <Anchor v-show="anchorRight" />
    </template>
    <template #page-bottom>
      <footer class="docs-footer page-meta">
        <div :class="$style.footerContainer" role="presentation">
          <div :class="$style.docsInfo">
            MIT Licensed | Copyright © 2005-present 58.com
          </div>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'

const frontmatter = usePageFrontmatter()

// 默认隐藏
const anchorRight = ref(frontmatter.value.anchorRight ?? false)
</script>

<style module lang="scss">
.footerContainer {
  .docsInfo {
    display: grid;
    place-items: center;
    padding-top: 20px;
    text-align: center;
  }
}
</style>
