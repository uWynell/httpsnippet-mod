'use strict'

const CodeBuilder = require('../../helpers/code-builder')
const helpers = require('../../helpers/headers')

module.exports = function (command) {
  return function (source, options) {
    const code = new CodeBuilder()
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

    if (methods.indexOf(source.method.toUpperCase()) === -1) {
      return 'Method not supported'
    }

    const commandOptions = []

    // Add headers, including the cookies
    const headers = Object.keys(source.headersObj)

    // construct headers
    if (headers.length) {
      code.push('$headers=@{}')
      headers.forEach(function (key) {
        if (key !== 'connection') { // Not allowed
          code.push('$headers.Add("%q", "%q")', key, source.headersObj[key])
        }
      })
      commandOptions.push('-Headers $headers')
    }

    // construct cookies
    if (source.cookies.length) {
      code.push('$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession')

      source.cookies.forEach(function (cookie) {
        code.push('$cookie = New-Object System.Net.Cookie')

        code.push("$cookie.Name = '%s'", cookie.name)
        code.push("$cookie.Value = '%s'", cookie.value)
        code.push("$cookie.Domain = '%s'", source.uriObj.host)

        code.push('$session.Cookies.Add($cookie)')
      })
      commandOptions.push('-WebSession $session')
    }

    if (source.postData.text) {
      commandOptions.push("-ContentType '" + helpers.getHeader(source.allHeaders, 'content-type') + "'")
      commandOptions.push("-Body '" + source.postData.text + "'")
    }

    code.push("$response = %s -Uri '%s' -Method %s %s", command, source.fullUrl, source.method, commandOptions.join(' '))
    return code.join()
  }
}
