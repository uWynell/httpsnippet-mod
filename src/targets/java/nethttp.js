/**
 * @description
 * HTTP code snippet generator for Java using java.net.http.
 *
 * @author
 * @wtetsu
 *
 * for any questions or issues regarding the generated code snippet, please open an issue mentioning the author.
 */

'use strict'

const CodeBuilder = require('../../helpers/code-builder')

module.exports = function (source, options) {
  const opts = Object.assign(
    {
      indent: '  '
    },
    options
  )

  const code = new CodeBuilder(opts.indent)

  code.push('HttpRequest request = HttpRequest.newBuilder()')
  code.push(2, '.uri(URI.create("%q"))', source.fullUrl)

  const headers = Object.keys(source.allHeaders)

  // construct headers
  if (headers.length) {
    headers.forEach(function (key) {
      code.push(2, '.header("%q", "%q")', key, source.allHeaders[key])
    })
  }

  if (source.postData.text) {
    code.push(
      2,
      '.method("%q", HttpRequest.BodyPublishers.ofString(%s))',
      source.method.toUpperCase(),
      JSON.stringify(source.postData.text)
    )
  } else {
    code.push(2, '.method("%q", HttpRequest.BodyPublishers.noBody())', source.method.toUpperCase())
  }

  code.push(2, '.build();')

  code.push(
    'HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());'
  )
  code.push('System.out.println(response.body());')

  return code.join()
}

module.exports.info = {
  key: 'nethttp',
  title: 'java.net.http',
  link: 'https://openjdk.java.net/groups/net/httpclient/intro.html',
  description: 'Java Standardized HTTP Client API'
}
