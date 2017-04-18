<script>
(function(scope) {
  scope.FF = scope.FF || {};

  scope.FF.MapBehavior = {
    properties: {
      definition: String, // name of the JSON file containing sprite definitions
      sprites: String, // name of the JSON file containing sprites

      Maps: {
        type: Object,
        value: {
          CONERIA: 'coneria'
        }
      }
    },


  };
}(window));
</script>