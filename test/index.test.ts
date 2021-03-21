import { expect, use } from "chai";
import * as chaiSubset from "chai-subset";
import { POSTALCODE, PostalCode } from "../src";
import PostalCodeError from "../src/utils/errors/PostalCodeError";
import ExampleBR, { ServiceOptions } from "./plugins/exampleBR";
import ExampleUS from "./plugins/exampleUS";
use(chaiSubset);

describe(`Test for PostCode ${new Date().getTime()}`, () => {
  let postCode: PostalCode;
  before(() => {
    postCode = new PostalCode({ timeout: 30000 })
      .use<ServiceOptions>(ExampleBR)
      .use(ExampleUS);
  });

  describe("when imported", () => {
    it("should return a object", () => {
      expect(postCode).to.be.a("object");
    });
  });

  describe("when invoked", () => {
    it("Should return a function", () => {
      expect(postCode.get).to.be.a("function");
    });
    it("should return promise", () => {
      expect(postCode.get("").then).to.be.a("function");
      expect(postCode.get("").catch).to.be.a("function");
    });
  });

  describe("when use invalid plugin", () => {
    describe("and pass undefined plugin", () => {
      it("should return an throw plugin undefined error", () => {
        //@ts-expect-error pass invalid plugin ServiceModule
        expect(() => postCode.use()).to.throw(
          Error,
          "You are passing an undefined plugin, Please check the plugin you are passing to postalCode.use()."
        );
      });
    });
    describe("and pass Anonyomous class", () => {
      it("should return an undefined plugin type error ", () => {
        //@ts-expect-error pass invalid plugin ServiceModule type
        expect(() => postCode.use(class {})).to.throw(
          Error,
          "You are passing an undefined plugin type, Please check the object you are passing to postalCode.use()."
        );
      });
    });
    describe("and pass type plugin invalid", () => {
      it("should return an undefined plugin type Service error", () => {
        expect(() =>
          postCode.use(
            //@ts-expect-error pass invalid plugin ServiceModule type
            class {
              type: string;
              constructor() {
                this.type = "Other"; //expect Service
              }
            }
          )
        ).to.throw(
          Error,
          "Check the type of plugin passed to postalCode.use()."
        );
      });
    });
  });

  describe("when sent emply postal code", () => {
    it("Should return throw Error", async () => {
      await postCode.get("").catch((error) => {
        expect(error).to.be.containSubset({
          message: "insert valid postalcode",
          type: "Error",
          country: "*",
        } as PostalCodeError);
      });
    });
  });

  describe("when sent object in postal code", () => {
    it("Should return throw Error", async () => {
      //@ts-expect-error sent invalid postal code
      await postCode.get({}).catch((error) => {
        expect(error).to.be.containSubset({
          message: "no valid string or number",
          type: "Error",
          country: "*",
        } as PostalCodeError);
      });
    });
  });

  describe("when send valid Postal Code", () => {
    describe("and not input one plugin", () => {
      it("should return a valid postal code object, searching all providers ", async () => {
        const code = new PostalCode(); //dont input plugin provider
        await code.get("46430-000").catch((error) => {
          expect(error).to.be.containSubset({
            message:
              "input one or more providers plugin, invoke postalcode.use(Provider).",
            type: "Error",
            country: "*",
          } as PostalCodeError);
        });
      });
    });

    describe("and suppress the country", () => {
      it("should return a valid postal code object, searching all providers ", async () => {
        await postCode.get("46430-000").then((data) => {
          expect(data).to.deep.equal({
            postalcode: "46430000",
            state: "BA",
            city: "Guanambi",
            neighborhood: "",
            street: "",
            service: "ExampleBR",
          } as POSTALCODE);
        });
      });
    });

    describe("and pass arguments country ExampleBR", () => {
      it("should return a valid postal code object, search in filtred providers", async () => {
        await postCode.get("46430-000", "BR").then((data) => {
          expect(data).to.deep.equal({
            postalcode: "46430000",
            state: "BA",
            city: "Guanambi",
            neighborhood: "",
            street: "",
            service: "ExampleBR",
          } as POSTALCODE);
        });
      });
    });

    describe("and pass arguments country ExampleUS", () => {
      it("should return a valid postal code object, search in filtred providers", async () => {
        await postCode.get("30301", "US").then((data) => {
          expect(data).to.deep.equal({
            postalcode: "30301",
            state: "GA",
            city: "Atlanta",
            neighborhood: "Fulton",
            street: "",
            service: "ExampleUS",
          } as POSTALCODE);
        });
      });
    });
  });

  describe("and when send invalid PostalCode", () => {
    it("should return an error that it did not find in any provider, searching all providers", async () => {
      await postCode.get("99999999").catch((error) => {
        expect(error).to.containSubset({
          message: "All providers retunerd errors.",
          type: "ProvidersErrors",
          country: "*",
          errors: [
            {
              service: "ExampleBR",
              name: "ServiceError",
              message: "Zip code not found on Example base.",
            },
            {
              service: "ExampleUS",
              name: "ServiceError",
              message: "Invalid code, check your code Example.",
            },
          ],
        } as PostalCodeError);
      });
    });
  });
});
