import { setupCache } from 'axios-cache-adapter'

const createCacheAdapter = (cacheStore) => {
  return setupCache({
    maxAge: 15 * 60 * 1000,
    store: cacheStore,
    exclude: {
      filter: (request) => {
        //console.log('filtering request')
        //console.log(request)

        // TODO: Use some kind of constant/mapping... or make this configurable
        // For the purposes of the Indigo app, we pretty much only want to cache requests
        // and responses for code types and other things that don't change much!
        const inclusionRegexArr = [
          /api\/v1\/codes/,
          /api\/v1\/deals\/lendersPrograms/
        ]

        // Don't cache any requests by default
        let exclude = true

        for (let idx = 0; idx < inclusionRegexArr.length; idx++) {
          // TODO: Abstract? baseURL is specific to axios-cache-adapter
          if (request.baseURL.match(inclusionRegexArr[idx]) !== null) {
            exclude = null
            break
          }
        }

        return exclude
      }
    },
    // TODO: Remove in production, in a manner to-be-determined...
    debug: false
  })
}

export { createCacheAdapter }
