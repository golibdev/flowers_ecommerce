const hbsHelpers = (handlebars) => {
  handlebars.registerHelper('paginate', require('handlebars-paginate')),

  handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
}

module.exports = hbsHelpers