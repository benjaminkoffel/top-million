# Top Million

[![CircleCI](https://circleci.com/gh/benjaminkoffel/top-million.svg?style=svg)](https://circleci.com/gh/benjaminkoffel/top-million)

A Firefox extension that restricts requests to the top million most visited sites.

The purpose is to prevent phishing attacks where domains are often newly acquired or have a poor reputation.

There is also functionality to add exclusions via a whitelist of trusted domains.

## Usage

```
npm install --global web-ext
web-ext run --verbose
```

## References 

- https://github.com/mdn/webextensions-examples/tree/master/proxy-blocker
- http://downloads.majestic.com/majestic_million.csv
