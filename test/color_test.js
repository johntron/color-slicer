var colorSlicer = require('../index');
var converter = require("color-convert");

exports.testBasic = function(test) {
  var colors = colorSlicer.getColors(6);
  test.equal(colors.length, 6, 'correct number of colors is produced');
  test.done();
};

exports.testContrast = function(test) {
  var colors = colorSlicer.getRgbColors(10);
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((1+0.05)/(xyz[1]/100+0.05) >= 4.5, 'colors have WCAG AA contrast against white');
  }
  test.done();
};

exports.testBrightContrast = function(test) {
  var colors = colorSlicer.getRgbColors(10, undefined, {type: 'bright'});
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((xyz[1]/100+0.05)/(0+0.05) >= 4.5, 'bright colors have WCAG AA contrast against black');
  }
  test.done();
};

exports.testExpressible = function(test) {
  var colors = colorSlicer.getLabColors(10);
  for (var i = 0; i < colors.length; i++) {
    var lab = colors[i];
    var xyz = converter.lab2xyz(lab);
    var rgb = converter.xyz2rgb(xyz);
    var j;
    for (j = 0; j < 3; j++) {
      test.ok(rgb[j] >= 0, 'colors are expressible in RGB');
    }
    var xyz2 = converter.rgb2xyz(rgb);
    for (j = 0; j < 3; j++) {
      test.ok(xyz[j] == xyz2[j], 'colors are accurately expressible in RGB');
    }
  }
  test.done();
};

exports.testBrightExpressible = function(test) {
  var colors = colorSlicer.getLabColors(10, undefined, {type: 'bright'});
  for (var i = 0; i < colors.length; i++) {
    var lab = colors[i];
    var xyz = converter.lab2xyz(lab);
    var rgb = converter.xyz2rgb(xyz);
    var j;
    for (j = 0; j < 3; j++) {
      test.ok(rgb[j] < 256, 'bright colors are expressible in RGB');
    }
    var xyz2 = converter.rgb2xyz(rgb);
    for (j = 0; j < 3; j++) {
      test.ok(xyz[j] == xyz2[j], 'bright colors are accurately expressible in RGB');
    }
  }
  test.done();
};
