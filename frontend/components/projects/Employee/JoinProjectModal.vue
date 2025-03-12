<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        text="Join project"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Join Project"
        class="pa-4"
      >
        <JoinProject
          :after-submit="
            () => {
              isActive.value = false;
            }
          "
        />
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup></script>
