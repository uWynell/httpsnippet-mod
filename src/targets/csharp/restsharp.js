'use strict'

const CodeBuilder = require('../../helpers/code-builder')
const helpers = require('../../helpers/headers')

module.exports = function (source, options) {
  const code = new CodeBuilder()
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  if (methods.indexOf(source.method.toUpperCase()) === -1) {
    return 'Method not supported'
  } else {
    code.push('var client = new RestClient("%q");', source.fullUrl)
    code.push('var request = new RestRequest(Method.%s);', source.method.toUpperCase())
  }

  // Add headers, including the cookies
  const headers = Object.keys(source.headersObj)

  // construct headers
  if (headers.length) {
    headers.forEach(function (key) {
      code.push('request.AddHeader("%q", "%q");', key, source.headersObj[key])
    })
  }

  // construct cookies
  if (source.cookies.length) {
    source.cookies.forEach(function (cookie) {
      code.push('request.AddCookie("%q", "%q");', cookie.name, cookie.value)
    })
  }

  if (source.postData.text) {
    code.push(
      'request.AddParameter("%q", %s, ParameterType.RequestBody);',
      helpers.getHeader(source.allHeaders, 'content-type'),
      JSON.stringify(source.postData.text)
    )
  }

  code.push('IRestResponse response = client.Execute(request);')
  return code.join()
}

module.exports.info = {
  key: 'restsharp',
  title: 'RestSharp',
  link: 'http://restsharp.org/',
  description: 'Simple REST and HTTP API Client for .NET'
}
