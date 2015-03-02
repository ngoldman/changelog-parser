var marked = require('marked')
var lineReader = require('line-reader')
var toMarkdown = require('to-markdown').toMarkdown
var cheerio = require('cheerio')
var regex = /\[?([\w\d\.-]+\.[\w\d\.-]+[a-zA-Z0-9])\]? .*?(\d{4}-\d{2}-\d{2}|\w+)/
var log
var $

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  smartLists: true
})

module.exports = function parse (file) {
  //log = file
  //$ = cheerio.load(marked(file))

  //return {
    //title: getTitle(),
    //versions: getVersions()
  //}
// read all lines:
  var title;
  var versions = [];
  var currentVersion = {}
  var currentBody = ''

  return lineReader.eachLine(file, function(line) {
    if (!title && line[0] == '#') {
      title = line.substring(1).trim()
      return
    }

    var version = regex.exec(line)
    if (version) {
      currentVersion.body = currentBody
      versions.push(currentVersion)
      currentBody = ''
      currentVersion = {version: version[1]}
    } else {
      currentBody += line.trim()
    }
  }).then(function () {
    currentVersion.body = currentBody
    versions.push(currentVersion)
    console.log(versions)
    return {
      title: title,
      versions: versions
    }
  })
}







function getTitle () {
  return $('h1').text()
}

function getVersions () {
  var arr = []

  var versions = $('h2').filter(function () {
    return regex.test($(this).text())
  })

  versions.each(function () {
    var version = $(this).text()
    arr.push({
      version: version,
      body: getBody(version)
    })
  })

  return arr
}

function getBody (version) {
  // stuff each line past version into a string until we get to another ##
}
