'use strict'


var Empresa = require('../models/empresas.model');

function pdf(){
    var sys = require('util');
  var fs = require('fs');
  var pdf = require('pdf').pdf;
  var pdf2 = require('pdf').pdf;

  /* create the PDF document */

  var doc = new pdf();
  doc.text(20, 20, 'hello, I am PDF.');
  doc.text(20, 30, 'i was created using node.js version: ' + process.version);
  doc.text(20, 40, 'i can also be created from the browser');


  
  /* optional - set properties on the document */
  doc.setProperties({
  	title: 'A sample document created by pdf.js',
  	subject: 'PDFs are kinda cool, i guess',		
  	author: 'Marak Squires',
  	keywords: 'pdf.js, javascript, Marak, Marak Squires',
  	creator: 'pdf.js'
  });
  doc.addPage();

  doc.setFontSize(22);
  doc.text(20, 20, 'This is a title');

  doc.setFontSize(16);
  doc.text(20, 30, 'This is some normal sized text underneath.');

  var fileName = "Prueba2.pdf";

  fs.writeFile(fileName, doc.output(), function(err, data){
    sys.puts(fileName +' was created! great success!');
  });
}


module.exports = {
    pdf
}