// See http://brunch.io for documentation.
exports.npm = {
    styles: {
        blaze: ['dist/blaze.min.css']
    }
};
exports.files = {
    javascripts: {
        joinTo: {
            'js/app.js': /^app/,
            'js/vendor.js': /^node_modules/
        }
    },
    stylesheets: {
        joinTo: {
            'css/vendor.css': /^node_modules/
        }
    },
    templates: {joinTo: 'js/app.js'}
};
