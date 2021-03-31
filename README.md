<p align="center">
  <a href="https://npm-stat.com/charts.html?package=@postalcode/postalcode">
    <img src="https://img.shields.io/npm/dm/@postalcode/postalcode.svg" height="20">
  </a>
  <a href='https://coveralls.io/github/postalcode-ws/postalcode'><img src='https://coveralls.io/repos/github/postalcode-ws/postalcode/badge.svg' alt='Coverage Status' height="20" />
  </a>
  <a href="https://badge.fury.io/js/%40postalcode%2Fpostalcode"><img src="https://badge.fury.io/js/%40postalcode%2Fpostalcode.svg" alt="npm version" height="20"></a>
  <a href="https://codeclimate.com/github/postalcode-ws/postalcode/maintainability"><img src="https://api.codeclimate.com/v1/badges/dd28076593486280ea27/maintainability" /></a>
  <a href="https://snyk.io/test/github/postalcode-ws/postalcode"><img src="https://snyk.io/test/github/postalcode-ws/postalcode/badge.svg" data-canonical-src="https://snyk.io/test/github/postalcode-ws/postalcode" alt="Known Vulnerabilities" height="20"></a>
  <a href="https://github.com/postalcode-ws/postalcode/actions/workflows/integration.yml"><img src="https://github.com/postalcode-ws/postalcode/actions/workflows/integration.yml/badge.svg?branch=master" alt="Workflow status badge" loading="lazy" height="20"></a>
  <a href="https://github.com/postalcode-ws/postalcode/actions/workflows/publish.yml"><img src="https://github.com/postalcode-ws/postalcode/actions/workflows/publish.yml/badge.svg?branch=master" alt="Workflow status badge" loading="lazy" height="20"></a>
</p>
# PostalCode

Package Gateway for others gateway promises

## Plugins

PostalCode is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.
| Plugin | Country | README |
| -- | -- | -- |
| _ViaCep_ | `BR` | [plugins/service-via-cep/README.md](https://github.com/postalcode-ws/service-viacep/blob/master/README.md) |

- Contribute for new plugins.

## Installation

#### Browser using CDN

```
<script src="https://unpkg.com/@postalcode/postalcode@latest/dist/index.min.js"></script>
```

#### npm

```
$ npm install --save @postalcode/postalcode
```

#### yarn

```
$ yarn add @postalcode/postalcode
```

#### Typescript

```typescript
import { PostalCode } from "@postalcode/postalcode";
import ViaCepService, { ServiceOptions } from "@postalcode/service-viacep";

const postalCode = new PostalCode({
  /* All Postal Code Options*/
});
postCode.use<ServiceOptions>(ViaCepService, {
  /* All Service Options*/
});

postCode.get("05010000").then(console.log);

// {
//   "postalcode":  "05010000",
//   "state":  "SP",
//   "city":  "São Paulo",
//   "street":  "Rua Caiubí",
//   "neighborhood":  "Perdizes",
// }
```

#### Browser using CDN and plugins CDN

```html
<script src="https://unpkg.com/@postalcode/postalcode@latest/dist/index.min.js"></script>
<script src="https://unpkg.com/@postalcode/service-viacep@latest/dist/index.min.js"></script>

<script>
  const postal = new postalcode({
    /* PostalCode configs*/
  });

  postal.use(serviceViacep, {
    /* Service configs*/
  });

  //postal.use(otherService) accept multiple service

  postal.get("05010000").then(console.log);

  // {
  //   "postalcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
</script>
```

### PostalCode Options

```js
{
  //Filter plugins by country;
  //default: get all postal code in all country plugins inputted in .use()
  //ex: country:"BR" -> get postal code in "BR" country plugins inputted in .use()
  //@type: string
  country: "*",
  //Postal Code length
  //default: is 0, it captur automatic in plugins inserted in .use()
  //@type: number
  postalCodeSize:0,
  //Set All plugins timeout.
  //default: is 30s in milliseconds
  //@type: number
  timeout: 30000
}
```

## how to contribute

Read our contribution guide [here](CONTRIBUTING.md)

## contributors

[<img src="https://avatars1.githubusercontent.com/u/11856399?v=3&s=115" width="115"><br><sub>@weltongbi</sub>](https://github.com/weltongbi)
