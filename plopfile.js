const fs = require('mz/fs')
const { join, resolve } = require('path')
const copyDir = require('recursive-copy')
const promisify = require('promisify-node')
const gitInit = promisify('git-init')
const { exec } = require('child_process')
const rmrf = require('rmrf')

module.exports = function (plop) {
  plop.setGenerator('lib', {
    description: 'initialize a lib skeleton',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'what is the lib name?',
      validate: function (value) {
        if ((/.+/).test(value)) {
          return true
        }
        return 'name is required'
      }
    }, {
      type: 'input',
      name: 'author',
      message: 'what is the lib author?',
      validate: function (value) {
        if ((/.+/).test(value)) {
          return true
        }
        return 'name is required'
      }
    }, {
      type: 'input',
      name: 'githubName',
      message: 'what is the github account name?',
    }, {
      type: 'input',
      name: 'githubEmail',
      message: 'what is the github account email?',
    }],
    actions: [{
      type: 'add',
      path: './{{camelCase name}}/{{camelCase name}}.js',
      templateFile: 'template/lib.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/test/spec_helper.js',
      templateFile: 'template/spec_helper.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/test/{{snakeCase name}}_spec.js',
      templateFile: 'template/lib_spec.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/package.json',
      templateFile: 'template/package.json.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/LICENCE',
      templateFile: 'template/LICENCE.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/README.md',
      templateFile: 'template/README.md.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/.gitignore',
      templateFile: 'template/gitignore.hbs'
    }, {
      type: 'add',
      path: './{{camelCase name}}/.travis.yml',
      templateFile: 'template/travis.yml.hbs'
    },
    function githubInit({author, githubName, githubEmail, name}) {
      const { getPlopfilePath } = plop
      const current = join(getPlopfilePath(), name)
      return gitInit(current)
    },
    function githubRemote({ name, githubName, githubEmail }) {
      return exec(`cd ${name} &&
        git remote add origin git@github.com:${githubName}/${name}.git &&
        git config user.name ${githubName} &&
        git config user.email ${githubEmail}`)
    },
    function copy ({ name }) {
      const { getPlopfilePath } = plop
      const current = join(getPlopfilePath(), name)
      const parent = resolve(getPlopfilePath(), '..', name)

      return copyDir(current, parent, {
	dot: true
       })
    },
    function rmfr({ name }) {
       return rmrf(`./${name}`)
    }
  ]
  })
}
