<template>
  <div>
    <div class="headline mt-2 ml-5">Balance</div>
    {{file}}
    <hr class="ma-10" />
    {{jnls}}
  </div>
</template>
<script>
export default {
  props: ["file", "jnls"]
  // data(){return file}
};
</script>