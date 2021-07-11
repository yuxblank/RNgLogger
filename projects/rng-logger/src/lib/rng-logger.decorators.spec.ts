import {Logger, LogLevel} from "./rng-logger-api";
import {TestBed} from "@angular/core/testing";
import {RNgLoggerModule} from "./rng-logger.module";
import {Injectable} from "@angular/core";
import {Log} from "./rng-logger.decorators";

describe("RngLogger decorators", () => {

  @Injectable()
  class MyBusinessClass{
    public logger: Logger;

    constructor(logger: Logger) {
      this.logger = logger;
    }

    @Log()
    doSomething(data: any) {

    }

    @Log({
      message: "something has been called",
      level: LogLevel.ERROR
    })
    doSomethingDescribed(data:any){

    }

  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RNgLoggerModule],
      providers: [MyBusinessClass]
    })
  });

  it("Logged should be able to log a method", () => {
    let spy = spyOn(console, "debug");
    let businessClass: MyBusinessClass = TestBed.get(MyBusinessClass);
    businessClass.doSomething({
      data: ["1","2","3"]
    });
    expect(spy).toHaveBeenCalledWith("MyBusinessClass::doSomething", {
      data: ["1","2","3"]
    });
  });
  it("Logged should be able to log a method with description and custom level", () => {
    let spy = spyOn(console, "error");
    let businessClass: MyBusinessClass = TestBed.get(MyBusinessClass);
    const obj = {
      data: {
        fun: (args:any) => {

        }
      }
    }
    businessClass.doSomethingDescribed(obj);
    expect(spy).toHaveBeenCalledWith("MyBusinessClass::doSomethingDescribed something has been called", obj);
  });
});
