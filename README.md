# postalcode

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
<script src="https://unpkg.com/@postalcode/postalcode@latest/dist/index-browser.min.js"></script>
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

viaCep.get("05010000").then(console.log);

// {
//   "cep":  "05010000",
//   "state":  "SP",
//   "city":  "São Paulo",
//   "street":  "Rua Caiubí",
//   "neighborhood":  "Perdizes",
// }
```

## how to contribute

Read our contribution guide [here](CONTRIBUTING.md)

## contributors

[<img src="https://avatars1.githubusercontent.com/u/11856399?v=3&s=115" width="115"><br><sub>@weltongbi</sub>](https://github.com/weltongbi)
