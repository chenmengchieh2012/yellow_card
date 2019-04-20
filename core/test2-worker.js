module.exports = {
  firstValue: null,
  sort: function(list) {
    let sorted = list.sort();
    this.firstValue = sorted[0]
  }
}