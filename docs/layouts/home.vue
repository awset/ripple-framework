<template>
  <AppLayout background="alt">
    <template #aboveHeader>
      <RplAlertsContainer>
        <RplAlert
          message="These Docs are for Ripple version 2.0. If you are looking for the original Ripple Storybook please click below"
          linkText="View Ripple 1 storybook"
          linkUrl="https://master--5e736ff82649250022dd830c.chromatic.com/"
          alert-id="storybook-alert"
          :isDismissible="false"
        />
      </RplAlertsContainer>
    </template>
    <template #aboveBody>
      <DocsHeroHeader :title="title" :description="subheader" />

      <div class="docs-home-getting-started">
        <div class="rpl-container">
          <DocsHomeSection title="Getting Started">
            <div class="rpl-grid">
              <div class="rpl-col-12 rpl-col-6-m">
                <RplPromoCard v-bind="page.primaryCTA">
                  <p>
                    {{ page.primaryCTA.description }}
                  </p>
                </RplPromoCard>
              </div>
              <div class="rpl-col-12 rpl-col-6-m">
                <RplPromoCard v-bind="page.secondaryCTA">
                  <p>
                    {{ page.secondaryCTA.description }}
                  </p>
                </RplPromoCard>
              </div>
            </div>
          </DocsHomeSection>
        </div>
      </div>
    </template>

    <DocsHomeSection title="Find out more">
      <div class="rpl-grid">
        <div class="rpl-col-12 rpl-col-6-m rpl-col-4-l">
          <RplPromoCard v-bind="page.quickLink1">
            <p>
              {{ page.quickLink1.description }}
            </p>
          </RplPromoCard>
        </div>
        <div class="rpl-col-12 rpl-col-6-m rpl-col-4-l">
          <RplPromoCard v-bind="page.quickLink2">
            <p>
              {{ page.quickLink2.description }}
            </p>
          </RplPromoCard>
        </div>
        <div class="rpl-col-12 rpl-col-12-m rpl-col-4-l">
          <RplPromoCard v-bind="page.quickLink3">
            <p>
              {{ page.quickLink3.description }}
            </p>
          </RplPromoCard>
        </div>
      </div>
    </DocsHomeSection>

    <DocsHomeSection
      v-if="!hideModulesSection && page.modulesCTA"
      title="Using Ripple in SDP sites"
    >
      <div
        class="rpl-grid"
        :style="{ '--rpl-clr-gradient-horizontal': 'var(--rpl-clr-dark)' }"
      >
        <div class="rpl-col-12">
          <RplPromoCard v-bind="page.framework" highlight>
            <p>
              {{ page.framework.description }}
            </p>
          </RplPromoCard>
        </div>
      </div>
    </DocsHomeSection>

    <DocsHomeSection>
      <ContentRenderer
        tag="DocsContent"
        class="content-full"
        v-if="page && !page._empty"
        :key="page._id"
        :value="page"
      >
      </ContentRenderer>
    </DocsHomeSection>

    <template #belowBody>
      <DocsWhatsNew
        v-if="page.whatsNew"
        :title="page.whatsNew.title"
        :links="page.whatsNew.links"
      >
        <RplContent>
          <p>{{ page.whatsNew.description }}</p>
        </RplContent>
      </DocsWhatsNew>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { useContent, useContentHead } from '#imports'
const { page, toc } = useContent()
const { title, subheader, description, hideModulesSection } = useAppConfig()
useContentHead(page)
</script>

<style scoped>
.docs-home-component {
  border-bottom: var(--rpl-border-1) solid var(--rpl-clr-neutral-300);
  padding-bottom: var(--rpl-sp-9);
  margin-bottom: var(--rpl-sp-9);
}

.docs-home-getting-started {
  padding-top: var(--rpl-sp-8);
  padding-bottom: var(--rpl-sp-9);
  background: var(--rpl-clr-accent-alt);

  @media (--rpl-bp-m) {
    padding-top: var(--rpl-sp-9);
    padding-bottom: var(--rpl-sp-10);
  }
}
</style>
