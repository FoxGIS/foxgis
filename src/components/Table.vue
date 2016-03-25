<template>
<table class="mdl-data-table mdl-js-data-table foxgis-table">
  <thead>
      <tr>
        <th v-for="key in columns">{{ key }}</th>
      </tr>
  </thead>
  <tbody>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Don Aubrey</td>
        <td>25</td>
        <td>49021</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Sophia Carson</td>
        <td>32</td>
        <td>10258</td>
      </tr>
      <tr>
        <td class="mdl-data-table__cell--non-numeric">Steve Moreno</td>
        <td>29</td>
        <td>12359</td>
      </tr>
  </tbody>
</table>
</template>


<script>
export default {
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },

  ready() {
    componentHandler.upgradeElement(this.$el)
  }
}

</script>
