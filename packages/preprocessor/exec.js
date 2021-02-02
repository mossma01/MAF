var glob=require('glob')
var defaultSteps=require('./apply')
var appRoot
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'src', type: String, defaultOption: true }
]
const options=commandLineArgs(optionDefinitions)

if(options.src) {
  appRoot=options.src
}
if(!appRoot) {
appRoot = require('app-root-path');
}
try {
require(appRoot + '/apply.js')
} catch(e) {
}
var destDir = appRoot+'/destination'
var featureDir=appRoot+'/features'

var a=glob.sync("**/*.feature", {cwd: `${appRoot}/features`})
var fs=require('fs')
var outDir=appRoot+'/tmp/features/'
if (!fs.existsSync(appRoot+'/tmp')){
    fs.mkdirSync(appRoot+'/tmp');
}
if (!fs.existsSync(appRoot+'/tmp/features')){
    fs.mkdirSync(appRoot+'/tmp/features');
}
async function run(file) {
  var fileName=file
  var file=fs.readFileSync(appRoot+"/features/"+file, 'utf8')
  var lines=file.split("\n")
  var result=[]
  for(var i in lines) {
    var res=await processLine(lines[i])
    if(res===null) {
    }
    else if(typeof res==="object") {
      result.push(...gen(res))
    } else {
      if(res !== null)
        result.push(res)
    }
  }
  const path = require('path');
  var dir=path.dirname(fileName)
  fs.mkdirSync(outDir+dir, { recursive: true });
  fs.writeFileSync(outDir+fileName, result.join("\n"), 'utf8')
}
for(var i in a) {
  var fileName=a[i]
  var processLine=require('./processLine')
  var gen=require('./gen')
  run(fileName)
}
