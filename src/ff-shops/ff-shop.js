Polymer({
  is: 'ff-shop',

  behaviors: [
    FF.WeaponBehavior
  ],

  ready: function() {
    console.log(this.weaponsByName);
  }
});
