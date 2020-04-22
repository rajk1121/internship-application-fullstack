class blanAttributeRewriter1 {


  element(element) {
    element.setAttribute('target', '_blank')
  }
}
class blanAttributeRewriter0 {


  element(element) {
    element.setAttribute('target', '_blank')
  }
}
class TitleRewriter1 {


  element(element) {
    element.setInnerContent('Go To Omnifood')
  }
}
class TitleRewriter0 {


  element(element) {
    element.setInnerContent('Go To Portfolio')
  }
}
class AttributeRewriter1 {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', 'https://omnifoodraj.herokuapp.com/')
      )
    }
  }
}
class AttributeRewriter0 {
  constructor(attributeName) {
    this.attributeName = attributeName
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', 'https://rajk1121.github.io/portfolio/')
      )
    }
  }
}
class h1Rewriter1 {
  element(element) {
    element.setInnerContent('Let\'s Go To Omnifood')
  }
}

class h1Rewriter0 {
  element(element) {
    element.setInnerContent('Let\'s Go To Portfolio')
  }
}

class pRewriter1 {
  element(element) {
    element.setInnerContent('Omnifood is a full stack web project made by me that have frontend(HTML, CSS, jQuery), backend(Authentication, Routing, MVC) and checkout facilites')
  }
}
class pRewriter0 {
  element(element) {
    element.setInnerContent('You are going to see the portfolio website made by me. Click below to have a look')
  }
}

class aRewriter1 {
  element(element) {
    element.setInnerContent('Dive to Omnifood Website')
  }
}

class aRewriter0 {
  element(element) {
    element.setInnerContent('Dive to Portfolio')
  }
}
const rewriter0 = new HTMLRewriter()
  .on('a#url', new AttributeRewriter0('href'))
  .on('title', new TitleRewriter0())
  .on('h1#title', new h1Rewriter0())
  .on('p#description', new pRewriter0)
  .on('a#url', new aRewriter0)
  .on('a#url', new blanAttributeRewriter0)

const rewriter1 = new HTMLRewriter()
  .on('a#url', new AttributeRewriter1('href'))
  .on('title', new TitleRewriter1())
  .on('h1#title', new h1Rewriter1())
  .on('p#description', new pRewriter1)
  .on('a#url', new aRewriter1)
  .on('a#url', new blanAttributeRewriter1)



addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))

})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
    let cookies = request.headers.get('Cookie')
    console.log(cookies)
    if (cookies && cookies.includes("pageTo=variant1")) {
      response = await response.json()
      let newResponse = await fetch(response.variants[0])
      newResponse = await newResponse.text()
      response = new Response(newResponse, {
        headers: { 'content-type': 'text/html' },
      })
      return rewriter0.transform(response);
    }
    else if (cookies && cookies.includes("pageTo=variant2")) {
      response = await response.json()
      let newResponse = await fetch(response.variants[1])
      newResponse = await newResponse.text()
      response = new Response(newResponse, {
        headers: { 'content-type': 'text/html' },
      })
      return rewriter1.transform(response);
    }

    let i = Math.ceil(Math.random() * 2);
    response = await response.json()
    let url = response.variants[i - 1];
    let newResponse = await fetch(url);
    newResponse = await newResponse.text();
    response = new Response(newResponse, {
      headers: { 'content-type': 'text/html' },
    })
    response.headers.append("Set-Cookie", "pageTo=variant" + i)
    console.log('hello')
    if (i == 1) {

      return rewriter0.transform(response);
    } else {
      return rewriter1.transform(response);
    }
    return rewriter.transform(response);
  } catch (err) {
    return new Response(err.stack || err)
  }


}

