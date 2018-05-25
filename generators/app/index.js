var Generator = require('yeoman-generator')

function addModule(fcontent, reg, moduleName, onlyName) {
  const index = fcontent.match(reg).index
  const fleft = fcontent.substring(0, index)
  const fcenter = onlyName
    ? `,${moduleName}`
    : `import ${moduleName} from './${moduleName}.module'`
  const br = '\n'
  const fright = fcontent.substring(index)
  fcontent = `${fleft}${fcenter}${br}${fright}`
  return fcontent
}

module.exports = class extends Generator {
  prompting() {
    let that = this
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'module name',
        default: this.appname // Default to current folder name
      }
    ]).then((data) => {
      this.log('module name', data.name)
      this.moduleName = data.name
    })
  }

  configuring() {
    let fcontent = this.fs.read('sdkjs/word/Editor/Document-Module/index.js')

    const regImport = new RegExp('// import')
    const regExport = new RegExp('// export')

    fcontent = addModule(fcontent, regImport, this.moduleName)
    this.fcontent = addModule(fcontent, regExport, this.moduleName, true)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('module.ejs'),
      this.destinationPath(`sdkjs/word/Editor/Document-Module/${this.moduleName}.module.js`),
      { moduleName: this.moduleName }
    )
  }

  end() {
    this.fs.write(`sdkjs/word/Editor/Document-Module/index.js`, this.fcontent)
  }
}
